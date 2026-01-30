import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Building,
  Download,
  Eye,
  FileText,
  Heart,
  Mail,
  MapPin,
  Package,
  Play,
  Search,
  Shield,
  Star,
  TrendingUp,
  Users,
  Video,
  ShoppingBag,
  Wrench,
  Code,
  Paintbrush,
  Truck,
  Globe,
  MessageSquare,
  FileCode,
  Calculator,
  ClipboardCheck,
  CheckCircle,
  ArrowRight,
  Target,
  Clock,
  Award,
  Lightbulb,
  Zap,
  Rocket,
  Sparkles,
  BarChart,
  Building2,
  UserCheck,
  FileEdit,
  BookOpen,
  PenTool,
  Cpu,
  Server,
  Smartphone,
  Palette,
  Layers,
  FileSearch,
  Brush,
  ShoppingCart,
  Contact,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import UserProvider from "@/components/home/UserProvider.";
import RecruitsSection from "@/components/home/RecruitsSection"
import HomeHero from "@/components/home/HomeHero";
import CharacteristicsSection from "@/components/home/CharacteristicsSection";
import ServicesSection from "@/components/home/ServiceSection";
const Home = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("services");
  const [searchQuery, setSearchQuery] = useState("");

  // Prestations
  const prestations = [
    {
      id: 1,
      title: "Audit Digital",
      category: "Conseil",
      description: "Analyse complète de votre présence digitale",
      duration: "2-3 jours",
      icon: FileSearch,
      highlights: ["Analyse SEO", "Audit technique", "Recommandations"],
    },
    {
      id: 2,
      title: "Formation CRM",
      category: "Formation",
      description: "Formation sur mesure à l'utilisation de votre CRM",
      duration: "1 semaine",
      icon: Users,
      highlights: ["Personnalisée", "Support continu", "Matériel inclus"],
    },
    {
      id: 3,
      title: "Maintenance Site",
      category: "Support",
      description: "Maintenance technique et mise à jour régulière",
      duration: "Forfait mensuel",
      icon: Server,
      highlights: ["Mises à jour", "Sauvegarde", "Support 24/7"],
    },
  ];

  // Articles de blog
  const blogPosts = [
    {
      id: 1,
      title: "Comment digitaliser son entreprise artisanale ?",
      excerpt: "Guide complet pour les artisans qui veulent passer au digital",
      category: "Transformation Digitale",
      date: "15 Mars 2024",
      readTime: "5 min",
      image: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      id: 2,
      title: "Recrutement 2.0 : les nouvelles tendances",
      excerpt: "Comment attirer les meilleurs talents en 2024",
      category: "RH & Recrutement",
      date: "10 Mars 2024",
      readTime: "7 min",
      image: "bg-gradient-to-br from-green-400 to-green-600",
    },
    {
      id: 3,
      title: "SEO pour les PME : guide pratique",
      excerpt:
        "Les bases du référencement naturel pour les petites entreprises",
      category: "Marketing Digital",
      date: "5 Mars 2024",
      readTime: "8 min",
      image: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Hero Section */}
      <HomeHero /> 

      {/* Caracteristiques */}
      <CharacteristicsSection />
      
      {/* Section À Propos / Qui sommes-nous ? */}
      <section className="px-4 py-20 bg-muted/30">
          <div className="flex flex-col items-center justify-center mb-12">
            <h2 className="mb-4 text-3xl font-bold text-center md:text-4xl drop-shadow">
              {t("aboutSection.heading", "LivrerNourriture, bien plus qu'un service digital")}
            </h2>
            <p className="max-w-2xl text-lg text-center text-muted-foreground">
              {t("aboutSection.subheading", "Bénéficiez d'une expertise locale et d'un accompagnement humain, pour transformer durablement votre activité.")}
            </p>
          </div>
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="px-4 py-2 mb-4" id="#about">
                <Building2 className="w-4 h-4 mr-2" />
                {t("about.title", "À Propos de LivrerNourriture")}
              </Badge>
              <h2 className="mb-6 text-4xl font-bold" id="about">
                Votre service de livraison de repas{" "}
                <span className="text-primary">rapide et fiable</span>
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Depuis plusieurs années, LivrerNourriture simplifie vos repas du quotidien en vous livrant vos plats préférés, où que vous soyez, avec rapidité et gourmandise.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Target className="w-6 h-6 mt-1 text-primary" />
                  <div>
                    <h4 className="font-semibold">Notre Mission</h4>
                    <p className="text-muted-foreground">
                      Offrir à chacun la possibilité de savourer facilement de délicieux repas, livrés directement à domicile ou au bureau, avec un service irréprochable.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Lightbulb className="w-6 h-6 mt-1 text-primary" />
                  <div>
                    <h4 className="font-semibold">Notre Vision</h4>
                    <p className="text-muted-foreground">
                      Devenir la solution de référence pour la commande et la livraison de repas, en connectant gourmets et restaurateurs en toute simplicité.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Award className="w-6 h-6 mt-1 text-primary" />
                  <div>
                    <h4 className="font-semibold">Nos Valeurs</h4>
                    <p className="text-muted-foreground">
                      Qualité, rapidité, convivialité, et un engagement local pour soutenir vos restaurants préférés.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col items-center justify-center py-12">
              <span className="mb-4 text-3xl font-extrabold text-primary">LivrerNourriture</span>
              <p className="max-w-xs mb-4 text-lg text-center text-muted-foreground">
                Commandez votre plat préféré. Livré à la maison, simplement.
              </p>
              <a
                href="#plats"
                className="px-6 py-2 text-base font-semibold text-white transition rounded-full bg-primary hover:bg-primary/90"
              >
                Commander maintenant
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Catalogue de Produits */}
      {/* <UserProvider /> */}

      {/* Section Prestations */}
      {/* <section id="prestations" className="px-4 py-20 bg-muted/30">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="px-4 py-2 mb-4">
              <Layers className="w-4 h-4 mr-2" />
              Nos Prestations
            </Badge>
            <h2 className="mb-4 text-4xl font-bold">
              Des services sur mesure pour votre{" "}
              <span className="text-primary">croissance</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Bénéficiez d'un accompagnement personnalisé par nos experts
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {prestations.map((prestation) => {
              const Icon = prestation.icon;
              return (
                <Card
                  key={prestation.id}
                  className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <Badge variant="secondary">{prestation.category}</Badge>
                        <CardTitle className="mt-2">
                          {prestation.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 text-muted-foreground">
                      {prestation.description}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Durée : {prestation.duration}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {prestation.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full gap-3">
                      <Link to="/service/prestation">
                        Essayer cette prestation
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* Section Recrutement */}
      {/* <RecruitsSection /> */}

      {/* Section CV FIBEM */}
      <ServicesSection />
      
    </div>
  );
};

export default Home;
