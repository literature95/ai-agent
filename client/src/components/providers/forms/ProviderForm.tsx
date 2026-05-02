import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiKeyInput } from "./ApiKeyInput";
import { ModelSelector } from "./ModelSelector";
import { ProviderPresetSelector } from "./ProviderPresetSelector";
import { API_FORMATS } from "@/config/constants";
import { providerFormSchema, type ProviderFormValues } from "@/lib/schemas/provider";
import { providersApi } from "@/lib/api/providers";
import type { ProviderPreset } from "@/config/providerPresets";
import type { FetchedModel } from "@/types";

interface ProviderFormProps {
  defaultValues?: Partial<ProviderFormValues>;
  onSubmit: (values: ProviderFormValues) => Promise<void>;
  submitLabel?: string;
  providerId?: string;
}

export function ProviderForm({ defaultValues, onSubmit, submitLabel, providerId }: ProviderFormProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<string[]>([]);

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      name: "",
      apiKey: "",
      baseUrl: "",
      model: "",
      apiFormat: "openai-compatible",
      websiteUrl: "",
      notes: "",
      ...defaultValues,
    },
  });

  const handlePresetSelect = useCallback(
    (preset: ProviderPreset) => {
      form.setValue("name", preset.name);
      form.setValue("baseUrl", preset.baseUrl);
      form.setValue("apiFormat", preset.apiFormat);
      if (preset.defaultModel) form.setValue("model", preset.defaultModel);
      if (preset.websiteUrl) form.setValue("websiteUrl", preset.websiteUrl);
      if (preset.icon) form.setValue("icon", preset.icon);
      if (preset.iconColor) form.setValue("iconColor", preset.iconColor);
    },
    [form],
  );

  const handleFetchModels = useCallback(async () => {
    const baseUrl = form.getValues("baseUrl");
    const apiKey = form.getValues("apiKey");
    if (!baseUrl || !apiKey) {
      toast.error(t("providers.fillFieldsFirst"));
      return;
    }

    // Use a temporary provider ID or direct fetch
    try {
      const res = await fetch("/api/providers/_models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl, apiKey }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: t("providerForm.modelsFetchFailed") }));
        throw new Error(err.error || t("providerForm.modelsFetchFailed"));
      }
      const data = await res.json() as { models: FetchedModel[] };
      const modelIds = data.models.map((m) => m.id);
      setModels(modelIds);
      toast.success(t("providers.modelsFound", { count: modelIds.length }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("providerForm.modelsFetchFailed"));
    }
  }, [form]);

  const handleSubmit = async (values: ProviderFormValues) => {
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("providers.saveFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 overflow-y-auto flex-1 px-6 py-4">
        <div className="mb-2">
          <ProviderPresetSelector onSelect={handlePresetSelect} />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("providerForm.name")} *</FormLabel>
              <FormControl>
                <Input placeholder={t("providerForm.namePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apiFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("providerForm.apiFormat")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("providerForm.apiFormat")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {API_FORMATS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("providerForm.apiKey")} *</FormLabel>
              <FormControl>
                <ApiKeyInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={form.watch("apiFormat") === "anthropic" ? "sk-ant-..." : "sk-..."}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="baseUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("providerForm.baseUrl")} *</FormLabel>
              <FormControl>
                <Input placeholder={t("providerForm.baseUrlPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("providerForm.model")}</FormLabel>
              <FormControl>
                <ModelSelector
                  value={field.value || ""}
                  onChange={field.onChange}
                  models={models}
                  onFetchModels={handleFetchModels}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("providerForm.websiteUrl")}</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("providerForm.notes")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("providerForm.notesPlaceholder")} {...field} className="min-h-[60px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-blue-500 text-white px-4 py-2 text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? t("common.saving") : (submitLabel || t("providers.addProvider"))}
          </button>
        </div>
      </form>
    </Form>
  );
}
