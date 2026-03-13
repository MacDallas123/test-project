import { useLanguage } from "@/context/LanguageContext";
import Prest from "@/assets/deliv.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  ArrowRight,
  Home,
  Clock,
  Heart,
  Star,
  Zap,
  MapPin,
  ShieldCheck,
  Utensils,
  TrendingUp,
  Users,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   Données des slides
───────────────────────────────────────────────────────────── */
const slides = [
  {
    id: 1,
    type: "step1",
    badge: "Bienvenue",
    icon: <Home className="w-5 h-5" />,
    title: (
      <>
        Bienvenu sur{" "}
        <span className="text-secondary">L</span>ivrer
        <span className="text-secondary">N</span>ourriture
      </>
    ),
    subtitle: "Vos plats préférés, livrés en un clin d'œil",
    tagline: "Commandez en 3 clics. Recevez en 30 min.",
    cta: { label: "Commander maintenant", to: "/" },
    stats: [
      { icon: <Utensils className="w-5 h-5" />, value: "100+", label: "Restaurants" },
      { icon: <Clock className="w-5 h-5" />, value: "30 min", label: "Livraison moy." },
      { icon: <Users className="w-5 h-5" />, value: "10k+", label: "Clients satisfaits" },
      { icon: <MapPin className="w-5 h-5" />, value: "5 km", label: "Rayon de livraison" },
    ],
    visual: { emoji: "🍔", label: "Commande en cours…", sub: "Livraison dans 18 min" },
  },
  {
    id: 2,
    type: "step2",
    badge: "Express",
    icon: <Zap className="w-5 h-5" />,
    title: "Rapide. Simple. Sans prise de tête.",
    subtitle: "En quelques clics, votre repas est en route.",
    tagline: "Interface intuitive • Paiement 100 % sécurisé • Suivi GPS",
    cta: { label: "Accéder à l'app", to: "/auth/login" },
    stats: [
      { icon: <ShieldCheck className="w-5 h-5" />, value: "100%", label: "Paiement sécurisé" },
      { icon: <MapPin className="w-5 h-5" />, value: "GPS", label: "Suivi en direct" },
      { icon: <Zap className="w-5 h-5" />, value: "3 clics", label: "Pour commander" },
      { icon: <Clock className="w-5 h-5" />, value: "24/7", label: "Disponibilité" },
    ],
    visual: { emoji: "⚡", label: "Suivi GPS actif", sub: "Livreur à 2 km de chez vous" },
  },
  {
    id: 3,
    type: "step3",
    badge: "Populaire",
    icon: <Heart className="w-5 h-5" />,
    title: "Un choix pour toutes vos envies",
    subtitle: "Burgers, pizzas, plats locaux, options healthy…",
    tagline: "100+ restaurants • Cuisines variées • Options végétariennes",
    cta: { label: "Explorer les restaurants", to: "/auth/register" },
    stats: [
      { icon: <Utensils className="w-5 h-5" />, value: "20+", label: "Types de cuisine" },
      { icon: <Heart className="w-5 h-5" />, value: "500+", label: "Plats au menu" },
      { icon: <Star className="w-5 h-5" />, value: "4.8★", label: "Note moyenne" },
      { icon: <TrendingUp className="w-5 h-5" />, value: "Nouveau", label: "Chaque semaine" },
    ],
    visual: { emoji: "🥗", label: "Suggestion du jour", sub: "Bowl healthy • 1 200 FCFA" },
  },
  {
    id: 4,
    type: "step4",
    badge: "Local",
    icon: <Star className="w-5 h-5" />,
    title: "Des restaurants d'ici, livrés avec soin",
    subtitle: "Partenaires locaux • Produits frais • Engagement qualité",
    tagline: "Nous soutenons les restaurateurs de votre ville.",
    cta: { label: "Devenir partenaire", to: "/contact" },
    stats: [
      { icon: <Package className="w-5 h-5" />, value: "Frais", label: "Produits locaux" },
      { icon: <ShieldCheck className="w-5 h-5" />, value: "Certifié", label: "Qualité garantie" },
      { icon: <Users className="w-5 h-5" />, value: "50+", label: "Partenaires" },
      { icon: <TrendingUp className="w-5 h-5" />, value: "+30%", label: "Ventes restaurateurs" },
    ],
    visual: { emoji: "🏪", label: "Partenaire certifié", sub: "Restaurant du quartier" },
  },
];

