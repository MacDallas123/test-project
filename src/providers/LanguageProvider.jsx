import { useState } from "react";
import { translations } from "@/i18n/translations";
import { LanguageContext } from "@/context/LanguageContext";

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("fr");

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  const t = (key, default_value = "") => {
    const value = default_value.trim() === "" ? key : default_value;
    return translations[language] && translations[language][key]
      ? translations[language][key]
      : value;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
