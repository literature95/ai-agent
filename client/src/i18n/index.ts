import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import zh from "./locales/zh.json";

const getInitialLanguage = (): "en" | "zh" => {
  try {
    const stored = localStorage.getItem("ai-agent-language");
    if (stored === "en" || stored === "zh") return stored;
  } catch {}
  const navLang = navigator.language || "";
  if (navLang.startsWith("zh")) return "zh";
  return "en";
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
