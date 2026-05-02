import { useTranslation } from "react-i18next";
import type { Provider } from "@/types";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  activeProvider: Provider | null;
}

export function Header({ title, activeProvider }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border-default bg-background/80 backdrop-blur-sm shrink-0">
      <h1 className="text-lg font-semibold">{title}</h1>
      {activeProvider && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t("header.active")}</span>
          <Badge variant="secondary" className="gap-1.5">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: activeProvider.iconColor || "#3b82f6" }}
            />
            {activeProvider.name}
          </Badge>
          {activeProvider.model && (
            <Badge variant="outline" className="text-[10px] font-mono">
              {activeProvider.model}
            </Badge>
          )}
        </div>
      )}
    </header>
  );
}
