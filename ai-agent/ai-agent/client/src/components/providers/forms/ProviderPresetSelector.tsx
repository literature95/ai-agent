import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { providerPresets, type ProviderPreset } from "@/config/providerPresets";
import { cn } from "@/lib/utils";

interface ProviderPresetSelectorProps {
  onSelect: (preset: ProviderPreset) => void;
}

export function ProviderPresetSelector({ onSelect }: ProviderPresetSelectorProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpen(!open)}
      >
        {t("providerForm.loadPreset")}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </Button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border-default bg-popover shadow-lg max-h-60 overflow-y-auto">
          {providerPresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className="flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => {
                onSelect(preset);
                setOpen(false);
              }}
            >
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ backgroundColor: preset.iconColor || "#6B7280" }}
              >
                {preset.name.charAt(0)}
              </div>
              <span>{preset.name}</span>
              {preset.defaultModel && (
                <span className="ml-auto text-xs text-muted-foreground">{preset.defaultModel}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
