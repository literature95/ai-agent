import { Plus, Cpu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ProviderEmptyStateProps {
  onAdd: () => void;
}

export function ProviderEmptyState({ onAdd }: ProviderEmptyStateProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="h-20 w-20 rounded-2xl border-2 border-dashed border-border-default flex items-center justify-center mb-6">
        <Cpu className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{t("providers.noProviders")}</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        {t("providers.noProvidersDesc")}
      </p>
      <Button onClick={onAdd} size="lg">
        <Plus className="h-5 w-5 mr-2" />
        {t("providers.addProvider")}
      </Button>
    </motion.div>
  );
}
