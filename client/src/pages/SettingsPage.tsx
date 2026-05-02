import { useCallback } from "react";
import { Moon, Sun, Monitor, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const themeOptions = [
    { value: "light" as const, label: t("settings.light"), icon: Sun },
    { value: "dark" as const, label: t("settings.dark"), icon: Moon },
    { value: "system" as const, label: t("settings.system"), icon: Monitor },
  ];

  const langOptions = [
    { value: "en" as const, label: t("settings.english") },
    { value: "zh" as const, label: t("settings.chinese") },
  ];

  const changeLanguage = useCallback(
    (lang: "en" | "zh") => {
      i18n.changeLanguage(lang);
      try { localStorage.setItem("ai-agent-language", lang); } catch {}
    },
    [i18n],
  );

  const currentLang = (i18n.language?.startsWith("zh") ? "zh" : "en") as "en" | "zh";

  return (
    <div className="h-full overflow-y-auto p-6 max-w-2xl">
      <h2 className="text-xl font-semibold mb-6">{t("settings.title")}</h2>

      <div className="space-y-6">
        {/* Language */}
        <div>
          <h3 className="text-sm font-medium mb-3">{t("settings.language")}</h3>
          <div className="flex gap-2">
            {langOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => changeLanguage(opt.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors",
                  currentLang === opt.value
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "border-border-default hover:border-border-hover text-muted-foreground",
                )}
              >
                <Globe className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div>
          <h3 className="text-sm font-medium mb-3">{t("settings.theme")}</h3>
          <div className="flex gap-2">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={(e) => setTheme(opt.value, e as unknown as React.MouseEvent)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors",
                  theme === opt.value
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "border-border-default hover:border-border-hover text-muted-foreground",
                )}
              >
                <opt.icon className="h-4 w-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="border-t border-border-default pt-6">
          <h3 className="text-sm font-medium mb-2">{t("settings.about")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("settings.aboutText")}
          </p>
        </div>
      </div>
    </div>
  );
}
