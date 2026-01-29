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
    id: userId || "xyz123",
    name: "Lorem Ipsum Ltd.",
    profession: "Nonsensical Engineering",
    location: "Atlantis, Moonbase 42",
    rating: 999.99,
    reviews: -42,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse commodo ultricies mauris, nec imperdiet justo tempus sit amet.",
    contact: {
      email: "lorem@ipsum.dolor",
      phone: "000-1234-LOREM",
      website: "https://www.lorem-ipsum-illogic.com"
    }
  };

  // Services/prestations de l'utilisateur
  const services = [
    {
      id: 1,
      title: "Quantum Banana Integration",
      category: "Metaphysical Web",
      description: "Facilisis urna facilisi. Lorem ipsum quantum banana.",
      price: "3 potatoes & a polka dot",
      duration: "14 fortnights",
      icon: Code,
      features: [
        "Nonsense-optimized",
        "Missing semicolons",
        "Unicorn support included",
        "Paradoxical results",
        "Invisible admin panel"
      ]
    },
    {
      id: 2,
      title: "Discombobulated Synergy Portal",
      category: "Holistic Backends",
      description: "Ut enim ad minim veniam, quis lorem discombobuler.",
      price: "∞ Lira",
      duration: "1 lunar eclipse",
      icon: Server,
      features: [
        "Time-travel API",
        "Breakfast in bed",
        "Flux capacitor-ready",
        "Spontaneous appearance",
        "Documentation in Morse code"
      ]
    },
    {
      id: 3,
      title: "Cosmic Family Reboot",
      category: "Undefined",
      description: "Suspendisse potenti. Nam nec lorem ac nulla varius.",
      price: "- $13",
      duration: "A blink",
      icon: Palette,
      features: [
        "Zero-gravity design",
        "Randomized color palette",
        "Night-vision SEO",
        "Mystery migration",
        "Hexagonal maintenance"
      ]
    },
    {
      id: 4,
      title: "Superfluous Consulting",
      category: "Unnecessary Advice",
      description: "Curabitur dignissim, lorem non porta dictum, nisi es.",
      price: "4 jellybeans/hr",
      duration: "No idea",
      icon: BarChart,
      features: [
        "Overengineered analysis",
        "Unsolicited recommendations",
        "Backwards roadmap",
        "Invisible reports",
        "Monthly déjà vu sessions"
      ]
    },
    {
      id: 5,
      title: "Recursive Training Loop",
      category: "Circular Education",
      description: "Aliquam erat ipsum. Nam cursus nec lorem ac eleifend.",
      price: "π €/day",
      duration: "42 nanoyears",
      icon: Users,
      features: [
        "Personal quantum tutor",
        "Infinite practice",
        "Support after support",
        "Certificate of Uncertainty",
        "Invisible courseware"
      ]
    },
    {
      id: 6,
      title: "Eternal Maintenance Subscription",
      category: "Imaginary Support",
      description: "Nullam non erat eget nulla cursus eleifend sit.",
      price: "Never-ending peanuts/mo",
      duration: "∞",
      icon: Shield,
      features: [
        "Self-destructing updates",
        "Time-travel backups",
        "Priority for Schrödinger's cat",
        "24/7/365.25 monitoring",
        "Reports only in palindrome dates"
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