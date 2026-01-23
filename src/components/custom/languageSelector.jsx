import { Globe } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { availableLanguages } from "@/i18n/translations";
import { useLanguage } from "@/context/LanguageContext";

const LanguageSelector = () => {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <DropdownMenu className="z-1600">
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium uppercase">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-1600">
        <DropdownMenuLabel>{t("language_choice", "Choix du language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableLanguages.map((lang, index) => {
          return (
            <DropdownMenuItem
                key={index}
              className="cursor-pointer"
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.flag} {lang.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
