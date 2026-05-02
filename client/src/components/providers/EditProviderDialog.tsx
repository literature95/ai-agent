import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProviderForm } from "./forms/ProviderForm";
import type { Provider } from "@/types";
import type { ProviderFormValues } from "@/lib/schemas/provider";

interface EditProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Provider | null;
  onSave: (values: ProviderFormValues) => Promise<void>;
}

export function EditProviderDialog({ open, onOpenChange, provider, onSave }: EditProviderDialogProps) {
  const { t } = useTranslation();
  if (!provider) return null;

  const handleSubmit = async (values: ProviderFormValues) => {
    await onSave(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("providerForm.editTitle")}</DialogTitle>
          <DialogDescription>
            {t("providerForm.editDesc")}
          </DialogDescription>
        </DialogHeader>
        <ProviderForm
          key={provider.id}
          defaultValues={{
            name: provider.name,
            apiKey: provider.apiKey,
            baseUrl: provider.baseUrl,
            model: provider.model,
            apiFormat: provider.apiFormat,
            websiteUrl: provider.websiteUrl || "",
            notes: provider.notes || "",
            icon: provider.icon || "",
            iconColor: provider.iconColor || "",
          }}
          onSubmit={handleSubmit}
          submitLabel={t("providerForm.saveChanges")}
          providerId={provider.id}
        />
      </DialogContent>
    </Dialog>
  );
}
