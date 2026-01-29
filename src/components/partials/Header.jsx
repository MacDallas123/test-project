import {
  BaggageClaim,
  Bell,
  ChevronDown,
  Globe,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MoreVertical,
  Package,
  Search,
  Send,
  ServerIcon,
  ShoppingCart,
  Trash2,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/assets/logo_fibem3.jpg";
import { Input } from "../ui/input";
import { availableLanguages } from "@/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "../custom/languageSelector";
import CollapsibleMenuItem from "../custom/CollapsibleMenuItem";
import CurrencySelector from "../custom/CurrencySelector";

const Header = ({ authPage = false, dasboardPage = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, changeLanguage, t } = useLanguage();
  const [userInitials, setUserInitials] = useState("U");
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [cartSize, setCartSize] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // Pre remplissement
  const user = {
    first_name: "First Name",
    last_name: "Last Name",
    role: "admin",
    email: "admin@gmail.com",
  };
  const isLoggedIn = () => true;

  // Contenu du menu utilisateur
  const userMenuItems = [
    {
      icon: ShoppingCart,
      label: t("userMenu.shoppingCart", "Panier"),
      href: "/cart",
      badge: 0,
    },
    {
      icon: Package,
      label: t("userMenu.orders", "Historique des commandes"),
      href: "/order-history",
    },
    {
      icon: LayoutDashboard,
      label: t("userMenu.dashboard", "Tableau de bord"),
      href: "/dashboard",
    },
    { icon: User, label: t("userMenu.profile", "Profil"), href: "/profile" },

    // Temporary
    {
      icon: LogIn,
      label: t("authMenu.login", "Connexion"),
      href: "/auth/login",
    },
    {
      icon: UserPlus,
      label: t("authMenu.register", "Inscription"),
      href: "/auth/register",
    },
  ];

  const mainMenus = [
    {
      icon: Home,
      label: t("mainMenu.home.label", "Accueil"),
      //href: "/",
      subMenus: [
        {
          label: t("mainMenu.home.about", "A propos"),
          href: "/#about",
        },
        {
          label: t("mainMenu.home.us", "Qui sommes nous ?"),
          href: "/#us",
        },
        {
          label: t("mainMenu.home.blog", "Blog"),
          href: "/#blog",
        }
      ]
    },
    {
      icon: ServerIcon,
      label: t("mainMenu.service.label", "Service"),
      subMenus: [
        {
          label: t("mainMenu.service.prestation", "Rechercher un repas"),
          href: "/services",
        },
        /*{
          label: t("mainMenu.service.tarifs", "Tarifs"),
          href: "/service/tarifs",
        },
        {
          label: t("mainMenu.service.plaquette", "Plaquette"),
          href: "/service/plaquette",
        },*/
        {
          label: t("mainMenu.service.formulaireCV", "Formulaire CV"),
          href: "/cv",
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
        /*{
          label: t("mainMenu.service.avoir", "Avoir"),
          href: "/service/avoir",
        },*/
      ],
      /*subMenus: [
        {
          label: t("mainMenu.service.prestation", "Prestation Service"),
          href: "/services",
        },
        {
          label: t("mainMenu.service.tarifs", "Tarifs"),
          href: "/service/tarifs",
        },
        {
          label: t("mainMenu.service.plaquette", "Plaquette"),
          href: "/service/plaquette",
        },
        {
          label: t("mainMenu.service.formulaireCV", "Formulaire CV"),
          href: "/cv",
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
        {
          label: t("mainMenu.service.avoir", "Avoir"),
          href: "/service/avoir",
        },
      ],*/
    },
    {
      icon: LayoutDashboard,
      label: t("mainMenu.emploi.label", "Emploi"),
      subMenus: [
        {
          label: t("mainMenu.emploi.espaceCandidat", "Espace candidat"),
          //href: "/emploi/candidat",
          href: "/emploi",
        },
        {
          label: t("mainMenu.emploi.espaceRecruteur", "Espace recruteur"),
          //href: "/emploi/recruteur",
          href: "/dashboard/offres",
        },
        {
          label: t("mainMenu.emploi.espaceStagiaire", "Espace stagiaire"),
          href: "/emploi/stagiaire",
        },
        {
          label: t("mainMenu.emploi.espaceAbonnement", "Espace abonnement"),
          href: "/emploi/abonnement",
        },
      ],
    },
    { icon: User, label: "Contact", href: "/contact" },
  ];

  const authMenus = [
    {
      icon: LogIn,
      label: t("authMenu.login", "Connexion"),
      href: "/auth/login",
      className:
        "px-4 py-2 rounded-md text-primary border border-primary transition-colors duration-200 hover:bg-primary hover:text-white",
    },
    {
      icon: UserPlus,
      label: t("authMenu.register", "Inscription"),
      href: "/auth/register",
      className:
        "px-4 py-2 rounded-md bg-primary/70 text-white border border-primary transition-colors duration-200 hover:bg-secondary/90 hover:border-secondary",
    },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu mobile quand on redimensionne vers le desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close submenu when mouse leaves (with delay)
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredMenu(null);
    }, 150);
    setHoverTimeout(timeout);
  };

  // Cancel timeout when mouse re-enters
  const handleMouseEnter = (index) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredMenu(index);
  };

  const handleLogout = async () => {
    // Logique de déconnexion
    console.log("LOGOUT DONE.");
  };

  const toggleMobileMenu = () => {
    if (isMobileSearchOpen) setIsMobileSearchOpen(false);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileSearch = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={
        [
          "top-0 left-0 right-0 z-1500 transition-all duration-300",
          dasboardPage
            ? "sticky"
            : authPage
            ? "sticky"
            : "fixed",
          dasboardPage
            ? scrolled
              ? "bg-white/95 backdrop-blur-md shadow-lg text-black border-b"
              : "bg-white/95 text-black border-b"
            : (
                scrolled
                  ? "bg-white/95 backdrop-blur-md shadow-lg text-black"
                  : "bg-transparent text-black"
              ),
        ].join(" ")
      }
    >
      <div className="container px-4 py-3 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={closeMobileMenu}
          >
            <div className="flex items-center justify-center w-10 h-10 transition-all duration-300 md:w-16 md:h-16 rounded-xl group-hover:scale-110">
              <img src={Logo} alt="LOGO FIBEM" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold md:text-xl bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-primary">
                <span className="text-3xl text-secondary">L</span>ivreur<span className="text-3xl text-secondary">N</span>ourriture
              </span>
              {/* <span className="hidden text-xs font-medium text-muted-foreground sm:block">
                ProMarket
              </span> */}
            </div>
          </Link>

          {/* Recherche */}
          <div className="relative flex-1 hidden w-full max-w-md px-4 lg:block">
            <Input
              type="text"
              placeholder={t("search_placeholder", "Rechercher")}
              className="w-full px-4 py-2 pl-10 text-white transition border rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-primary placeholder:text-gray-300"
            />
            <Search className="absolute w-4 h-4 text-gray-100 -translate-y-1/2 left-8 top-1/2" />
          </div>

          {/* Mobile search icon */}
          <div>
            <Button
              className="flex items-center justify-center p-2 text-black transition bg-transparent rounded-full lg:hidden"
              aria-label={t("search") || "Recherche"}
              onClick={toggleMobileSearch}
            >
              {isMobileSearchOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
            <AnimatePresence>
              {isMobileSearchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-20 max-w-md mt-2 -translate-x-1/2 min-w-xs left-1/2"
                >
                  <Input
                    type="text"
                    placeholder={t("search_placeholder", "Rechercher...")}
                    className="w-full px-4 py-2 pl-10 transition bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                  <Search className="absolute w-4 h-4 text-gray-800 -translate-y-1/2 left-4 top-1/2" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          

          {/* Sélecteur de langue */}
          {/* <LanguageSelector />

          <div className="w-px h-6 mx-2 bg-border"></div> */}
          
          {/* Desktop Navigation */}
          {isLoggedIn() ? (
            <div className="items-center hidden gap-4 lg:flex">
              {/* Sélecteur de langue */}
              <LanguageSelector />
              
              <div className="w-px h-6 bg-border"></div>
              
              {/* Render mainMenus as navigation links/icons */}
              {mainMenus.map((item, idx) => {
                const Icon = item.icon;
                
                if (!item.subMenus) {
                  return (
                    <Button
                      key={item.href || idx}
                      asChild
                      variant="ghost"
                      className="relative"
                      title={item.label}
                    >
                      <Link
                        className="relative flex items-center gap-2 transition-colors cursor-pointer"
                        to={item.href}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          {item.badge ? null : item.label}
                        </div>

                        {item.badge ? (
                          <Badge className="absolute top-0 right-0 w-5 h-5 text-white translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                            {item.badge}
                          </Badge>
                        ) : null}
                      </Link>
                    </Button>
                  );
                }

                // Menu with submenu - Hoverable
                return (
                  <div
                    key={item.href || idx}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(idx)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Button
                      variant="ghost"
                      className="relative group"
                      title={item.label}
                    >
                      <div className="flex items-center gap-2 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          {Icon && <Icon className="w-4 h-4" />}
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                      </div>
                    </Button>

                    {/* Dropdown on hover */}
                    <AnimatePresence>
                      {hoveredMenu === idx && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 z-50 w-56 mt-2 overflow-hidden bg-white border rounded-lg shadow-xl top-full min-w-56"
                          onMouseEnter={() => handleMouseEnter(idx)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="p-2">
                            {/* <div className="px-3 py-2 mb-1 text-sm font-semibold border-b">
                              {item.label}
                            </div> */}
                            <div className="flex flex-col">
                              {item.subMenus.map((sub, i) => (
                                <Link
                                  key={sub.href || i}
                                  to={sub.href}
                                  className="px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent"
                                  onClick={() => setHoveredMenu(null)}
                                >
                                  {sub.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <div className="w-px h-6 bg-border"></div>
              
              {/* Sélecteur de devise */}
              <CurrencySelector />

              <Button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center w-10 h-10 mr-4 font-medium transition-colors rounded-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {userInitials}
              </Button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 p-2 border rounded-md shadow-lg right-4 top-16 w-60 bg-background"
                  >
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.role}
                      </p>
                    </div>

                    <div className="py-1">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent hover:text-accent-foreground"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                          {item.badge != null ? (
                            <Badge>{item.badge}</Badge>
                          ) : null}
                        </Link>
                      ))}
                    </div>

                    <div className="pt-1 border-t">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full gap-2 px-3 py-2 text-sm transition-colors rounded-md cursor-pointer text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="items-center hidden gap-4 lg:flex">
              {/* Sélecteur de langue */}
              <LanguageSelector />

              {/* Sélecteur de devise */}
              <CurrencySelector />

              <div className="w-px h-6 bg-border"></div>

              {authMenus.map((item) => (
                <Link to={item.href} key={item.href}>
                  <Button variant="ghost" className={item.className}>
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Sélecteur de langue mobile */}
            <LanguageSelector />

            {/* Sélecteur de devise */}
            <CurrencySelector />

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-0 cursor-pointer h-9 w-9"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <div className="relative">
                  <Menu className="w-5 h-5" />

                  {unreadNotifications > 0 && (
                    <Badge className="absolute top-0 right-0 w-5 h-5 text-xs text-center text-white bg-red-500 rounded-full translate-x-2/3 -translate-y-2/3">
                      {unreadNotifications}
                    </Badge>
                  )}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isLoggedIn()
          ? isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="my-2 overflow-auto bg-white shadow-lg lg:hidden max-h-[500px]"
              >
                <div className="flex items-center gap-3 p-3 border border-border/50">
                  <div className="flex items-center justify-center w-10 h-10 text-sm font-medium text-white rounded-full bg-accent">
                    {userInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs truncate text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="container flex flex-col gap-3 px-3 py-2">
                  {mainMenus.map((item, index) => {
                    const IconComponent = item.icon;
                    if (item.subMenus) {
                      return (
                        <CollapsibleMenuItem
                          key={index}
                          label={item.label}
                          icon=<IconComponent className="w-4 h-4" />
                          children={item.subMenus}
                        />
                      );
                    }

                    return (
                      <Link
                        key={index}
                        to={item.href}
                        onClick={closeMobileMenu}
                        className="w-full"
                      >
                        <Button
                          variant="ghost"
                          className="justify-start w-full text-sm transition-colors cursor-pointer text-foreground/80 hover:text-foreground hover:bg-accent/50"
                        >
                          <IconComponent className="w-4 h-4 mr-3" />
                          {item.label}
                          {item.badge != null ? (
                            <Badge>{item.badge}</Badge>
                          ) : null}
                        </Button>
                      </Link>
                    );
                  })}

                  {userMenuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={index}
                        to={item.href}
                        onClick={closeMobileMenu}
                        className="w-full"
                      >
                        <Button
                          variant="ghost"
                          className="justify-start w-full text-sm transition-colors cursor-pointer text-foreground/80 hover:text-foreground hover:bg-accent/50"
                        >
                          <IconComponent className="w-4 h-4 mr-3" />
                          {item.label}
                          {item.badge != null ? (
                            <Badge>{item.badge}</Badge>
                          ) : null}
                        </Button>
                      </Link>
                    );
                  })}

                  <div className="flex flex-col gap-2 pt-2">
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="flex items-center gap-2 py-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          : isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mr-2 overflow-hidden bg-white shadow-lg lg:hidden"
              >
                <div className="container flex flex-col gap-4 py-4">
                  {authMenus.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative overflow-hidden rounded-md group"
                    >
                      <span
                        className={`
                          absolute left-0 top-0 h-full w-0 ${
                            item.label === "Connexion"
                              ? "bg-accent/30"
                              : "bg-accent/20"
                          }
                          group-active:w-full group-hover:w-full
                          transition-all duration-300 ease-in-out
                          z-0
                        `}
                      />
                      <span
                        className={`relative z-10 flex items-center gap-2 px-4 py-2 font-medium transition-colors duration-200 group-hover:bg-accent/10 group-active:bg-accent/40`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
      </AnimatePresence>

      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false);
          }}
        />
      )}
    </motion.header>
  );
};

export default Header;