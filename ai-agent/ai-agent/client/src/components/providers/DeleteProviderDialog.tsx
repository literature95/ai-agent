import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Provider } from "@/types";

interface DeleteProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider: Provider | null;
  onDelete: (provider: Provider) => void;
}

export function DeleteProviderDialog({ open, onOpenChange, provider, onDelete }: DeleteProviderDialogProps) {
  const { t } = useTranslation();
  if (!provider) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("providers.deleteTitle")}</DialogTitle>
          <DialogDescription>
            {t("providers.deleteConfirm")} "{provider.name}"? {t("providers.deleteWarning")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
          <Button variant="destructive" onClick={() => { onDelete(provider); onOpenChange(false); }}>
            {t("common.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
