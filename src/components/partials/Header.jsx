import {
  Bell,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Search,
  ServerIcon,
  ShoppingCart,
  User,
  UserPlus,
  X,
  FileText,
  Receipt,
  CreditCard,
  Briefcase,
  UserCheck,
  Utensils,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
// ✅ Plus d'imports shadcn (Button, Badge, Input supprimés)
import Logo from "@/assets/logo_fibem3.jpg";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "@/components/custom/languageSelector";
import CollapsibleMenuItem from "@/components/custom/CollapsibleMenuItem";
import CurrencySelector from "@/components/custom/CurrencySelector";
import SiteTileForm1 from "@/components/custom/SiteTitleForm1";
import { useAuth } from "@/hooks/useAuth";

// ─────────────────────────────────────────
// Primitives natives (remplacent shadcn)
// ─────────────────────────────────────────

/**
 * Remplace <Button variant="ghost"> et <Button variant="destructive"> etc.
 * Accepte les mêmes props que shadcn Button pour une migration facile.
 */
const Btn = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`inline-flex items-center justify-center gap-1.5 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none ${className}`}
  >
    {children}
  </button>
);

/**
 * Remplace <Badge> — petite pastille colorée.
 */
const Chip = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] font-semibold rounded-full ${className}`}
  >
    {children}
  </span>
);

/**
 * Remplace <Input> — champ texte natif stylisé.
 */
const TextInput = ({ className = "", ...props }) => (
  <input
    className={`block w-full rounded-full border border-gray-300 bg-white text-primary placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition ${className}`}
    {...props}
  />
);

// ─────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────

/** Indicateur de route active (barre rouge sous le label) */
const ActiveBar = () => (
  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
);

/** Un item du mega-menu (icône + label) */
const MegaMenuItem = ({ sub, isActive, onClose }) => (
  <Link
    to={sub.href}
    onClick={onClose}
    className={`group flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-200
      ${
        isActive
          ? "bg-red-50 ring-2 ring-red-500"
          : "hover:bg-slate-50/50 hover:shadow-sm"
      }`}
  >
    <div
      className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-200
        ${isActive ? "bg-red-100" : "bg-slate-100 group-hover:bg-secondary/90"}`}
    >
      {sub.image ? (
        <img src={sub.image} alt={sub.label} className="object-contain w-10 h-10" />
      ) : (
        <sub.icon
          className={`w-7 h-7 ${
            isActive ? "text-red-600" : "text-slate-500 group-hover:text-slate-200"
          }`}
        />
      )}
    </div>
    <span
      className={`text-xs font-medium text-center leading-tight transition-colors
        ${isActive ? "text-red-600" : "text-white group-hover:text-slate-900"}`}
    >
      {sub.label}
    </span>
    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
  </Link>
);