/* ─────────────────────────────────────────────────────────────
   Composant principal
───────────────────────────────────────────────────────────── */
const HomeHero = () => {
  const { t } = useLanguage();

  const renderSlide = (slide) => (
    <div className="container px-4 py-16 mx-auto md:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

        {/* ── Colonne gauche : texte ── */}
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-20 space-y-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Badge className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border rounded-full bg-secondary/20 text-secondary border-secondary/30">
              {slide.icon}
              {slide.badge}
            </Badge>
          </motion.div>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl"
          >
            {slide.title}
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-lg text-lg text-primary-foreground/80 md:text-xl"
          >
            {slide.subtitle}
          </motion.p>

          {/* Tagline avec underline animé */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative inline-block"
          >
            <span className="text-base font-medium text-muted md:text-lg">
              {slide.tagline}
            </span>
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4"
          >
            {slide.stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 + i * 0.08 }}
                className="flex flex-col items-center gap-1 p-3 text-center transition-colors border rounded-xl bg-white/10 backdrop-blur-sm border-white/15 hover:bg-white/15"
              >
                <span className="text-secondary">{s.icon}</span>
                <span className="text-base font-bold text-primary-foreground">{s.value}</span>
                <span className="text-xs leading-tight text-primary-foreground/60">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="pt-2"
          >
            <Button
              asChild
              size="lg"
              className="gap-3 text-base font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/30 transition-all hover:shadow-secondary/50 hover:scale-[1.02]"
            >
              <Link to={slide.cta.to}>
                {slide.cta.label}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* ── Colonne droite : visuel flottant ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative items-center justify-center hidden lg:flex"
        >
          {/* Halo de fond */}
          <div className="absolute inset-0 rounded-3xl bg-secondary/10 blur-3xl" />

          {/* Carte principale flottante */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 flex flex-col items-center justify-center w-64 h-64 gap-6 p-10 border shadow-2xl rounded-3xl bg-white/10 backdrop-blur-md border-white/20"
          >
            <span className="text-8xl drop-shadow-lg">{slide.visual.emoji}</span>
            <div className="text-center">
              <p className="text-sm font-semibold text-primary-foreground">{slide.visual.label}</p>
              <p className="mt-1 text-xs text-primary-foreground/60">{slide.visual.sub}</p>
            </div>
          </motion.div>

          {/* Badge orbital animé */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              className="w-[320px] h-[320px] rounded-full border border-dashed border-secondary/30"
              style={{ position: "absolute" }}
            />
            <motion.div
              className="absolute"
              style={{ top: "0%", left: "50%", transformOrigin: "0 160px" }}
            >
              <span className="flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full shadow-md bg-secondary text-secondary-foreground">
                {slide.icon}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );

  return (
    <section
      className="relative overflow-hidden min-h-[70vh] flex items-center"
      style={{
        backgroundImage: `url(${Prest})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/50 to-primary/30" />

      {/* Particules décoratives discrètes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-secondary/20"
            style={{
              width: 40 + i * 12,
              height: 40 + i * 12,
              left: `${10 + i * 11}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
            animate={{ y: [0, -18, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: (index, className) =>
            `<span class="${className} !w-3 !h-3 !bg-secondary/70 hover:!bg-secondary"></span>`,
        }}
        autoplay={{ delay: 7000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        speed={1000}
        loop={true}
        allowTouchMove={true}
        className="w-full hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative z-10">{renderSlide(slide)}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HomeHero;