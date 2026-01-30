import { useState } from "react";
import { translations } from "@/i18n/translations";
import { LanguageContext } from "@/context/LanguageContext";

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("fr");
  const [flag, setFlag] = useState("FR");

  const changeLanguage = (lang, reactFlag = null) => {
    if (translations[lang]) {
      setLanguage(lang);
      if (reactFlag) setFlag(reactFlag);
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
        flag,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