/** Mega-menu pleine largeur (desktop) */
const MegaMenuPanel = ({ item, activeIdx, onClose, onMouseEnter, onMouseLeave }) => (
  <AnimatePresence>
    {activeIdx !== null && (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="fixed left-0 right-0 z-[1400] border-t border-primary bg-primary shadow-2xl"
        style={{ top: "var(--header-height, 64px)" }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="container px-6 py-6 mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white mb-5">
            {item.label}
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
            {item.subMenus.map((sub, i) => (
              <MegaMenuItem
                key={sub.href || i}
                sub={sub}
                isActive={false}
                onClose={onClose}
              />
            ))}
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

/** Bouton du menu principal (desktop) */
const DesktopNavItem = ({ item, idx, isActive, hoveredMenu, onEnter, onLeave }) => {
  const Icon = item.icon;

  if (!item.subMenus) {
    return (
      <Link
        to={item.href}
        className={`relative flex items-center gap-1.5 px-2 py-1 text-sm font-medium transition-colors rounded-md
          ${isActive ? "text-red-600" : "text-primary-foreground hover:text-black"}`}
      >
        <Icon className="w-4 h-4" />
        {item.label}
        {isActive && <ActiveBar />}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => onEnter(idx)}
      onMouseLeave={onLeave}
    >
      <button
        className={`relative flex items-center gap-1.5 px-2 py-1 text-sm font-medium transition-colors rounded-md
          ${isActive ? "text-red-600" : "text-primary-foreground hover:text-black"}`}
      >
        <Icon className="w-4 h-4" />
        {item.label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200
            ${hoveredMenu === idx ? "rotate-180" : ""}`}
        />
        {isActive && <ActiveBar />}
      </button>
    </div>
  );
};

/** Menu mobile — liste d'items (sans shadcn Button/Badge) */
const MobileMenuList = ({ items, closeMobileMenu }) =>
  items.map((item, index) => {
    const Icon = item.icon;
    if (item.subMenus) {
      return (
        <CollapsibleMenuItem
          key={index}
          label={item.label}
          icon={<Icon className="w-4 h-4" />}
          children={item.subMenus}
          closeMobileMenu={closeMobileMenu}
        />
      );
    }
    return (
      <Link key={index} to={item.href} className="w-full" onClick={closeMobileMenu}>
        <button className="flex items-center justify-start w-full px-3 py-2 text-sm font-medium text-orange-300 transition-colors rounded-md hover:text-white hover:bg-white/10">
          <Icon className="w-4 h-4 mr-3 text-red-400 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge != null && (
            <Chip className="ml-auto bg-secondary text-secondary-foreground">
              {item.badge}
            </Chip>
          )}
        </button>
      </Link>
    );
  });

// ─────────────────────────────────────────
// Main Header
// ─────────────────────────────────────────

const Header = ({ authPage = false, dasboardPage = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const headerRef = useRef(null);

  const location = useLocation();
  const { t } = useLanguage();
  const { isLoggedIn, user, logout } = useAuth();

  const userInitials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "U";

  // ── Menu data ────────────────────────────────────────────────────────────

  const mainMenus = [
    {
      icon: Home,
      label: t("mainMenu.home.label", "Accueil"),
      href: "/",
      subMenus: [
        { label: t("mainMenu.home.about", "À propos"), href: "/#about", icon: Star },
        { label: t("mainMenu.home.us", "Qui sommes-nous ?"), href: "/#us", icon: User },
        { label: t("mainMenu.home.blog", "Blog"), href: "/#blog", icon: FileText },
      ],
    },
    {
      icon: ServerIcon,
      label: t("mainMenu.service.label", "Services"),
      subMenus: [
        { label: t("mainMenu.service.prestation", "Rechercher un repas"), href: "/services", icon: Utensils },
        { label: t("mainMenu.service.formulaireCV", "Formulaire CV FIBEM"), href: "/cv", icon: FileText },
        { label: t("mainMenu.service.formulaireDevis", "Devis"), href: "/devis", icon: Receipt },
        { label: t("mainMenu.service.formulaireFacture", "Facture"), href: "/facture", icon: FileText },
        { label: t("mainMenu.service.formulaireAvoirs", "Avoirs"), href: "/avoirs", icon: CreditCard },
        { label: t("mainMenu.emploi.espaceAbonnement", "Espace abonnement"), href: "/abonnements", icon: Star },
      ],
    },
    {
      icon: LayoutDashboard,
      label: t("mainMenu.emploi.label", "Emploi"),
      subMenus: [
        { label: t("mainMenu.emploi.espaceCandidat", "Espace candidat"), href: "/emploi", icon: UserCheck },
        { label: t("mainMenu.emploi.espaceRecruteur", "Espace recruteur"), href: "/dashboard/offres", icon: Briefcase },
      ],
    },
    {
      icon: User,
      label: "Contact",
      href: "/contact",
    },
  ];

  const authMenus = [
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

  const userMenuItems = [
    { icon: ShoppingCart, label: t("userMenu.shoppingCart", "Panier"), href: "/cart", badge: 4 },
    { icon: LayoutDashboard, label: t("userMenu.dashboard", "Tableau de bord"), href: "/dashboard" },
    { icon: User, label: t("userMenu.profile", "Profil"), href: "/profile" },
  ];

  // ── Active route helpers ─────────────────────────────────────────────────

  const isMenuActive = (menuItem) => {
    if (menuItem.href) {
      return (
        location.pathname === menuItem.href ||
        location.pathname.startsWith(menuItem.href + "/")
      );
    }
    return (
      menuItem.subMenus?.some((sub) => {
        if (sub.href === "/" && location.pathname === "/") return true;
        if (sub.href?.includes("#")) {
          const [p, h] = sub.href.split("#");
          const base = p === "" ? "/" : p;
          return location.pathname === base && location.hash.replace("#", "") === h;
        }
        return (
          location.pathname === sub.href ||
          location.pathname.startsWith((sub.href || "") + "/")
        );
      }) ?? false
    );
  };

  // ── Hover management ─────────────────────────────────────────────────────

  const handleMouseEnter = (idx) => {
    clearTimeout(hoverTimeoutRef.current);
    setHoveredMenu(idx);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredMenu(null), 150);
  };

  // ── Side effects ─────────────────────────────────────────────────────────

  useEffect(() => {
    const update = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty(
          "--header-height",
          `${headerRef.current.offsetHeight}px`
        );
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1280) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const toggleMobileMenu = () => {
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen((v) => !v);
  };

  const toggleMobileSearch = () => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen((v) => !v);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const activeMegaMenu = hoveredMenu !== null ? mainMenus[hoveredMenu] : null;

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 left-0 right-0 z-[1500] bg-primary"
      >
        <div className="container px-2 py-1 mx-auto md:px-4 md:py-2">
          <div className="flex items-center justify-between gap-4">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex flex-col items-center gap-1 md:gap-3 md:flex-row group shrink-0"
              onClick={closeMobileMenu}
            >
              <div className="flex items-center justify-center w-10 h-10 transition-transform duration-300 xl:w-14 xl:h-14 rounded-xl group-hover:scale-110">
                <img src={Logo} alt="LOGO FIBEM" />
              </div>
              <SiteTileForm1 />
            </Link>

            {/* ── Barre de recherche desktop ── */}
            <div className="relative flex-1 hidden max-w-md md:block">
              <TextInput
                type="text"
                placeholder={t("search_placeholder", "Rechercher")}
                className="py-2 pl-10 pr-16"
              />
              <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 pointer-events-none left-3 top-1/2" />
              <button
                type="button"
                className="absolute px-3 py-1 text-xs font-semibold text-white transition-colors -translate-y-1/2 rounded-full right-1 top-1/2 bg-destructive hover:bg-destructive/90"
              >
                OK
              </button>
            </div>

            {/* ── Icône recherche mobile ── */}
            <div className="relative md:hidden">
              <Btn
                className="p-2 rounded-md text-destructive hover:bg-white/10"
                onClick={toggleMobileSearch}
                aria-label="Rechercher"
              >
                {isMobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </Btn>
              <AnimatePresence>
                {isMobileSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-20 mt-2 -translate-x-1/2 left-1/2 min-w-[280px]"
                  >
                    <div className="relative">
                      <TextInput
                        type="text"
                        autoFocus
                        placeholder={t("search_placeholder", "Rechercher...")}
                        className="py-2 pl-10"
                      />
                      <Search className="absolute w-4 h-4 text-gray-500 -translate-y-1/2 pointer-events-none left-3 top-1/2" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Navigation desktop ── */}
            <div className="items-center hidden gap-1 xl:flex">
              <LanguageSelector />

              {mainMenus.map((item, idx) => (
                <DesktopNavItem
                  key={item.href || idx}
                  item={item}
                  idx={idx}
                  isActive={isMenuActive(item)}
                  hoveredMenu={hoveredMenu}
                  onEnter={handleMouseEnter}
                  onLeave={handleMouseLeave}
                />
              ))}

              <CurrencySelector />
              <div className="w-px h-5 mx-1 bg-white/30" />

              {isLoggedIn() ? (
                /* ── User avatar + dropdown ── */
                <div className="relative">
                  <Btn
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="text-sm font-semibold rounded-full w-9 h-9 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    {userInitials}
                  </Btn>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 z-50 w-56 p-2 mt-2 border shadow-xl rounded-xl bg-background top-full"
                        >
                          <div className="px-3 py-2 mb-1 border-b">
                            <p className="text-sm font-medium truncate">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs truncate text-muted-foreground">{user?.role}</p>
                          </div>

                          {userMenuItems.map((item) => {
                            const isActive =
                              location.pathname === item.href ||
                              location.pathname.startsWith(item.href + "/");
                            return (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setUserMenuOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent
                                  ${isActive ? "text-red-600 font-medium bg-red-50" : ""}`}
                              >
                                <item.icon
                                  className={`w-4 h-4 shrink-0 ${isActive ? "text-red-600" : ""}`}
                                />
                                <span className="flex-1">{item.label}</span>
                                {item.badge != null && (
                                  <Chip className="ml-auto bg-secondary text-secondary-foreground">
                                    {item.badge}
                                  </Chip>
                                )}
                              </Link>
                            );
                          })}

                          <div className="pt-1 mt-1 border-t">
                            <button
                              onClick={handleLogout}
                              className="flex items-center w-full gap-2 px-3 py-2 text-sm transition-colors rounded-md cursor-pointer text-destructive hover:bg-destructive/10"
                            >
                              <LogOut className="w-4 h-4" />
                              Déconnexion
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* ── Auth buttons ── */
                <div className="flex items-center gap-2">
                  <Link to="/auth/login">
                    <button
                      type="button"
                      className="px-4 py-1.5 text-xs font-semibold text-white border border-primary rounded-md bg-destructive/90 hover:bg-destructive transition-colors"
                    >
                      {t("authMenu.login", "Connexion")}
                    </button>
                  </Link>
                  <Link to="/auth/register">
                    <button
                      type="button"
                      className="px-4 py-1.5 text-xs font-semibold text-white border border-white/40 rounded-md bg-primary/70 hover:text-destructive hover:bg-transparent transition-colors"
                    >
                      {t("authMenu.register", "Inscription")}
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Contrôles mobiles ── */}
            <div className="flex items-center gap-1 xl:hidden">
              <LanguageSelector />
              <CurrencySelector />
              <Btn
                onClick={toggleMobileMenu}
                className="relative p-0 rounded-md h-9 w-9 text-primary-foreground hover:bg-white/10"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Btn>
            </div>
          </div>
        </div>

        {/* ── Menu mobile ── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-auto bg-primary shadow-lg xl:hidden max-h-[80vh]"
            >
              {isLoggedIn() && (
                <div className="flex items-center gap-3 p-3 border-b border-white/10">
                  <div className="flex items-center justify-center w-10 h-10 text-sm font-semibold rounded-full bg-secondary text-secondary-foreground shrink-0">
                    {userInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-secondary">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs truncate text-accent">{user?.email}</p>
                  </div>
                </div>
              )}

              <div className="container flex flex-col gap-1 px-3 py-3">
                <MobileMenuList items={mainMenus} closeMobileMenu={closeMobileMenu} />

                {isLoggedIn() ? (
                  <>
                    <div className="my-1 border-t border-white/10" />
                    <MobileMenuList items={userMenuItems} closeMobileMenu={closeMobileMenu} />
                    <button
                      onClick={() => { closeMobileMenu(); handleLogout(); }}
                      className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-2 text-sm font-semibold text-white transition-colors rounded-md bg-destructive hover:bg-destructive/90"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <div className="my-1 border-t border-white/10" />
                    {authMenus.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="relative overflow-hidden rounded-md group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span
                          className={`absolute inset-0 w-0 group-hover:w-full transition-all duration-300
                            ${item.href === "/auth/login" ? "bg-accent/30" : "bg-accent/20"}`}
                        />
                        <span className="relative flex items-center gap-2 px-4 py-2 font-medium text-orange-300">
                          <item.icon className="w-4 h-4 text-destructive" />
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── Mega-menu pleine largeur ── */}
      {activeMegaMenu?.subMenus && (
        <div
          onMouseEnter={() => handleMouseEnter(hoveredMenu)}
          onMouseLeave={handleMouseLeave}
        >
          <MegaMenuPanel
            item={activeMegaMenu}
            activeIdx={hoveredMenu}
            onClose={() => setHoveredMenu(null)}
            onMouseEnter={() => handleMouseEnter(hoveredMenu)}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      )}
    </>
  );
};

export default Header;