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
import ReactCountryFlag from "react-country-flag";
import SiteTileForm1 from "../custom/SiteTitleForm1";

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
    { label: t("mainMenu.foods", "Rech. Repas"), href: "/services" },
    { label: t("mainMenu.job", "Rech. Emploi"), href: "/emploi" },
    { label: t("mainMenu.cv", "CV"), href: "/cv" },
    { label: t("mainMenu.contact", "Contact"), href: "/contact" },
    { label: t("mainMenu.facture", "Facture"), href: "/facture" },
    //{ label: t("mainMenu.service", "Service"), href: "/service" },
    //{ label: t("mainMenu.emploi", "Emploi"), href: "/emploi" },
  ];

  /* const serviceSubMenus = [
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
  ]; */

  const serviceSubMenus = [
    {
      label: t("mainMenu.service.prestation", "Rechercher un repas"),
      href: "/service/prestation",
    },
    // { label: t("mainMenu.service.tarifs", "Tarifs"), href: "/service/tarifs" },
    /*{
      label: t("mainMenu.service.plaquette", "Plaquette"),
      href: "/service/plaquette",
    },*/
    {
      label: t("mainMenu.service.formulaireCV", "Formulaire CV FIBEM"),
      href: "/service/formulaire-cv",
    },
    /*{
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
    },*/
    {
      label: t("mainMenu.service.facture", "Facture"),
      href: "/service/facture",
    },
    // { label: t("mainMenu.service.avoir", "Avoir"), href: "/service/avoir" },
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
    {
      icon: Facebook,
      href: "https://facebook.com/fibem",
      label: "Facebook",
      className: "bg-[#1877f3] text-white hover:bg-[#165fc7]"
    },
    {
      icon: Twitter,
      href: "https://twitter.com/fibem",
      label: "Twitter",
      className: "bg-[#1da1f2] text-white hover:bg-[#0f8cd6]"
    },
    {
      icon: Instagram,
      href: "https://instagram.com/fibem",
      label: "Instagram",
      className: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:opacity-90"
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/fibem",
      label: "LinkedIn",
      className: "bg-[#0077b5] text-white hover:bg-[#055e8a]"
    },
    {
      icon: Youtube,
      href: "https://youtube.com/fibem",
      label: "YouTube",
      className: "bg-[#ff0000] text-white hover:bg-[#cc0000]"
    },
    // L'icône ci-dessous ne ressemble pas assez à l'officielle de WhatsApp.
    // Pour obtenir une meilleure icône :
    // - Consulter [Simple Icons](https://simpleicons.org/?q=whatsapp) : SVG WhatsApp officiel
    // - Explorer [react-icons](https://react-icons.github.io/react-icons/) : Icônes prêtes à l'emploi (`import { FaWhatsapp } from 'react-icons/fa'`)
    // - Fork Awesome, Material Design Icons, Font Awesome : fournissent tous une icône WhatsApp de qualité
    // Exemple avec react-icons :
    //    import { FaWhatsapp } from 'react-icons/fa';
  ];

  return (
    <footer className="mt-20 text-white border-t bg-linear-to-b bg-primary">
      <div className="container px-4 py-12 mx-auto">
        {/* Section principale */}
        {/* <div className="grid gap-8 mb-12 md:grid-cols-2 lg:grid-cols-4"> */}
        <div className="grid gap-8 mb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo et description */}
          <div className="space-y-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 rounded-lg bg-linear-to-r from-primary/10 to-secondary/10 group-hover:scale-105">
                <img src={Logo} alt="LOGO FIBEM" className="rounded-lg" />
              </div>
              {/* <div className="flex flex-col">
                <span className="text-xl font-bold text-white bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
                  <span className="text-3xl text-secondary">L</span>ivrer<span className="text-3xl text-secondary">N</span>ourriture
                </span>
              </div> */}
              <SiteTileForm1 />
            </Link>
            <div>
              {/* <h3 className="mb-2 text-lg font-semibold text-secondary">
                {t("footer.navigation", "Navigation")}
              </h3> */}
              <ul className="grid grid-cols-3 gap-1 ml-4 space-y-1">
                {mainMenus.map((item) => (
                  <li key={item.href} className="flex flex-col items-center justify-center col-span-1 whitespace-nowrap">
                    <Link
                      to={item.href}
                      // className="text-sm text-white transition-colors hover:text-accent hover:underline"
                      className="w-full px-1 py-2 text-xs font-bold text-center transition-colors bg-white rounded-md border-primary text-primary hover:text-destructive"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contacts */}
          {/* <div className="pt-4 mt-4 border-t border-border/40"> */}
          <div className="pt-4 mt-4 space-y-4 border-t border-border/40 lg:col-span-2">
            <h4 className="mb-3 text-sm font-semibold text-accent">
              {t("footer.contacts", "Contacts")}
            </h4>
            <div className="flex flex-row flex-wrap space-y-6 md:flex-nowrap">
              {/* France Contact */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {/* <span role="img" aria-label="drapeau français" className="text-xl font-emoji">🇫🇷</span> */}
                  <ReactCountryFlag svg countryCode="FR" className="w-5 h-5" />
                  <span className="text-xs font-semibold text-secondary md:text-base">
                    FIBEM France
                  </span>
                </div>
                <ul className="ml-6 space-y-2">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-1 " />
                    <span className="text-sm ">
                      51 Rue du Grévarin – 27200 Vernon
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-4 h-4 " />
                    <a
                      href="tel:+33"
                      className="text-sm transition-colors hover:text-slate-700"
                    >
                      Tel: +33 6 05 51 14 32
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    SIRET 445 374 937 00032
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-4 h-4 " />
                    <a
                      href="mailto:france@fibem.fr"
                      className="text-sm transition-colors hover:text-slate-700"
                    >
                      gg.livrernourriture-fibem75@gmail.com
                    </a>
                  </li>
                  <li className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium transition-colors bg-white border rounded hover:bg-gray-100 text-primary border-border whitespace-nowrap"
                      onClick={() =>
                        window.open(
                          "https://maps.google.com/?q=51 Rue du Grévarin – 27200 Vernon",
                          "_blank"
                        )
                      }
                    >
                      <MapPin className="w-4 h-4 text-primary" />
                      Voir Google Map
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white transition-colors bg-green-500 rounded hover:bg-green-600"
                      onClick={() =>
                        window.open("https://wa.me/33605511432", "_blank")
                      }
                    >
                      {/* <svg
                        viewBox="0 0 32 32"
                        className="w-4 h-4 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.534.747 4.933 2.119 7.017l-1.417 5.178a1.5 1.5 0 0 0 1.825 1.825l5.178-1.416A11.937 11.937 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10c-1.769 0-3.495-.465-4.998-1.348a1.02 1.02 0 0 0-.646-.115l-5.767 1.577 1.576-5.768a1.02 1.02 0 0 0-.116-.645A9.96 9.96 0 0 1 6 15c0-5.523 4.477-10 10-10zm5.35 13.62c-.228-.114-1.345-.665-1.553-.741-.208-.076-.36-.114-.513.114-.152.228-.585.74-.717.892-.133.152-.263.171-.49.057-.228-.114-.962-.353-1.834-1.125-.678-.606-1.136-1.354-1.27-1.582-.133-.228-.014-.352.1-.466.103-.102.228-.266.343-.399.114-.133.152-.228.228-.38.075-.151.038-.285-.019-.398-.057-.114-.513-1.238-.704-1.693-.185-.445-.374-.383-.512-.39l-.433-.007c-.151 0-.398.057-.608.285-.21.228-.8.78-.8 1.9s.82 2.206.934 2.36c.114.152 1.614 2.47 3.917 3.366.548.209.974.334 1.308.428.55.139 1.052.119 1.448.072.441-.054 1.345-.549 1.535-1.08.19-.532.19-.987.133-1.08-.057-.096-.209-.152-.437-.266z" />
                      </svg> */}
                      <svg role="img" className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      Whatsapp
                    </button>
                  </li>
                </ul>
              </div>

              {/* Senegal Contact */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {/* <span role="img" aria-label="drapeau sénégalais" className="text-xl">🇸🇳</span> */}
                  <ReactCountryFlag svg countryCode="SN" className="w-5 h-5" />
                  <span className="text-xs font-semibold text-secondary md:text-base">
                    FIBEM Sénégal
                  </span>
                </div>
                <ul className="ml-6 space-y-2">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-1" />
                    <span className="text-sm">
                      Rue 7 Corniche x 6, Médina, Dakar
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-4 h-4 " />
                    <a
                      href="tel:+221"
                      className="text-sm transition-colors hover:text-slate-700"
                    >
                      Tel: +221 78 370 06 02
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    N.I.N.E.A.: 30 84 31 62 U2 — NAF: 7112B Engineering
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-4 h-4 " />
                    <a
                      href="mailto:senegal@fibem.fr"
                      className="text-sm transition-colors hover:text-slate-700"
                    >
                      gg.livrernourriture-fibem99@gmail.com
                    </a>
                  </li>
                  <li className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium transition-colors bg-white border rounded hover:bg-gray-100 text-primary border-border whitespace-nowrap"
                      onClick={() =>
                        window.open(
                          "https://maps.google.com/?q=51 Rue du Grévarin – 27200 Vernon",
                          "_blank",
                        )
                      }
                    >
                      <MapPin className="w-4 h-4 text-primary" />
                      Voir Google Map
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white transition-colors bg-green-500 rounded hover:bg-green-600"
                      onClick={() =>
                        window.open("https://wa.me/33605511432", "_blank")
                      }
                    >
                      <svg role="img" className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      Whatsapp
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          {/* <div className="pt-4 mt-4 border-t border-border/40"> */}
          <div className="pt-4 mt-4 space-y-4 border-t border-border/40 lg:col-span-1">
            <h4 className="mb-3 text-sm font-semibold text-secondary">
              {t("footer.newsletter", "Newsletter")}
            </h4>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t("footer.emailPlaceholder", "Votre email")}
                  className="flex-1 bg-white text-destructive"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  size="icon"
                  className="shrink-0 bg-destructive/80 hover:bg-destructive"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {subscribed && (
                <p className="text-xs text-green-600">
                  {t("footer.subscribed", "Merci pour votre inscription !")}
                </p>
              )}
              <p className="text-xs ">
                {t(
                  "footer.newsletterDesc",
                  "Recevez nos actualités et offres spéciales",
                )}
              </p>
            </form>
          </div>

          {/* Menus Principaux */}
          {/* <div>
            <h3 className="mb-4 text-lg font-semibold text-accent">
              {t("footer.mainMenu", "Menu Principal")}
            </h3>
            <ul className="space-y-3">
              {mainMenus.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Services */}
          {/* <div>
            <h3 className="mb-4 text-lg font-semibold text-accent">
              {t("mainMenu.service", "Services")}
            </h3>
            <ul className="space-y-2">
              {serviceSubMenus.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-white transition-colors hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Emploi */}
          {/* <div>
            <h3 className="mb-4 text-lg font-semibold text-accent">
              {t("mainMenu.emploi", "Emploi")}
            </h3>
            <ul className="space-y-2">
              {emploiSubMenus.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        {/* Comptes & Réseaux sociaux */}
        <div className="flex flex-col justify-between gap-6 mb-8 md:flex-row md:items-center">
          <div>
            <h4 className="mb-3 font-semibold text-white">
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
                    className={`flex items-center justify-center w-10 h-10 transition-all rounded-full ${social.className}`}
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
            <p className="text-sm font-light text-center text-white/70">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-2xl text-secondary">L</span>ivrer
              <span className="text-2xl text-secondary">N</span>ourriture.{" "}
              {t("footer.rights", "Tous droits réservés.")}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mr-2 text-sm font-light text-white/70">
              <Link
                to="/privacy"
                className="hover:text-slate-700 hover:underline"
              >
                {t("footer.privacy", "Politique de confidentialité")}
              </Link>
              <Link to="/terms" className="hover:text-slate-700 hover:underline">
                {t("footer.terms", "Conditions d'utilisation")}
              </Link>
              <Link
                to="/cookies"
                className="hover:text-slate-700 hover:underline"
              >
                {t("footer.cookies", "Cookies")}
              </Link>
              <Link
                to="/sitemap"
                className="hover:text-slate-700 hover:underline"
              >
                {t("footer.sitemap", "Plan du site")}
              </Link>
              <Link
                to="/contact"
                className="hover:text-slate-700 hover:underline"
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
