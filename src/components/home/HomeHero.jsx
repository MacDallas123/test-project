import { useLanguage } from "@/context/LanguageContext";
// import Prest from "@/assets/prest.jpg";
import Prest from "@/assets/hero-delivery.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  ArrowRight,
  LogIn,
  UserPlus,
  Mail,
  Home,
  Clock,
  Heart,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const HomeHero = () => {
  const { t } = useLanguage();

  const slides = [
    {
      id: 1,
      type: "step1",
      title: (
        <>
          Bienvenu sur <span className="text-7xl text-secondary">L</span>ivrer
          <span className="text-7xl text-secondary">N</span>ourriture
        </>
      ),
      subtitle: "",
      tagline: "Vos plats préférés, livrés en un clin d’œil",
      icon: <Home className="w-8 h-8 md:w-10 md:h-10" />,
      badge: "Bienvenue",
    },
    {
      id: 2,
      type: "step2",
      title: "Rapide. Simple. Sans prise de tête.",
      subtitle:
        "En quelques clics, votre repas est en route. Suivi en temps réel, paiement sécurisé.",
      tagline: "Interface intuitive • Paiement 100% sécurisé • Suivi GPS",
      icon: <Clock className="w-8 h-8 md:w-10 md:h-10" />,
      badge: "Express",
    },
    {
      id: 3,
      type: "step3",
      title: "Un choix pour toutes vos envies",
      subtitle:
        "Burgers, pizzas, plats locaux, options healthy… il y a toujours quelque chose pour vous.",
      tagline: "100+ restaurants • Cuisines variées • Options végétariennes",
      icon: <Heart className="w-8 h-8 md:w-10 md:h-10" />,
      badge: "Populaire",
    },
    {
      id: 4,
      type: "step4",
      title: "Des restaurants d'ici, livrés avec soin",
      subtitle:
        "Nous travaillons avec des partenaires locaux pour vous offrir qualité et fraîcheur.",
      tagline: "Partenaire local • Produits frais • Engagement qualité",
      icon: <Star className="w-8 h-8 md:w-10 md:h-10" />,
      badge: "local",
    },
  ];

  const renderSlideContent = (slide) => {
    const colorVariants = {
      step1: {
        gradient: "from-destructive via-secondary to-destructive",
        badge: "bg-destructive/10 text-destructive",
      },
      step2: {
        gradient: "from-destructive via-secondary to-destructive",
        badge: "bg-destructive/10 text-destructive",
      },
      step3: {
        gradient: "from-destructive via-secondary to-destructive",
        badge: "bg-destructive/10 text-destructive",
      },
      step4: {
        gradient: "from-destructive via-secondary to-destructive",
        badge: "bg-destructive/10 text-destructive",
      },
      /*login: {
                gradient: "from-blue-500 to-cyan-500",
                badge: "bg-blue-500/10 text-blue-500"
            },
            register: {
                gradient: "from-green-500 to-emerald-500",
                badge: "bg-green-500/10 text-green-500"
            },
            contact: {
                gradient: "from-purple-500 to-pink-500",
                badge: "bg-purple-500/10 text-purple-500"
            }*/
    };

    const colors = colorVariants[slide.type] || colorVariants.step1;

    return (
      <div className="space-y-6 md:space-y-8">
        {/* Badge */}
        {slide.badge && (
          <Badge
            className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full ${colors.badge}`}
          >
            {slide.icon && <span className="mr-2">{slide.icon}</span>}
            {slide.badge}
          </Badge>
        )}

        {/* Main Title with Animation */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden"
          >
            <h1 className="font-bold tracking-tight">
              <span className="block text-4xl md:text-5xl lg:text-6xl text-primary-foreground/80">
                {slide.title}
              </span>
              <span
                className={`block text-2xl text-secondary md:text-3xl lg:text-4xl bg-linear-to-r bg-clip-text `}
              >
                {slide.subtitle}
              </span>
            </h1>
          </motion.div>

          {/* Animated Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative inline-block">
              <span className="text-lg font-medium text-muted md:text-xl">
                {slide.tagline}
              </span>
              <motion.div
                className="absolute bottom-0 left-0 w-0 h-[2px] bg-linear-to-r from-transparent via-current to-transparent"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Simple Stats or Icons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-4 gap-4 mt-8 md:mt-12"
        >
          {/* {slide.type === "welcome" && (
                        <>
                            <div className="p-3 text-center rounded-lg bg-primary/5">
                                <div className="text-xl font-bold text-primary md:text-2xl">Tous</div>
                                <div className="text-xs md:text-sm">Services</div>
                            </div>
                            <div className="p-3 text-center rounded-lg bg-primary/5">
                                <div className="text-xl font-bold text-primary md:text-2xl">Gratuit</div>
                                <div className="text-xs md:text-sm">Démarrage</div>
                            </div>
                        </>
                    )} */}

          {/* {slide.type === "login" && (
                        <>
                            <div className="p-3 text-center rounded-lg bg-blue-500/5">
                                <div className="text-xl font-bold text-blue-600 md:text-2xl">Accès</div>
                                <div className="text-xs md:text-sm">Immédiat</div>
                            </div>
                            <div className="p-3 text-center rounded-lg bg-blue-500/5">
                                <div className="text-xl font-bold text-blue-600 md:text-2xl">Sécurisé</div>
                                <div className="text-xs md:text-sm">Compte</div>
                            </div>
                        </>
                    )} */}

          {/* {slide.type === "register" && (
                        <>
                            <div className="p-3 text-center rounded-lg bg-green-500/5">
                                <div className="text-xl font-bold text-green-600 md:text-2xl">0€</div>
                                <div className="text-xs md:text-sm">Essai gratuit</div>
                            </div>
                            <div className="p-3 text-center rounded-lg bg-green-500/5">
                                <div className="text-xl font-bold text-green-600 md:text-2xl">Rapide</div>
                                <div className="text-xs md:text-sm">Inscription</div>
                            </div>
                        </>
                    )} */}

          {/* {slide.type === "contact" && (
                        <>
                            <div className="p-3 text-center rounded-lg bg-purple-500/5">
                                <div className="text-xl font-bold text-purple-600 md:text-2xl">24h/24</div>
                                <div className="text-xs md:text-sm">Support</div>
                            </div>
                            <div className="p-3 text-center rounded-lg bg-purple-500/5">
                                <div className="text-xl font-bold text-purple-600 md:text-2xl">Expert</div>
                                <div className="text-xs md:text-sm">Équipe</div>
                            </div>
                        </>
                    )} */}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="pt-4"
        >
          <Button
            asChild
            size="lg"
            // className={`gap-3 text-lg ${slide.type === 'welcome' ? 'bg-gradient-to-r from-primary to-secondary' : slide.type === 'login' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : slide.type === 'register' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
            className={`text-secondary`}
            variant="link"
          >
            <Link
              to={
                slide.type === "step1"
                  ? "/"
                  : slide.type === "step2"
                    ? "/auth/login"
                    : slide.type === "step3"
                      ? "/auth/register"
                      : "/contact"
              }
            >
              {slide.type === "step1"
                ? "Commander maintenant"
                : slide.type === "step2"
                  ? "Télécharger l'app"
                  : slide.type === "step3"
                    ? "Explorer les restaurants"
                    : "Devenir partenaire"}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  };

  return (
    <section
      className="relative overflow-hidden bg-linear-to-br from-primary/10 to-muted/20 md:px-8 min-h-[60vh]  flex items-center"
      style={{
        backgroundImage: `url(${Prest})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/50 via-primary/30 to-transparent"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10 bg-secondary"
            style={{
              width: Math.random() * 80 + 40,
              height: Math.random() * 80 + 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, Math.random() * 15 - 7.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        effect="fade"
        pagination={{
          clickable: true,
          dynamicBullets: true,
          renderBullet: function (index, className) {
            return `<span class="${className} w-3! h-3! bg-destructive/80! hover:bg-destructive!"></span>`;
          },
        }}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        speed={1200}
        loop={true}
        allowTouchMove={true}
        className="w-full hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative z-10 px-4 py-16 md:py-24">
              <div className="container mx-auto">
                {/* <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"> */}
                <div className="grid items-center gap-8 lg:gap-16">
                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-20"
                  >
                    {renderSlideContent(slide)}
                  </motion.div>

                  {/* Image/Visual */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative hidden lg:block"
                  >
                    <div className="relative">
                      {/* Floating card effect */}
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 rounded-3xl blur-xl"
                      />

                      {/* <div className="relative overflow-hidden border rounded-3xl bg-background/80 backdrop-blur-sm border-border/50 w-full h-[380px]">
                                                <img
                                                    src={Prest}
                                                    alt={slide.title}
                                                    className="object-cover w-full h-[380px] transform transition-transform duration-700 hover:scale-105"
                                                />

                                                <div className={`absolute inset-0 flex items-center justify-center ${slide.type === 'welcome' ? 'bg-primary/20' : slide.type === 'login' ? 'bg-blue-500/20' : slide.type === 'register' ? 'bg-green-500/20' : 'bg-purple-500/20'}`}>
                                                    <div className="p-6 text-center text-white">
                                                        <div className="mb-4 text-4xl font-bold">
                                                            {slide.type === 'welcome' ? '👋' :
                                                             slide.type === 'login' ? '🔑' :
                                                             slide.type === 'register' ? '🚀' :
                                                             '📞'}
                                                        </div>
                                                        <h3 className="text-2xl font-bold">
                                                            {slide.type === 'welcome' ? 'Bienvenue sur Eat<span className="text-2xl">X</span>press' :
                                                             slide.type === 'login' ? 'Connectez-vous' :
                                                             slide.type === 'register' ? 'Rejoignez-nous' :
                                                             'Contactez-nous'}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div> */}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HomeHero;
