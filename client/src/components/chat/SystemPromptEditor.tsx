import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Textarea } from "@/components/ui/textarea";

interface SystemPromptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function SystemPromptEditor({ value, onChange }: SystemPromptEditorProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="px-4 border-b border-border-default">
      <button
        type="button"
        className="flex items-center gap-1 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {t("chat.systemPrompt")}
      </button>
      {open && (
        <div className="pb-3">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="You are a helpful AI assistant."
            className="min-h-[60px] text-xs resize-none"
          />
        </div>
      )}
    </div>
  );
}
