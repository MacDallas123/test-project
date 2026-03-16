import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ShoppingCart,
  Users,
  Building,
  ArrowRight,
  CheckCircle,
  FileSpreadsheet,
  Receipt,
  Package,
  BarChart3,
  Clock,
  Star,
  MapPin,
  ChefHat,
  Briefcase,
  TrendingUp,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPinned,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  Timer,
  Leaf,
  Crown,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";

import Plat1 from "@/assets/hero.avif";
// Using 9 web image URLs for Plat2 to Plat10.
// Each "PlatX" is now a string of an image URL.

const Plat2 = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";
// Changed to a food image (pizza)
const Plat3 = "https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?auto=format&fit=crop&w=600&q=80"; //-
const Plat4 = "https://images.unsplash.com/photo-1447078806655-40579c2520d6?auto=format&fit=crop&w=600&q=80"; 
// Changed to a food image (ramen)
const Plat5 = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";//-
const Plat6 = "https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?auto=format&fit=crop&w=600&q=80";
const Plat7 = "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=600&q=80";
const Plat8 = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80";
// Changed to a food image (dessert)
const Plat9 = "https://images.unsplash.com/photo-1519864600243-96510cfc7489?auto=format&fit=crop&w=600&q=80"; //-
const Plat10 = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"; //-
import { useCurrency } from "@/context/CurrencyContext";
import Autoplay from "embla-carousel-autoplay";


