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
import Prest from "@/assets/prest.jpg";
import UserProvider from "@/components/home/UserProvider.";
import RecruitsSection from "@/components/home/RecruitsSection";

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
      <section className="relative px-4 py-20 overflow-hidden md:py-28 bg-linear-to-br from-primary/10 to-muted/20">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <Badge className="px-4 py-2 mb-6 text-base font-semibold rounded-full bg-primary/10 text-primary animate-pulse">
                <Sparkles className="w-4 h-4 mr-2" />
                {t("hero.badge", "Innovation & Excellence")}
              </Badge>
              <h1 className="mb-6 font-bold tracking-tight">
                <span className="block text-4xl md:text-5xl lg:text-6xl">FIBEM ProMarket</span>
                <span className="block text-2xl text-transparent md:text-3xl lg:text-4xl bg-linear-to-r from-primary via-secondary to-primary bg-clip-text bg-size-200 animate-gradient">
                  Votre succès, notre expertise
                </span>
              </h1>
              <p className="mb-10 text-xl text-muted-foreground">
                Plateforme tout-en-un pour{" "}
                <span className="font-semibold text-primary">
                  entrepreneurs, artisans et professionnels
                </span>
                . Développement web, gestion, recrutement - simplifiez votre
                quotidien.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="gap-3 text-lg">
                  <Link to="/register">
                    <Rocket className="w-5 h-5" />
                    Démarrer gratuitement
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                {/* <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="gap-3 text-lg"
                >
                  <Link to="/contact">
                    <MessageSquare className="w-5 h-5" />
                    Découvrir nos solutions
                  </Link>
                </Button> */}
              </div>
              <div className="flex flex-wrap items-center gap-6 mt-12">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 border-2 rounded-full border-background bg-primary"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    500+ professionnels nous font confiance
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.9/5</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative flex items-center justify-center p-4 border rounded-3xl bg-linear-to-br from-primary/10 to-secondary/10 backdrop-blur-sm">
                <img
                  src={Prest}
                  alt="Digital Solution"
                  className="object-cover w-full max-w-md shadow-xl rounded-2xl"
                />
              </div>
            </motion.div>

            {/* <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative p-8 border rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm">
                <div className="absolute -top-6 -right-6">
                  <Badge className="px-4 py-2 text-white bg-gradient-to-r from-primary to-secondary">
                    <Zap className="w-4 h-4 mr-2" />
                    Nouveau
                  </Badge>
                </div>
                <div className="space-y-6">
                  <div className="p-6 shadow-xl rounded-2xl bg-background">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Code className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Développement Web</h3>
                        <p className="text-sm text-muted-foreground">
                          Sites sur mesure & applications
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-blue-100 rounded-full">
                      <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="p-6 shadow-xl rounded-2xl bg-background">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Recrutement Pro</h3>
                        <p className="text-sm text-muted-foreground">
                          Candidats qualifiés & matching intelligent
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-green-100 rounded-full">
                      <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="p-6 shadow-xl rounded-2xl bg-background">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <FileCode className="w-8 h-8 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">CV FIBEM</h3>
                        <p className="text-sm text-muted-foreground">
                          CV professionnel avec macro
                        </p>
                      </div>
                    </div>
                    <div className="h-2 bg-purple-100 rounded-full">
                      <div className="w-2/3 h-full bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div> */}
          </div>
        </div>
      </section>

      {/* Section À Propos / Qui sommes-nous ? */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="px-4 py-2 mb-4">
                <Building2 className="w-4 h-4 mr-2" />
                {t("about.title", "À Propos de Nous")}
              </Badge>
              <h2 className="mb-6 text-4xl font-bold" id="about">
                Votre partenaire de confiance pour la{" "}
                <span className="text-primary">transformation digitale</span>
              </h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Depuis 2019, FIBEM accompagne les professionnels dans leur
                transition numérique avec des solutions innovantes, simples et
                efficaces.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Target className="w-6 h-6 mt-1 text-primary" />
                  <div>
                    <h4 className="font-semibold">Notre Mission</h4>
                    <p className="text-muted-foreground">
                      Simplifier la vie des entrepreneurs avec des outils
                      digitaux accessibles
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Lightbulb className="w-6 h-6 mt-1 text-primary" />
                  <div>
                    <h4 className="font-semibold">Notre Vision</h4>
                    <p className="text-muted-foreground">
                      Devenir le partenaire numérique de référence en Europe et
                      en Afrique
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Award className="w-6 h-6 mt-1 text-primary" />
                  <div>
                    <h4 className="font-semibold">Nos Valeurs</h4>
                    <p className="text-muted-foreground">
                      Innovation, Qualité, Accessibilité et Accompagnement
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-64 overflow-hidden border-4 shadow-lg aspect-w-16 rounded-2xl border-primary/20">
                <span className="absolute text-lg text-gray-500 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  ESPACE VIDEO
                </span>
                <iframe
                  // src="https://www.youtube.com/embed/5qap5aO4i9A"
                  title="Présentation FIBEM ProMarket"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  
                ></iframe>
              </div>
              {/* <div className="grid grid-cols-2 gap-4">
                <div className="p-6 shadow-lg rounded-2xl bg-background">
                  <div className="text-4xl font-bold text-primary">5+</div>
                  <p className="mt-2 font-medium">Années d'expérience</p>
                </div>
                <div className="p-6 shadow-lg rounded-2xl bg-background">
                  <div className="text-4xl font-bold text-primary">0+</div>
                  <p className="mt-2 font-medium">CV Redigés</p>
                </div>
                <div className="p-6 shadow-lg rounded-2xl bg-background">
                  <div className="text-4xl font-bold text-primary">24/7</div>
                  <p className="mt-2 font-medium">Support client</p>
                </div>
                <div className="p-6 shadow-lg rounded-2xl bg-background">
                  <div className="text-4xl font-bold text-primary">98%</div>
                  <p className="mt-2 font-medium">Satisfaction client</p>
                </div>
              </div> */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Catalogue de Produits */}
      <UserProvider />

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
      <RecruitsSection />

      {/* Section CV FIBEM */}
      <section
        id="cv-fibem"
        className="px-4 py-20 bg-gradient-to-br from-purple-50 to-pink-50"
      >
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="px-4 py-2 mb-4 text-purple-600 bg-purple-100">
                <FileEdit className="w-4 h-4 mr-2" />
                CV FIBEM
              </Badge>
              <h2 className="mb-6 text-4xl font-bold">
                Créez un CV professionnel qui{" "}
                <span className="text-purple-600">marque les esprits</span>
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Notre générateur de CV intelligent vous aide à créer un
                curriculum vitae professionnel avec des modèles modernes et une
                macro de suivi intégrée.
              </p>
              <div className="mb-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Modèles professionnels</h4>
                    <p className="text-sm text-muted-foreground">
                      15+ templates adaptés à chaque secteur
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Macro de suivi</h4>
                    <p className="text-sm text-muted-foreground">
                      Suivez automatiquement vos candidatures
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                    <Download className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Export multiple</h4>
                    <p className="text-sm text-muted-foreground">
                      PDF, Word, HTML - prêt à l'emploi
                    </p>
                  </div>
                </div>
              </div>
              <Button
                asChild
                size="lg"
                // className="gap-3 bg-purple-600 hover:bg-purple-700"
                className="gap-3 text-purple-600 hover:text-purple-700"
                variant="link"
              >
                <Link to="/service/formulaire-cv">
                  <FileEdit className="w-5 h-5" />
                  Essayer le générateur
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="p-8 bg-white shadow-2xl rounded-2xl">
                <div className="absolute -top-4 -right-4">
                  <div className="p-3 bg-purple-600 rounded-full">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold">CV Exemple</h3>
                  <p className="text-muted-foreground">
                    Modèle "Executive" - Secteur Tech
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-purple-100 rounded-full"></div>
                  <div className="w-3/4 h-4 bg-purple-100 rounded-full"></div>
                  <div className="h-20 rounded-lg bg-purple-50"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 rounded-lg bg-purple-50"></div>
                    <div className="h-24 rounded-lg bg-purple-50"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Blog */}
      <section id="blog" className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="px-4 py-2 mb-4">
              <BookOpen className="w-4 h-4 mr-2" />
              Notre Blog
            </Badge>
            <h2 className="mb-4 text-4xl font-bold">
              Actualités & Conseils{" "}
              <span className="text-primary">pour votre business</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Découvrez nos derniers articles sur la transformation digitale, le
              recrutement et la gestion d'entreprise
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* <div className={`h-48 ${post.image}`} /> */}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="mt-4">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {post.date}
                  </span>
                  <Button asChild variant="ghost" size="sm" className="gap-2">
                    <Link to="/blog">
                      Lire l'article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="gap-3">
              <Link to="/blog">
                <BookOpen className="w-5 h-5" />
                Voir tous les articles
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
