import { ChevronDown, Globe } from "lucide-react";
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
        <Button variant="ghost" className="flex flex-col px-2 md:flex-row text-primary-foreground">
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            <span className="hidden text-sm font-medium uppercase md:block">{language}</span>
          </div>
          <ChevronDown className="w-4 h-4"/>
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
