// CartPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Briefcase,
  ChevronRight,
  Home,
  Package,
  Truck,
  Shield,
  Gift,
  Percent,
} from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      serviceId: 1,
      title: "Site Vitrine Professionnel",
      provider: "TechSolutions Inc.",
      providerId: "1",
      price: 100000,
      quantity: 1,
      duration: "2-3 semaines",
      category: "Développement Web",
      description: "Création d'un site vitrine responsive et moderne avec CMS intégré.",
      features: ["Design responsive", "CMS personnalisé", "Optimisation SEO"]
    },
    {
      id: 2,
      serviceId: 4,
      title: "Consulting Technique",
      provider: "TechSolutions Inc.",
      providerId: "1",
      price: 250000,
      quantity: 3,
      duration: "Sur mesure",
      category: "Conseil",
      description: "Audit et conseil pour votre projet digital.",
      features: ["Analyse technique", "Recommandations", "Roadmap projet"]
    },
    {
      id: 3,
      serviceId: 6,
      title: "Maintenance Mensuelle",
      provider: "DesignCreatives Studio",
      providerId: "2",
      price: 300000,
      quantity: 1,
      duration: "Forfait mensuel",
      category: "Support",
      description: "Forfait de maintenance et support technique.",
      features: ["Mises à jour sécurité", "Sauvegardes", "Support prioritaire"]
    }
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Calcul des totaux
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 0;
  const discount = promoApplied ? subtotal * 0.1 : 0; // 10% de réduction
  const total = subtotal - discount;

  // Gestion du panier
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const checkout = () => {
    // Ici, vous pouvez implémenter la logique de paiement
    console.log("Procéder au paiement", cartItems);
    // Redirection vers la page de paiement
    navigate("/checkout");
  };

  // Regrouper les items par prestataire
  const groupedByProvider = cartItems.reduce((groups, item) => {
    if (!groups[item.providerId]) {
      groups[item.providerId] = {
        provider: item.provider,
        providerId: item.providerId,
        items: []
      };
    }
    groups[item.providerId].items.push(item);
    return groups;
  }, {});

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-muted">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="mb-4 text-2xl font-semibold">Votre panier est vide</h1>
            <p className="mb-8 text-muted-foreground">
              Ajoutez des services et prestations à votre panier pour continuer.
            </p>
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Explorer les prestataires
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/prestations">
                  <Package className="w-4 h-4 mr-2" />
                  Voir toutes les prestations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild className="pl-0">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Panier</h1>
            <Badge variant="outline" className="ml-auto">
              {cartItems.length} {cartItems.length > 1 ? "services" : "service"}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Vérifiez vos services avant de procéder au paiement
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Colonne gauche : Articles du panier */}
          <div className="lg:col-span-2">
            {/* Bouton vider le panier */}
            <div className="flex justify-end mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vider le panier
              </Button>
            </div>

            {/* Articles groupés par prestataire */}
            <div className="space-y-6">
              {Object.values(groupedByProvider).map((group, index) => (
                <Card key={index} className="border">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-cyan-400">
                          {group.provider.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{group.provider}</h3>
                          <Link 
                            to={`/prestataire/${group.providerId}`}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            Voir le profil
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {group.items.length} {group.items.length > 1 ? "services" : "service"}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {group.items.map((item) => (
                        <div key={item.id} className="pt-4 border-t first:border-t-0 first:pt-0">
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold">{item.title}</h4>
                                <div className="font-semibold">
                                  {item.price.toFixed(2)} XAF
                                  {item.quantity > 1 && ` × ${item.quantity}`}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{item.duration}</span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {item.category}
                                </Badge>
                              </div>
                              
                              <p className="mb-3 text-sm text-muted-foreground">
                                {item.description}
                              </p>
                              
                              {/* <div className="mb-4 space-y-1">
                                {item.features.map((feature, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div> */}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <div className="w-12 font-medium text-center">
                                {item.quantity}
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="font-semibold">
                                {(item.price * item.quantity).toFixed(2)} XAF
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Colonne droite : Résumé et paiement */}
          <div className="lg:col-span-1">
            <div className="sticky space-y-6 top-8">
              {/* Résumé de la commande */}
              <Card className="border">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Résumé de la commande</h3>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{subtotal.toFixed(2)} XAF</span>
                    </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frais de livraison</span>
                    <span>{shippingFee.toFixed(2)} XAF</span>
                  </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{total.toFixed(2)} XAF</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Toutes taxes comprises
                  </div>
                </CardContent>
                
                <CardFooter className="flex-col space-y-4">
                  <Button 
                    className="w-full gap-2" 
                    size="lg"
                    onClick={checkout}
                  >
                    <CreditCard className="w-5 h-5" />
                    Procéder au paiement
                  </Button>
                  
                  <div className="text-xs text-center text-muted-foreground">
                    Paiement sécurisé par Stripe
                  </div>
                </CardFooter>
              </Card>

              {/* Garanties et avantages */}
              <Card className="border">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold">Paiement sécurisé</h4>
                        <p className="text-xs text-muted-foreground">
                          Vos informations de paiement sont cryptées
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold">Délais garantis</h4>
                        <p className="text-xs text-muted-foreground">
                          Chaque service a un délai d'exécution défini
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Gift className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold">Support inclus</h4>
                        <p className="text-xs text-muted-foreground">
                          Accompagnement pendant la réalisation
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assistance */}
              <Card className="border">
                <CardContent className="pt-6">
                  <h4 className="mb-4 text-sm font-semibold">Besoin d'aide ?</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="justify-start w-full" asChild>
                      <Link to="/contact">
                        <Mail className="w-4 h-4 mr-2" />
                        Contactez notre équipe
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="justify-start w-full" asChild>
                      <Link to="/faq">
                        <FileText className="w-4 h-4 mr-2" />
                        FAQ & Aide
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Prochaines étapes */}
        <div className="pt-8 mt-12 border-t">
          <h3 className="mb-6 text-lg font-semibold text-center">Prochaines étapes</h3>
          <div className="grid max-w-4xl gap-4 mx-auto md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10">
                <div className="flex items-center justify-center w-6 h-6 text-sm font-semibold text-white rounded-full bg-primary">
                  1
                </div>
              </div>
              <h4 className="mb-2 font-semibold">Validation du panier</h4>
              <p className="text-sm text-muted-foreground">
                Vérifiez vos services et quantités
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-muted">
                <div className="flex items-center justify-center w-6 h-6 text-sm font-semibold rounded-full bg-muted-foreground/20">
                  2
                </div>
              </div>
              <h4 className="mb-2 font-semibold">Paiement sécurisé</h4>
              <p className="text-sm text-muted-foreground">
                Renseignez vos coordonnées de paiement
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-muted">
                <div className="flex items-center justify-center w-6 h-6 text-sm font-semibold rounded-full bg-muted-foreground/20">
                  3
                </div>
              </div>
              <h4 className="mb-2 font-semibold">Confirmation</h4>
              <p className="text-sm text-muted-foreground">
                Recevez vos accès et coordonnées
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;