import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  models: string[];
  onFetchModels?: () => Promise<void>;
  placeholder?: string;
}

export function ModelSelector({ value, onChange, models, onFetchModels, placeholder }: ModelSelectorProps) {
  const { t } = useTranslation();
  const [fetching, setFetching] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFetch = async () => {
    if (!onFetchModels) return;
    setFetching(true);
    try {
      await onFetchModels();
    } catch (err) {
      toast.error(t("providerForm.modelsFetchFailed"));
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            className="flex h-9 w-full rounded-md border border-border-default bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => models.length > 0 && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
            placeholder={placeholder || t("providerForm.modelPlaceholder")}
          />
          {models.length > 0 && open && (
            <div className="absolute z-50 mt-1 w-full rounded-md border border-border-default bg-popover shadow-lg max-h-48 overflow-y-auto">
              {models
                .filter((m) => !value || m.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 50)
                .map((m) => (
                  <button
                    key={m}
                    type="button"
                    className="block w-full px-3 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground"
                    onMouseDown={() => { onChange(m); setOpen(false); }}
                  >
                    {m}
                  </button>
                ))}
            </div>
          )}
        </div>
        {onFetchModels && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleFetch}
            disabled={fetching}
            title={t("providers.fetchModels")}
          >
            <RefreshCw className={cn("h-4 w-4", fetching && "animate-spin")} />
          </Button>
        )}
      </div>
    </div>
  );
}
