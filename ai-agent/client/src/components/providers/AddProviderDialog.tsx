import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProviderForm } from "./forms/ProviderForm";
import type { ProviderFormValues } from "@/lib/schemas/provider";

interface AddProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: ProviderFormValues) => Promise<void>;
}

export function AddProviderDialog({ open, onOpenChange, onSave }: AddProviderDialogProps) {
  const { t } = useTranslation();

  const handleSubmit = async (values: ProviderFormValues) => {
    await onSave(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("providerForm.addTitle")}</DialogTitle>
          <DialogDescription>
            {t("providerForm.addDesc")}
          </DialogDescription>
        </DialogHeader>
        <ProviderForm onSubmit={handleSubmit} submitLabel={t("providerForm.addProvider")} />
      </DialogContent>
    </Dialog>
  );
}