const ServicesSection = () => {
  const { formatPriceFrom } = useCurrency();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Carrousels refs
  // Setup Embla carousel with auto-scroll (autoplay)

  const autoplayRef = useRef(
    Autoplay(
      { delay: 4500, stopOnMouseEnter: true, stopOnInteraction: false }
    )
  );

  const autoplayRef2 = useRef(
    Autoplay(
      { delay: 4500, stopOnMouseEnter: true, stopOnInteraction: false }
    )
  );

  const [mealsEmblaRef, mealsEmblaApi] = useEmblaCarousel(
    {
      align: "start",
      containScroll: "trimSnaps",
      dragFree: false,
      loop: false,
      skipSnaps: false,
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 768px)": { slidesToScroll: 2 },
        "(min-width: 1024px)": { slidesToScroll: 4 },
      },
    },
    [autoplayRef.current]
  );

  const [jobsEmblaRef, jobsEmblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: false,
    skipSnaps: false,
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  }, [autoplayRef2.current]);

  // Données des plats populaires (10 plats)
  const popularMeals = [
    {
      id: 1,
      title: "Poulet Yassa",
      restaurant: "Le Dakarois",
      category: "Africain",
      price: formatPriceFrom(9.90),
      rating: 4.8,
      reviews: 124,
      deliveryTime: "30-40 min",
      description: "Poulet mariné au citron avec oignons caramélisés, accompagné de riz blanc",
      image: Plat1,
      tags: ["Populaire", "Épicé"],
      badge: "Coup de cœur",
      badgeColor: "bg-amber-500",
      icon: <Flame className="w-3 h-3" />,
    },
    {
      id: 2,
      title: "Burger Gourmet",
      restaurant: "Burger House",
      category: "Fast-food",
      price: formatPriceFrom(12.50),
      rating: 4.7,
      reviews: 89,
      deliveryTime: "25-35 min",
      description: "Steak haché 180g, cheddar fondu, bacon croustillant et sauce maison",
      image: Plat2,
      tags: ["Nouveau"],
      badge: "Nouveau",
      badgeColor: "bg-blue-500",
      icon: <Sparkles className="w-3 h-3" />,
    },
    {
      id: 3,
      title: "Pizza Margherita",
      restaurant: "Pizzeria Roma",
      category: "Italien",
      price: formatPriceFrom(10.90),
      rating: 4.9,
      reviews: 256,
      deliveryTime: "35-45 min",
      description: "Base tomate, mozzarella fraîche, basilic et huile d'olive",
      image: Plat3,
      tags: ["Végétarien"],
      badge: "Top Chef",
      badgeColor: "bg-purple-500",
      icon: <Crown className="w-3 h-3" />,
    },
    {
      id: 4,
      title: "Salade César",
      restaurant: "Green Life",
      category: "Healthy",
      price: formatPriceFrom(8.80),
      rating: 4.6,
      reviews: 67,
      deliveryTime: "20-30 min",
      description: "Poulet grillé, parmesan, croûtons et sauce césar maison",
      image: Plat4,
      tags: ["Healthy"],
      badge: "Light",
      badgeColor: "bg-emerald-500",
      icon: <Leaf className="w-3 h-3" />,
    },
    {
      id: 5,
      title: "Pad Thaï",
      restaurant: "Thai Orchidée",
      category: "Asiatique",
      price: formatPriceFrom(13.50),
      rating: 4.8,
      reviews: 145,
      deliveryTime: "35-45 min",
      description: "Nouilles de riz sautées aux crevettes, cacahuètes et germes de soja",
      image: Plat5,
      tags: ["Populaire", "Épicé"],
      badge: "Chef's special",
      badgeColor: "bg-orange-500",
      icon: <Crown className="w-3 h-3" />,
    },
    {
      id: 6,
      title: "Bowl Poké",
      restaurant: "Hawaii Bowl",
      category: "Healthy",
      price: formatPriceFrom(14.90),
      rating: 4.9,
      reviews: 98,
      deliveryTime: "25-35 min",
      description: "Saumon frais, riz vinaigré, avocat, algues et sauce soja",
      image: Plat6,
      tags: ["Nouveau", "Healthy"],
      badge: "Nouveau",
      badgeColor: "bg-blue-500",
      icon: <Sparkles className="w-3 h-3" />,
    },
    {
      id: 7,
      title: "Tacos Al Pastor",
      restaurant: "El Camino",
      category: "Mexicain",
      price: formatPriceFrom(11.90),
      rating: 4.7,
      reviews: 156,
      deliveryTime: "30-40 min",
      description: "Tortillas de maïs, porc mariné, ananas, oignons et coriandre",
      image: Plat7,
      tags: ["Épicé"],
      badge: "Authentique",
      badgeColor: "bg-red-500",
      icon: <Flame className="w-3 h-3" />,
    },
    {
      id: 8,
      title: "Ramen Tonkotsu",
      restaurant: "Izakaya San",
      category: "Japonais",
      price: formatPriceFrom(15.90),
      rating: 4.9,
      reviews: 203,
      deliveryTime: "40-50 min",
      description: "Bouillon de porc, nouilles, œuf mariné, nori et poitrine de porc",
      image: Plat8,
      tags: ["Populaire"],
      badge: "Incontournable",
      badgeColor: "bg-amber-500",
      icon: <Crown className="w-3 h-3" />,
    },
    {
      id: 9,
      title: "Couscous Royal",
      restaurant: "Le Marocain",
      category: "Africain",
      price: formatPriceFrom(16.50),
      rating: 4.8,
      reviews: 187,
      deliveryTime: "45-55 min",
      description: "Semoule fine, légumes, merguez, poulet et mouton",
      image: Plat9,
      tags: ["Familial"],
      badge: "Plat familial",
      badgeColor: "bg-green-500",
      icon: <Users className="w-3 h-3" />,
    },
    {
      id: 10,
      title: "Sushi Deluxe",
      restaurant: "Sushi Master",
      category: "Japonais",
      price: formatPriceFrom(22.90),
      rating: 5.0,
      reviews: 312,
      deliveryTime: "35-45 min",
      description: "Assortiment de 20 pièces : saumon, thon, daurade, makis et californiens",
      image: Plat10,
      tags: ["Premium", "Nouveau"],
      badge: "Premium",
      badgeColor: "bg-indigo-500",
      icon: <Crown className="w-3 h-3" />,
    },
  ];

  // Données des offres d'emploi (8 offres)
  const jobOffers = [
    {
      id: 101,
      title: "Chef de partie",
      restaurant: "Le Grand Restaurant",
      location: "Paris 8ème",
      contract: "CDI",
      salary: "2800-3200€",
      experience: "2-5 ans",
      postedAt: "Il y a 2 jours",
      type: "Cuisine",
      description: "Nous recherchons un chef de partie passionné pour rejoindre notre brigade.",
      image: Plat1,
      tags: ["Expérimenté", "Temps plein"],
      badge: "Urgent",
      badgeColor: "bg-red-500",
    },
    {
      id: 102,
      title: "Serveur / Serveuse",
      restaurant: "Brasserie Moderne",
      location: "Lyon 2ème",
      contract: "CDD",
      salary: "2100-2400€",
      experience: "Débutant accepté",
      postedAt: "Il y a 1 jour",
      type: "Salle",
      description: "Service en salle dynamique, travail en équipe, anglais souhaité.",
      image: Plat2,
      tags: ["Débutant", "Formation"],
      badge: "Formation",
      badgeColor: "bg-blue-500",
    },
    {
      id: 103,
      title: "Second de cuisine",
      restaurant: "Auberge du Soleil",
      location: "Nice",
      contract: "CDI",
      salary: "3000-3500€",
      experience: "5-8 ans",
      postedAt: "Il y a 3 jours",
      type: "Cuisine",
      description: "Gestion de la brigade, création de menus, respect des normes HACCP.",
      image: Plat3,
      tags: ["Expérimenté", "Management"],
      badge: "Top salaire",
      badgeColor: "bg-green-500",
    },
    {
      id: 104,
      title: "Pizzaiolo",
      restaurant: "Pizza Di Napoli",
      location: "Marseille",
      contract: "CDI",
      salary: "2500-3000€",
      experience: "2-4 ans",
      postedAt: "Il y a 5 jours",
      type: "Cuisine",
      description: "Maîtrise de la pâte à pizza, cuisson au feu de bois, créativité.",
      image: Plat4,
      tags: ["Spécialisé", "Saisonnier"],
      badge: "Saisonnier",
      badgeColor: "bg-amber-500",
    },
    {
      id: 105,
      title: "Barman / Barmaid",
      restaurant: "Skybar Lounge",
      location: "Bordeaux",
      contract: "CDI",
      salary: "2300-2700€",
      experience: "1-3 ans",
      postedAt: "Il y a 1 semaine",
      type: "Bar",
      description: "Création de cocktails, service au bar, gestion des stocks.",
      image: Plat5,
      tags: ["Créatif", "Soirée"],
      badge: "Créatif",
      badgeColor: "bg-purple-500",
    },
    {
      id: 106,
      title: "Plongeur",
      restaurant: "Hôtel Palace",
      location: "Cannes",
      contract: "Saisonnier",
      salary: "1900-2100€",
      experience: "Débutant accepté",
      postedAt: "Il y a 3 jours",
      type: "Nettoyage",
      description: "Nettoyage de la vaisselle et des locaux, aide en cuisine.",
      image: Plat6,
      tags: ["Saisonnier", "Flexible"],
      badge: "Logement possible",
      badgeColor: "bg-teal-500",
    },
    {
      id: 107,
      title: "Gérant restaurant",
      restaurant: "Fast Food Chain",
      location: "Toulouse",
      contract: "CDI",
      salary: "3500-4200€",
      experience: "5-10 ans",
      postedAt: "Il y a 2 jours",
      type: "Management",
      description: "Gestion complète du restaurant, management d'équipe, objectifs commerciaux.",
      image: Plat7,
      tags: ["Management", "Confirmé"],
      badge: "Cadre",
      badgeColor: "bg-indigo-500",
    },
    {
      id: 108,
      title: "Pâtissier",
      restaurant: "Boulangerie Fine",
      location: "Strasbourg",
      contract: "CDI",
      salary: "2600-3000€",
      experience: "3-5 ans",
      postedAt: "Il y a 4 jours",
      type: "Pâtisserie",
      description: "Création de pâtisseries, entremets, viennoiseries. Créativité exigée.",
      image: Plat8,
      tags: ["Créatif", "Spécialisé"],
      badge: "Artisan",
      badgeColor: "bg-rose-500",
    },
  ];

  // Outils professionnels
  const professionalTools = [
    {
      to: "/cv",
      icon: <FileText className="w-8 h-8" />,
      iconBg: "bg-blue-500",
      cardBg: "bg-gradient-to-br from-blue-50 to-white",
      accentText: "text-blue-600",
      title: "Générateur de CV",
      description: "Créez un CV professionnel pour la restauration en quelques minutes",
      button: "Créer mon CV",
      bottom: "Modèles exclusifs pour la restauration",
      border: "",
      delay: 0,
    },
    {
      to: "/facture",
      icon: <Receipt className="w-8 h-8" />,
      iconBg: "bg-green-500",
      cardBg: "bg-gradient-to-br from-green-50 to-white",
      accentText: "text-green-600",
      title: "Générateur de factures",
      description: "Factures personnalisées et conformes à la législation",
      button: "Créer une facture",
      bottom: "TVA incluse, numérotation automatique",
      border: "",
      delay: 0.1,
    },
    {
      to: "/devis",
      icon: <FileSpreadsheet className="w-8 h-8" />,
      iconBg: "bg-amber-500",
      cardBg: "bg-gradient-to-br from-amber-50 to-white",
      accentText: "text-amber-600",
      title: "Générateur de devis",
      description: "Devis professionnels pour vos prestations et événements",
      button: "Créer un devis",
      bottom: "Personnalisable, conversion en facture",
      border: "",
      delay: 0.2,
    },
    {
      to: "/avoirs",
      icon: <FileText className="w-8 h-8" />,
      iconBg: "bg-purple-500",
      cardBg: "bg-gradient-to-br from-purple-50 to-white",
      accentText: "text-purple-600",
      title: "Générateur d'avoirs",
      description: "Créez des avoirs et notes de crédit en quelques clics",
      button: "Créer un avoir",
      bottom: "Remboursements, annulations, corrections",
      border: "",
      delay: 0.3,
    },
  ];

  // Cartes d'outils
  const cardTools = [
    {
      title: "Gestion des employés",
      description: "Planning, paie, contrats de travail",
      to: "/outils/gestion-employes",
      icon: <Users className="w-6 h-6" />,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
      linkColor: "text-indigo-600"
    },
    {
      title: "Gestion des stocks",
      description: "Inventaire, alertes, commandes fournisseurs",
      to: "/outils/gestion-stocks",
      icon: <Package className="w-6 h-6" />,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-100",
      linkColor: "text-pink-600"
    },
    {
      title: "Tableaux de bord",
      description: "Analyses, chiffre d'affaires, performances",
      to: "/outils/analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      iconColor: "text-teal-600",
      iconBg: "bg-teal-100",
      linkColor: "text-teal-600"
    }
  ];
  
  // Scroll progress pour les carrousels
  const onMealsScroll = useCallback(() => {
    if (!mealsEmblaApi) return;
    const progress = Math.max(0, Math.min(1, mealsEmblaApi.scrollProgress()));
    setScrollProgress(progress);
  }, [mealsEmblaApi]);

  useEffect(() => {
    if (mealsEmblaApi) {
      onMealsScroll();
      mealsEmblaApi.on("scroll", onMealsScroll);
      mealsEmblaApi.on("reInit", onMealsScroll);
    }
  }, [mealsEmblaApi, onMealsScroll]);

  const scrollPrev = useCallback(() => {
    if (mealsEmblaApi) mealsEmblaApi.scrollPrev();
  }, [mealsEmblaApi]);

  const scrollNext = useCallback(() => {
    if (mealsEmblaApi) mealsEmblaApi.scrollNext();
  }, [mealsEmblaApi]);

  const scrollJobsPrev = useCallback(() => {
    if (jobsEmblaApi) jobsEmblaApi.scrollPrev();
  }, [jobsEmblaApi]);

  const scrollJobsNext = useCallback(() => {
    if (jobsEmblaApi) jobsEmblaApi.scrollNext();
  }, [jobsEmblaApi]);

  return (
    <section id="services" className="px-4 pt-16 pb-8 bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary shadow-sm">
              <ChefHat className="w-4 h-4" />
              <span>Découvrez nos services</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-transparent md:text-4xl lg:text-5xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text">
              Qu'est-ce qui vous ferait plaisir ?
            </h2>
            <p className="text-lg text-gray-600">
              Des plats délicieux et des opportunités professionnelles pour une expérience culinaire complète
            </p>
          </motion.div>
        </div>

        {/* SECTION REPAS - Scroll horizontal optimisé */}
        <div className="mb-20">
          <div className="flex flex-wrap items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold md:text-3xl">Plats populaires</h3>
                {/* <span className="px-3 py-1 text-xs font-medium text-white rounded-full bg-primary">
                  10+ plats
                </span> */}
              </div>
              <p className="text-gray-600">
                Découvrez les préférés de notre communauté
              </p>
            </div>
            
            {/* Navigation buttons */}
            <div className="hidden gap-2 md:flex">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                className="transition-all border-2 rounded-full hover:bg-primary hover:text-white hover:border-primary"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                className="transition-all border-2 rounded-full hover:bg-primary hover:text-white hover:border-primary"
                aria-label="Suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Carrousel Repas */}
          <div className="relative">
            <div className="py-4 overflow-hidden" ref={mealsEmblaRef}>
              <div className="flex gap-4">
                {popularMeals.map((meal, index) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15, delay: index * 0.025 }}
                    className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(25%-12px)]"
                  >
                    <Card className="h-full overflow-hidden transition-all duration-150 bg-white border-0 shadow-md group hover:shadow-xl hover:-translate-y-1 rounded-2xl">
                      {/* Image Container */}
                      <div className="relative h-48 overflow-hidden">
                        <div className="absolute inset-0 z-10 transition-opacity opacity-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:opacity-100" />
                        <img
                          src={meal.image}
                          alt={meal.title}
                          className="object-cover w-full h-full transition-transform duration-400 group-hover:scale-110"
                        />
                        
                        {/* Badge */}
                        <div className="absolute z-20 flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white rounded-full top-3 left-3 bg-primary/90 backdrop-blur-sm">
                          {meal.icon}
                          <span>{meal.badge}</span>
                        </div>

                        {/* Tags */}
                        <div className="absolute z-20 flex gap-2 bottom-3 left-3">
                          {meal.tags?.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 text-xs font-medium bg-white/95 rounded-full shadow-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <CardContent className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-bold line-clamp-1">{meal.title}</h4>
                            <p className="text-sm text-gray-500">{meal.restaurant}</p>
                          </div>
                          <span className="px-3 py-1 text-sm font-bold text-white rounded-full bg-primary">
                            {meal.price.toLocaleString()}
                          </span>
                        </div>

                        {/* Rating & Time */}
                        <div className="flex items-center justify-between mb-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-medium">{meal.rating}</span>
                            <span className="text-gray-400">({meal.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Timer className="w-4 h-4" />
                            <span>{meal.deliveryTime}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                          {meal.description}
                        </p>

                        {/* Action Button */}
                        <Button 
                          className="w-full gap-2 text-white transition-all rounded-xl bg-primary hover:bg-primary/90 group-hover:shadow-lg"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Ajouter au panier
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Carte "Voir plus" */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(25%-12px)]"
                >
                  <Link to="/search/meals">
                    <Card className="h-full overflow-hidden transition-all duration-150 border-2 border-gray-300 border-dashed cursor-pointer group bg-gray-50 hover:border-primary hover:bg-primary/5 rounded-2xl">
                      <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="flex items-center justify-center w-20 h-20 mb-4 transition-all bg-white rounded-full shadow-md group-hover:shadow-lg">
                          <PlusCircle className="w-10 h-10 text-primary" />
                        </div>
                        <h4 className="mb-2 text-xl font-bold">Voir plus de plats</h4>
                        <p className="text-sm text-gray-500">
                          Découvrez tous nos restaurants et leurs menus
                        </p>
                        <Button variant="link" className="gap-2 mt-4 text-primary">
                          Explorer
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 mt-6 overflow-hidden bg-gray-200 rounded-full">
              <div 
                className="h-full transition-all duration-300 rounded-full bg-primary"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* SECTION EMPLOI - Scroll horizontal */}
        <div className="mb-20">
          <div className="flex flex-wrap items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold md:text-3xl">Offres d'emploi en restauration</h3>
                {/* <span className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
                  8 offres
                </span> */}
              </div>
              <p className="text-gray-600">
                Rejoignez les meilleurs restaurants près de chez vous
              </p>
            </div>
            
            {/* Navigation buttons */}
            <div className="hidden gap-2 md:flex">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollJobsPrev}
                className="transition-all border-2 rounded-full hover:bg-green-500 hover:text-white hover:border-green-500"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollJobsNext}
                className="transition-all border-2 rounded-full hover:bg-green-500 hover:text-white hover:border-green-500"
                aria-label="Suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Carrousel Emplois */}
          <div className="relative">
            <div className="py-4 overflow-hidden" ref={jobsEmblaRef}>
              <div className="flex gap-4">
                {jobOffers.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(33.333%-10.666px)]"
                  >
                    <Card className="h-full overflow-hidden transition-all duration-300 bg-white border-0 shadow-md group hover:shadow-xl hover:-translate-y-1 rounded-2xl">
                      <CardContent className="p-5">
                        {/* Header with badge */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-xl">
                              <Briefcase className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold">{job.title}</h4>
                              <p className="text-sm text-gray-600">{job.restaurant}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium text-white ${job.badgeColor} rounded-full`}>
                            {job.badge}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                          <MapPinned className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 text-xs font-medium bg-gray-100 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Job details grid */}
                        <div className="grid grid-cols-2 gap-3 p-3 mb-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-xs text-gray-500">Contrat</p>
                            <p className="text-sm font-medium">{job.contract}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Salaire</p>
                            <p className="text-sm font-medium">{job.salary}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Expérience</p>
                            <p className="text-sm font-medium">{job.experience}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Posté</p>
                            <p className="text-sm font-medium">{job.postedAt}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                          {job.description}
                        </p>

                        {/* Action Button */}
                        <Button 
                          className="w-full gap-2 text-white transition-all bg-secondary/80 rounded-xl hover:bg-secondary group-hover:shadow-lg"
                          size="sm"
                        >
                          Voir l'offre
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Carte "Voir plus" pour les emplois */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(33.333%-10.666px)]"
                >
                  <Link to="/emploi">
                    <Card className="h-full overflow-hidden transition-all duration-300 border-2 border-gray-300 border-dashed cursor-pointer group bg-gray-50 hover:border-green-500 hover:bg-green-50/30 rounded-2xl">
                      <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <div className="flex items-center justify-center w-20 h-20 mb-4 transition-all bg-white rounded-full shadow-md group-hover:shadow-lg">
                          <Briefcase className="w-10 h-10 text-green-500" />
                        </div>
                        <h4 className="mb-2 text-xl font-bold">Plus d'offres d'emploi</h4>
                        <p className="text-sm text-gray-500">
                          Découvrez toutes les opportunités dans la restauration
                        </p>
                        <Button variant="link" className="gap-2 mt-4 text-green-500">
                          Explorer les offres
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION OUTILS POUR RESTAURATEURS */}
        <div className="mb-20">
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-4 text-sm font-medium rounded-full bg-purple-100 text-purple-700">
              <Building className="w-4 h-4" />
              <span>Pour les professionnels</span>
            </div>
            <h3 className="mb-4 text-2xl font-bold md:text-3xl">
              Des outils professionnels pour les restaurateurs
            </h3>
            <p className="text-gray-600">
              Gérez votre établissement efficacement avec notre suite d'outils professionnels gratuits
            </p>
          </div>

          {/* Outils principaux en grille */}
          <div className="grid gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Outil 1 - Générateur de CV */}
            {professionalTools.map((tool, i) => (
              <motion.div
                key={tool.to}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: tool.delay }}
                whileHover={{ y: -5 }}
              >
                <Link to={tool.to}>
                  <Card
                    className="h-full p-6 transition-all bg-white border cursor-pointer border-primary group rounded-2xl hover:shadow-lg"
                  >
                    <div className="flex items-center justify-center w-16 h-16 mb-4 text-white bg-primary rounded-2xl">
                      {tool.icon}
                    </div>
                    <h4 className="mb-2 text-xl font-bold text-primary">{tool.title}</h4>
                    <p className="mb-4 text-gray-700">{tool.description}</p>
                    <div className="flex items-center font-medium text-primary">
                      {tool.button}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <span className="text-xs text-primary/70">{tool.bottom}</span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Section des fonctionnalités complémentaires */}
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Carte outil supplémentaire 1 */}
            {/* {cardTools.map((card, i) => (
              <Card
                key={card.to}
                className="p-5 transition-all bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-xl"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex items-center justify-center flex-shrink-0 w-12 h-12 ${card.iconColor} ${card.iconBg} rounded-xl`}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <h5 className="mb-1 font-bold">{card.title}</h5>
                    <p className="mb-2 text-sm text-gray-600">{card.description}</p>
                    <Link
                      to={card.to}
                      className={`flex items-center text-sm ${card.linkColor} hover:underline`}
                    >
                      Accéder <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))} */}
          </div>

          {/* Statistiques et témoignages */}
          <div className="grid gap-6 mb-8 md:grid-cols-3">
            <div className="p-6 text-center bg-white shadow-sm rounded-2xl">
              <div className="mb-2 text-3xl font-bold text-primary">15k+</div>
              <p className="text-gray-600">Documents générés par mois</p>
            </div>
            <div className="p-6 text-center bg-white shadow-sm rounded-2xl">
              <div className="mb-2 text-3xl font-bold text-primary">4.8/5</div>
              <p className="text-gray-600">Satisfaction utilisateurs</p>
            </div>
            <div className="p-6 text-center bg-white shadow-sm rounded-2xl">
              <div className="mb-2 text-3xl font-bold text-primary">100%</div>
              <p className="text-gray-600">Outils gratuits</p>
            </div>
          </div>

          {/* Bouton principal */}
          {/* <div className="flex justify-center mt-8">
            <Button asChild size="lg" className="gap-2 px-8 py-6 text-base transition-all rounded-full shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-primary/80">
              <Link to="/restaurateurs">
                Découvrir tous les outils pour restaurateurs
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div> */}
        </div>

        {/* CTA Final */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative p-12 overflow-hidden text-center bg-gradient-to-r from-primary via-primary/80 to-primary rounded-3xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 translate-x-32 -translate-y-32 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 -translate-x-24 translate-y-24 rounded-full bg-white/10" />
          
          <div className="relative z-10">
            <h3 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Prêt à passer commande ?
            </h3>
            <p className="max-w-2xl mx-auto mb-8 text-lg text-white/90">
              Rejoignez des milliers de clients satisfaits et découvrez une nouvelle façon de savourer vos plats préférés
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="gap-2 px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl"
              >
                <Link to="/register">
                  Commencer maintenant
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 px-8 py-6 text-base text-white border-white rounded-full hover:bg-white/10 hover:text-white hover:border-white/20"
              >
                <Link to="/download">
                  Télécharger l'application
                </Link>
              </Button>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};

export default ServicesSection;