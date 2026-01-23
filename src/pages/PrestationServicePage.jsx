// PrestationServicePage.jsx
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  ExternalLink,
  ArrowRight,
  User,
  Briefcase,
  MapPin,
  MessageSquare,
  FileText,
  Server,
  Users,
  Code,
  Palette,
  BarChart,
  Shield,
  Wrench,
  Mail,
  Phone,
} from "lucide-react";

const PrestationServicePage = () => {
  const { userId } = useParams();
  const [cart, setCart] = useState([]);

  // Données de l'utilisateur (à remplacer par les données réelles)
  const user = {
    id: userId || "1",
    name: "TechSolutions Inc.",
    profession: "Développement Web",
    location: "Paris, France",
    rating: 4.9,
    reviews: 128,
    description: "Agence spécialisée dans le développement d'applications web sur mesure avec React et Node.js.",
    contact: {
      email: "contact@techsolutions.com",
      phone: "+33 1 23 45 67 89",
      website: "https://techsolutions.example.com"
    }
  };

  // Services/prestations de l'utilisateur
  const services = [
    {
      id: 1,
      title: "Site Vitrine Professionnel",
      category: "Développement Web",
      description: "Création d'un site vitrine responsive et moderne avec CMS intégré.",
      price: "À partir de 100 000 XAF",
      duration: "2-3 semaines",
      icon: Code,
      features: [
        "Design responsive",
        "CMS personnalisé",
        "Optimisation SEO",
        "Formation incluse",
        "Support 3 mois"
      ]
    },
    {
      id: 2,
      title: "Application Web sur Mesure",
      category: "Développement Web",
      description: "Développement d'une application web complète avec backend et base de données.",
      price: "À partir de 5 000 000 XAF",
      duration: "4-8 semaines",
      icon: Server,
      features: [
        "Architecture scalable",
        "API REST",
        "Base de données",
        "Tests automatisés",
        "Documentation technique"
      ]
    },
    {
      id: 3,
      title: "Refonte de Site",
      category: "Développement Web",
      description: "Modernisation et optimisation d'un site existant.",
      price: "À partir de 2 500 000 XAF",
      duration: "3-5 semaines",
      icon: Palette,
      features: [
        "Audit technique",
        "Nouveau design",
        "Optimisation performances",
        "Migration sécurisée",
        "Maintenance 6 mois"
      ]
    },
    {
      id: 4,
      title: "Consulting Technique",
      category: "Conseil",
      description: "Audit et conseil pour votre projet digital.",
      price: "250 000 XAF/jour",
      duration: "Sur mesure",
      icon: BarChart,
      features: [
        "Analyse technique",
        "Recommandations",
        "Roadmap projet",
        "Rapport détaillé",
        "Suivi mensuel"
      ]
    },
    {
      id: 5,
      title: "Formation Développement",
      category: "Formation",
      description: "Formation aux technologies modernes (React, Node.js, etc.).",
      price: "400 000 XAF/jour",
      duration: "1-5 jours",
      icon: Users,
      features: [
        "Programme personnalisé",
        "Exercices pratiques",
        "Support après formation",
        "Certification",
        "Matériel pédagogique"
      ]
    },
    {
      id: 6,
      title: "Maintenance Mensuelle",
      category: "Support",
      description: "Forfait de maintenance et support technique.",
      price: "300 000 XAF/mois",
      duration: "Forfait mensuel",
      icon: Shield,
      features: [
        "Mises à jour sécurité",
        "Sauvegardes",
        "Support prioritaire",
        "Monitoring 24/7",
        "Rapports mensuels"
      ]
    }
  ];

  const addToCart = (service) => {
    setCart([...cart, service]);
    // Ici, vous pourriez envoyer à un contexte global ou à une API
    console.log("Ajouté au panier:", service);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête de l'utilisateur - simple et discret */}
      <div className="px-4 py-6 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 text-xl font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-cyan-400">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-semibold">{user.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="w-3 h-3" />
                  <span>{user.profession}</span>
                  <span>•</span>
                  <MapPin className="w-3 h-3" />
                  <span>{user.location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mr-3">
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{user.rating}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  ({user.reviews} avis)
                </div>
              </div>
            </div>
          </div>
          
          <p className="max-w-2xl mx-auto mt-4 text-sm text-center text-muted-foreground">
            {user.description}
          </p>
        </div>
      </div>

      {/* Section principale des services */}
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-semibold">Produits et Prestations</h2>
          <p className="text-muted-foreground">
            Découvrez l'ensemble des services proposés par {user.name}
          </p>
        </div>

        {/* Grille des services */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.id} 
                className="transition-colors border rounded-lg hover:border-primary/50"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {service.category}
                    </Badge>
                  </div>
                  
                  <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  
                  <div className="mb-4 space-y-3">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 text-sm border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="font-semibold text-primary">
                        {service.price}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button 
                    variant="link" 
                    className="gap-2 text-left"
                    onClick={() => addToCart(service)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ajouter au panier
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Section panier flottant (optionnel) */}
        {cart.length > 0 && (
          <div className="fixed max-w-sm p-4 border rounded-lg shadow-sm bottom-6 right-6 bg-background">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Panier ({cart.length})</h3>
              <Button variant="outline" size="sm" asChild>
                <Link to="/cart">
                  Voir le panier
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-60">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between pb-2 text-sm border-b">
                  <span className="truncate max-w-[200px]">{item.title}</span>
                  <span className="font-medium">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section contact */}
        <div className="pt-8 mt-12 border-t">
          <div className="max-w-2xl mx-auto">
            <h3 className="mb-6 text-xl font-semibold text-center">Contacter {user.name}</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <a 
                        href={`mailto:${user.contact.email}`}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {user.contact.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-semibold">Téléphone</h4>
                      <a 
                        href={`tel:${user.contact.phone}`}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {user.contact.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 text-center">
              <Button asChild className="gap-2">
                <Link to={`/contact/${user.id}`}>
                  <MessageSquare className="w-4 h-4" />
                  Envoyer un message direct
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrestationServicePage;