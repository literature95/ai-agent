import { useState } from "react";
import { Pencil, Trash2, CheckCircle2, Wifi, Loader2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Provider } from "@/types";
import { toast } from "sonner";

interface ProviderCardProps {
  provider: Provider;
  isActive: boolean;
  onSetActive: (provider: Provider) => void;
  onEdit: (provider: Provider) => void;
  onDelete: (provider: Provider) => void;
}

export function ProviderCard({ provider, isActive, onSetActive, onEdit, onDelete }: ProviderCardProps) {
  const { t } = useTranslation();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; latencyMs?: number; error?: string } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`/api/providers/${provider.id}/test`, { method: "POST" });
      const data = await res.json();
      setTestResult(data);
      if (data.success) {
        toast.success(t("providers.connectedWithLatency", { latency: data.latencyMs }));
      } else {
        toast.error(data.error || t("providers.connectionFailed"));
      }
    } catch {
      toast.error(t("providers.testFailed"));
    } finally {
      setTesting(false);
    }
  };

  const formatLabel: Record<string, string> = {
    openai: t("providerForm.formats.openai"),
    anthropic: t("providerForm.formats.anthropic"),
    "openai-compatible": t("providerForm.formats.openaiCompatible"),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 transition-all duration-300 bg-card text-card-foreground group",
        isActive
          ? "border-blue-500/60 shadow-sm shadow-blue-500/10"
          : "border-border hover:border-border-hover",
      )}
    >
      {/* Gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50",
        )}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 h-10 w-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ backgroundColor: provider.iconColor || "#3b82f6" }}
          >
            {provider.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm truncate">{provider.name}</h3>
              {isActive && (
                <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-[10px] px-1.5 py-0">
                  {t("providers.active")}
                </Badge>
              )}
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {formatLabel[provider.apiFormat] || provider.apiFormat}
              </Badge>
            </div>

            {provider.baseUrl && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{provider.baseUrl}</p>
            )}
            {provider.model && (
              <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">{provider.model}</p>
            )}
            {provider.notes && (
              <p className="text-xs text-muted-foreground/70 mt-1 truncate">{provider.notes}</p>
            )}
          </div>
        </div>

        {/* Test result */}
        {testResult && (
          <div className={cn(
            "mt-2 text-xs px-2 py-1 rounded-md",
            testResult.success ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
          )}>
            {testResult.success
              ? t("providers.connectedWithLatency", { latency: testResult.latencyMs })
              : t("providers.failedWithError", { error: testResult.error })}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border-default/50">
          {!isActive && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onSetActive(provider)}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              {t("providers.setActive")}
            </Button>
          )}
          {isActive && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 px-2 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t("providers.activeProvider")}
            </span>
          )}

          <div className="flex-1" />

          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={handleTest}
            disabled={testing}
          >
            {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wifi className="h-3.5 w-3.5" />}
          </Button>

          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onEdit(provider)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-red-500 hover:text-red-600"
            onClick={() => onDelete(provider)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
