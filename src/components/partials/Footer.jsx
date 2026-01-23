import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Send,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/assets/logo_fibem3.jpg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Logique d'abonnement à la newsletter
      console.log("Abonnement à la newsletter:", email);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  // Menus correspondant au Header
  const mainMenus = [
    { label: t("mainMenu.home", "Accueil"), href: "/" },
    { label: t("mainMenu.service", "Service"), href: "/service" },
    { label: t("mainMenu.emploi", "Emploi"), href: "/emploi" },
    { label: "Contact", href: "/contact" },
  ];

  const serviceSubMenus = [
    {
      label: t("mainMenu.service.prestation", "Prestation Service"),
      href: "/service/prestation",
    },
    { label: t("mainMenu.service.tarifs", "Tarifs"), href: "/service/tarifs" },
    {
      label: t("mainMenu.service.plaquette", "Plaquette"),
      href: "/service/plaquette",
    },
    {
      label: t("mainMenu.service.formulaireCV", "Formulaire CV"),
      href: "/service/formulaire-cv",
    },
    {
      label: t("mainMenu.service.feuilleHeures", "Feuille d'heures"),
      href: "/service/feuille-heures",
    },
    {
      label: t("mainMenu.service.ficheCandidat", "Fiche candidat"),
      href: "/service/fiche-candidat",
    },
    {
      label: t("mainMenu.service.ficheEts", "Fiche Ets"),
      href: "/service/fiche-ets",
    },
    {
      label: t("mainMenu.service.modeleDevis", "Modèle Devis"),
      href: "/service/modele-devis",
    },
    {
      label: t("mainMenu.service.facture", "Facture"),
      href: "/service/facture",
    },
    { label: t("mainMenu.service.avoir", "Avoir"), href: "/service/avoir" },
  ];

  const emploiSubMenus = [
    {
      label: t("mainMenu.emploi.espaceCandidat", "Espace candidat"),
      href: "/emploi/candidat",
    },
    {
      label: t("mainMenu.emploi.espaceRecruteur", "Espace recruteur"),
      href: "/emploi/recruteur",
    },
    {
      label: t("mainMenu.emploi.espaceStagiaire", "Espace stagiaire"),
      href: "/emploi/stagiaire",
    },
    {
      label: t("mainMenu.emploi.espaceAbonnement", "Espace abonnement"),
      href: "/emploi/abonnement",
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/fibem", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/fibem", label: "Twitter" },
    {
      icon: Instagram,
      href: "https://instagram.com/fibem",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/fibem",
      label: "LinkedIn",
    },
    { icon: Youtube, href: "https://youtube.com/fibem", label: "YouTube" },
  ];

  return (
    <footer className="mt-20 border-t bg-linear-to-b from-background to-muted/20 border-border/60">
      <div className="container px-4 py-12 mx-auto">
        {/* Section principale */}
        <div className="grid gap-8 mb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo et description */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 rounded-lg bg-linear-to-r from-primary/10 to-secondary/10 group-hover:scale-105">
                <img src={Logo} alt="LOGO FIBEM" className="rounded-lg" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-transparent bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                  FIBEM
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  ProMarket
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Votre partenaire digital complet pour tous vos besoins
              professionnels : services, emploi, gestion et développement.
            </p>

            {/* Newsletter */}
            <div className="pt-4 mt-4 border-t border-border/40">
              <h4 className="mb-3 text-sm font-semibold text-foreground">
                {t("footer.newsletter", "Newsletter")}
              </h4>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder={t("footer.emailPlaceholder", "Votre email")}
                    className="flex-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" size="icon" className="shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {subscribed && (
                  <p className="text-xs text-green-600">
                    {t("footer.subscribed", "Merci pour votre inscription !")}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t(
                    "footer.newsletterDesc",
                    "Recevez nos actualités et offres spéciales",
                  )}
                </p>
              </form>
            </div>

            {/* Contacts */}
            <div className="pt-4 mt-4 border-t border-border/40">
              <h4 className="mb-3 text-sm font-semibold text-foreground">
                {t("footer.contacts", "Contacts")}
              </h4>
              <div className="flex flex-row flex-wrap space-y-6 md:flex-nowrap">
                {/* France Contact */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground md:text-base">
                      FIBEM France
                    </span>
                  </div>
                  <ul className="ml-6 space-y-2">
                    <li className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Paris, France
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a
                        href="tel:+33"
                        className="text-sm transition-colors text-muted-foreground hover:text-primary"
                      >
                        +33 x xx xx xx xx
                      </a>
                    </li>
                    <li className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a
                        href="mailto:france@fibem.fr"
                        className="text-sm transition-colors text-muted-foreground hover:text-primary"
                      >
                        senfibem.paris@outlook.com
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Senegal Contact */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground md:text-base">
                      FIBEM Sénégal
                    </span>
                  </div>
                  <ul className="ml-6 space-y-2">
                    <li className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Dakar, Sénégal
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a
                        href="tel:+221"
                        className="text-sm transition-colors text-muted-foreground hover:text-primary"
                      >
                        +221 xx xx xx xx x
                      </a>
                    </li>
                    <li className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a
                        href="mailto:senegal@fibem.fr"
                        className="text-sm transition-colors text-muted-foreground hover:text-primary"
                      >
                        senfibem.dakar@outlook.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Menus Principaux */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              {t("footer.mainMenu", "Menu Principal")}
            </h3>
            <ul className="space-y-3">
              {mainMenus.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm transition-colors text-muted-foreground hover:text-primary hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              {t("mainMenu.service", "Services")}
            </h3>
            <ul className="space-y-2">
              {serviceSubMenus.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm transition-colors text-muted-foreground hover:text-primary hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emploi */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              {t("mainMenu.emploi", "Emploi")}
            </h3>
            <ul className="space-y-2">
              {emploiSubMenus.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm transition-colors text-muted-foreground hover:text-primary hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Comptes & Réseaux sociaux */}
        <div className="flex flex-col justify-between gap-6 mb-8 md:flex-row md:items-center">
          {/* Réseaux sociaux */}
          <div>
            <h4 className="mb-3 font-semibold text-foreground">
              {t("footer.social", "Suivez-nous")}
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 transition-all rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-white hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="pt-8 border-t border-border/40">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-center text-muted-foreground">
              &copy; {new Date().getFullYear()} FIBEM ProMarket.{" "}
              {t("footer.rights", "Tous droits réservés.")}
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Link
                to="/privacy"
                className="hover:text-primary hover:underline"
              >
                {t("footer.privacy", "Politique de confidentialité")}
              </Link>
              <Link to="/terms" className="hover:text-primary hover:underline">
                {t("footer.terms", "Conditions d'utilisation")}
              </Link>
              <Link
                to="/cookies"
                className="hover:text-primary hover:underline"
              >
                {t("footer.cookies", "Cookies")}
              </Link>
              <Link
                to="/sitemap"
                className="hover:text-primary hover:underline"
              >
                {t("footer.sitemap", "Plan du site")}
              </Link>
              <Link
                to="/contact"
                className="hover:text-primary hover:underline"
              >
                {t("footer.contact", "Contact")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
