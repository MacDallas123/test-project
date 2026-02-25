import fr from "@/i18n/lang/fr.json";
import en from "@/i18n/lang/en.json";
import es from "@/i18n/lang/es.json";
import ch from "@/i18n/lang/ch.json";
import de from "@/i18n/lang/de.json";

export const translations = {
  fr,
  en,
  es,
  ch,
  de,
};

export const availableLanguages = [
  { code: "fr", name: "Français", flag: "🇫🇷", reactFlag: "FR", value: "FRENCH", },
  { code: "en", name: "English", flag: "🇬🇧", reactFlag: "GB", value: "ENGLISH", },
  { code: "es", name: "Español", flag: "🇪🇸", reactFlag: "ES", value: "SPANISH", },
  { code: "ch", name: "Chinese", flag: "🇨🇳", reactFlag: "CN", value: "CHINESE", },
  { code: "de", name: "Deutsch", flag: "🇩🇪", reactFlag: "DE", value: "DEUSTCH", },
  // { code: "ch", name: "中文", flag: "🇨🇳" },
];
