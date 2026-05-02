import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProviderList } from "@/components/providers/ProviderList";
import { AddProviderDialog } from "@/components/providers/AddProviderDialog";
import { EditProviderDialog } from "@/components/providers/EditProviderDialog";
import { DeleteProviderDialog } from "@/components/providers/DeleteProviderDialog";
import { useProvidersQuery } from "@/lib/query/queries";
import { useCreateProvider, useUpdateProvider, useDeleteProvider, useSetActiveProvider } from "@/lib/query/mutations";
import type { Provider } from "@/types";
import type { ProviderFormValues } from "@/lib/schemas/provider";

export function ProvidersPage() {
  const { t } = useTranslation();
  const { data: providers = [], isLoading } = useProvidersQuery();
  const createMutation = useCreateProvider();
  const updateMutation = useUpdateProvider();
  const deleteMutation = useDeleteProvider();
  const setActiveMutation = useSetActiveProvider();

  const [addOpen, setAddOpen] = useState(false);
  const [editProvider, setEditProvider] = useState<Provider | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteProvider, setDeleteProvider] = useState<Provider | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const activeProviderId = providers.find((p) => p.isActive)?.id || null;

  const handleAdd = useCallback(
    async (values: ProviderFormValues) => {
      await createMutation.mutateAsync({
        name: values.name,
        apiKey: values.apiKey,
        baseUrl: values.baseUrl,
        model: values.model || "",
        apiFormat: values.apiFormat,
        websiteUrl: values.websiteUrl,
        notes: values.notes,
        icon: values.icon,
        iconColor: values.iconColor,
        isActive: providers.length === 0,
      });
      toast.success(t("providers.added"));
    },
    [createMutation, providers.length, t],
  );

  const handleEdit = useCallback(
    async (values: ProviderFormValues) => {
      if (!editProvider) return;
      await updateMutation.mutateAsync({
        id: editProvider.id,
        data: {
          name: values.name,
          apiKey: values.apiKey,
          baseUrl: values.baseUrl,
          model: values.model || "",
          apiFormat: values.apiFormat,
          websiteUrl: values.websiteUrl,
          notes: values.notes,
          icon: values.icon,
          iconColor: values.iconColor,
        },
      });
      toast.success(t("providers.updated"));
    },
    [editProvider, updateMutation, t],
  );

  const handleDelete = useCallback(
    async (provider: Provider) => {
      await deleteMutation.mutateAsync(provider.id);
      toast.success(t("providers.deleted"));
    },
    [deleteMutation, t],
  );

  const handleSetActive = useCallback(
    async (provider: Provider) => {
      await setActiveMutation.mutateAsync(provider.id);
      toast.success(t("providers.switched") + " " + provider.name);
    },
    [setActiveMutation, t],
  );

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{t("providers.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("providers.description")}</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("providers.addProvider")}
        </Button>
      </div>

      <ProviderList
        providers={providers}
        activeProviderId={activeProviderId}
        onSetActive={handleSetActive}
        onEdit={(p) => { setEditProvider(p); setEditOpen(true); }}
        onDelete={(p) => { setDeleteProvider(p); setDeleteOpen(true); }}
        onAdd={() => setAddOpen(true)}
        isLoading={isLoading}
      />

      <AddProviderDialog open={addOpen} onOpenChange={setAddOpen} onSave={handleAdd} />
      <EditProviderDialog open={editOpen} onOpenChange={setEditOpen} provider={editProvider} onSave={handleEdit} />
      <DeleteProviderDialog open={deleteOpen} onOpenChange={setDeleteOpen} provider={deleteProvider} onDelete={handleDelete} />
    </div>
  );
}
