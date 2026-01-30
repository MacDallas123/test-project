// ServicePage.jsx - Page "Menu Complet"
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  MapPin,
  Users,
  ChevronRight,
  Package,
  Filter,
  Search,
  ChefHat,
  DollarSign,
  Heart,
  Flame,
  Leaf,
  Wheat,
  Coffee,
} from "lucide-react";

// Dialogues pour l'ajout au panier
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Images de plats (à remplacer par vos assets réels)
import Plat1 from "@/assets/hero.avif";
import Plat2 from "@/assets/hero.avif";
import Plat3 from "@/assets/hero.avif";
import Plat4 from "@/assets/hero.avif";
import Plat5 from "@/assets/hero.avif";
import Plat6 from "@/assets/hero.avif";
import Plat7 from "@/assets/hero.avif";
import Plat8 from "@/assets/hero.avif";

const ServicePage = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  // Données des restaurants
  const restaurants = [
    {
      id: 1,
      name: "Le Dakarois",
      cuisine: "Africain",
      location: "Dakar, Plateau",
      rating: 4.8,
      reviews: 342,
      deliveryTime: "30-40 min",
      deliveryFee: 500,
      logoColor: "bg-orange-600",
      specialties: ["Poulet Yassa", "Thiébou Djeun", "Mafé"],
    },
    {
      id: 2,
      name: "Burger House",
      cuisine: "Fast-food",
      location: "Dakar, Almadies",
      rating: 4.7,
      reviews: 289,
      deliveryTime: "25-35 min",
      deliveryFee: 700,
      logoColor: "bg-red-600",
      specialties: ["Burgers", "Frites", "Milkshakes"],
    },
    {
      id: 3,
      name: "Pizzeria Roma",
      cuisine: "Italien",
      location: "Dakar, Point E",
      rating: 4.9,
      reviews: 421,
      deliveryTime: "35-45 min",
      deliveryFee: 600,
      logoColor: "bg-green-600",
      specialties: ["Pizzas", "Pâtes", "Salades"],
    },
    {
      id: 4,
      name: "Green Life",
      cuisine: "Healthy",
      location: "Dakar, Mermoz",
      rating: 4.6,
      reviews: 156,
      deliveryTime: "20-30 min",
      deliveryFee: 400,
      logoColor: "bg-emerald-600",
      specialties: ["Salades", "Bowls", "Smoothies"],
    },
    {
      id: 5,
      name: "Sushi Zen",
      cuisine: "Japonais",
      location: "Dakar, Ouakam",
      rating: 4.8,
      reviews: 198,
      deliveryTime: "40-50 min",
      deliveryFee: 800,
      logoColor: "bg-blue-600",
      specialties: ["Sushis", "Sashimis", "Tempura"],
    },
    {
      id: 6,
      name: "La Boulangerie",
      cuisine: "Français",
      location: "Dakar, Fann",
      rating: 4.5,
      reviews: 234,
      deliveryTime: "25-35 min",
      deliveryFee: 400,
      logoColor: "bg-yellow-600",
      specialties: ["Sandwichs", "Viennoiseries", "Pâtisseries"],
    },
    {
      id: 7,
      name: "Spice Garden",
      cuisine: "Indien",
      location: "Dakar, Sacré Coeur",
      rating: 4.7,
      reviews: 178,
      deliveryTime: "35-45 min",
      deliveryFee: 600,
      logoColor: "bg-purple-600",
      specialties: ["Curry", "Biryani", "Naan"],
    },
    {
      id: 8,
      name: "Café de Paris",
      cuisine: "Café",
      location: "Dakar, Plateau",
      rating: 4.4,
      reviews: 145,
      deliveryTime: "20-30 min",
      deliveryFee: 300,
      logoColor: "bg-brown-600",
      specialties: ["Café", "Petit-déjeuner", "Snacks"],
    },
  ];

  // Données des plats
  const meals = [
    {
      id: 1,
      title: "Poulet Yassa Complet",
      restaurantId: 1,
      restaurant: "Le Dakarois",
      category: "Africain",
      price: 4500,
      rating: 4.9,
      deliveryTime: "30-40 min",
      description:
        "Poulet mariné au citron avec oignons caramélisés, accompagné de riz blanc et légumes frais.",
      image: Plat1,
      tags: ["Épicé", "Traditionnel"],
      features: [
        "100% poulet local",
        "Accompagnement riz et légumes",
        "Sauce maison",
        "Portion généreuse",
      ],
      popular: true,
    },
    {
      id: 2,
      title: "Burger Gourmet Deluxe",
      restaurantId: 2,
      restaurant: "Burger House",
      category: "Fast-food",
      price: 5000,
      rating: 4.7,
      deliveryTime: "25-35 min",
      description:
        "Double steak haché, cheddar, bacon, oignons caramélisés et sauce spéciale maison.",
      image: Plat2,
      tags: ["Nouveau", "Gourmet"],
      features: [
        "Double viande",
        "Frites maison",
        "Sauce signature",
        "Pain brioché",
      ],
      popular: true,
    },
    {
      id: 3,
      title: "Pizza Margherita Classique",
      restaurantId: 3,
      restaurant: "Pizzeria Roma",
      category: "Italien",
      price: 4500,
      rating: 4.8,
      deliveryTime: "35-45 min",
      description:
        "Base tomate fraîche, mozzarella di bufala, basilic et huile d'olive extra vierge.",
      image: Plat3,
      tags: ["Végétarien", "Classique"],
      features: [
        "Mozzarella di bufala",
        "Tomates fraîches",
        "Basilic frais",
        "Pâte fine maison",
      ],
    },
    {
      id: 4,
      title: "Salade César Poulet Grillé",
      restaurantId: 4,
      restaurant: "Green Life",
      category: "Healthy",
      price: 3500,
      rating: 4.6,
      deliveryTime: "20-30 min",
      description:
        "Poulet grillé, parmesan, croûtons maison, laitue romaine et sauce césar légère.",
      image: Plat4,
      tags: ["Healthy", "Léger"],
      features: [
        "Poulet grillé",
        "Sauce légère",
        "Croûtons maison",
        "Légumes frais",
      ],
    },
    {
      id: 5,
      title: "Plateau Sushi Mix",
      restaurantId: 5,
      restaurant: "Sushi Zen",
      category: "Japonais",
      price: 8000,
      rating: 4.9,
      deliveryTime: "40-50 min",
      description:
        "Assortiment de sushis, sashimis et makis frais du jour avec sauces accompagnement.",
      image: Plat5,
      tags: ["Frais", "Premium"],
      features: [
        "Poisson frais du jour",
        "Riz vinaigré maison",
        "Wasabi et gingembre",
        "Sauce soja",
      ],
      popular: true,
    },
    {
      id: 6,
      title: "Club Sandwich Poulet",
      restaurantId: 6,
      restaurant: "La Boulangerie",
      category: "Français",
      price: 3000,
      rating: 4.5,
      deliveryTime: "25-35 min",
      description:
        "Pain de mie grillé, poulet rôti, bacon, laitue, tomate et sauce spéciale.",
      image: Plat6,
      tags: ["Classique", "Rapide"],
      features: [
        "Pain maison",
        "Poulet rôti",
        "Légumes frais",
        "Accompagnement frites",
      ],
    },
    {
      id: 7,
      title: "Poulet Tikka Masala",
      restaurantId: 7,
      restaurant: "Spice Garden",
      category: "Indien",
      price: 5000,
      rating: 4.7,
      deliveryTime: "35-45 min",
      description:
        "Poulet mariné dans une sauce crémeuse au curry avec riz basmati et naan.",
      image: Plat7,
      tags: ["Épicé", "Crémeux"],
      features: [
        "Épices authentiques",
        "Sauce crémeuse",
        "Riz basmati",
        "Naan maison",
      ],
    },
    {
      id: 8,
      title: "Petit-déjeuner Complet",
      restaurantId: 8,
      restaurant: "Café de Paris",
      category: "Café",
      price: 3500,
      rating: 4.4,
      deliveryTime: "20-30 min",
      description:
        "Œufs, bacon, saucisses, pain grillé, confiture et café frais.",
      image: Plat8,
      tags: ["Petit-déjeuner", "Complet"],
      features: [
        "Œufs frais",
        "Pain maison",
        "Café frais moulu",
        "Confiture artisanale",
      ],
    },
    // Ajoutez plus de plats ici...
  ];

  // États pour les dialogues
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Catégories uniques
  const categories = [
    "Tous",
    ...Array.from(new Set(meals.map((m) => m.category))),
  ];

  // Filtrage des plats
  const filteredMeals = meals.filter((meal) => {
    const matchesCategory =
      selectedCategory === "Tous" || meal.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      meal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Trouver les informations du restaurant
  const getRestaurantInfo = (restaurantId) => {
    return restaurants.find((r) => r.id === restaurantId) || restaurants[0];
  };

  const addToCart = (meal) => {
    const restaurant = getRestaurantInfo(meal.restaurantId);
    const cartItem = {
      ...meal,
      quantity: meal.id === selectedMeal?.id ? quantity : 1,
      specialInstructions:
        meal.id === selectedMeal?.id ? specialInstructions : "",
      restaurantId: restaurant.id,
      restaurant: restaurant.name,
      restaurantLogoColor: restaurant.logoColor,
      deliveryFee: restaurant.deliveryFee,
    };

    setCart([...cart, cartItem]);

    // Réinitialiser les états
    setQuantity(1);
    setSpecialInstructions("");
    setSelectedMeal(null);
  };

  const handleAddToCart = () => {
    if (selectedMeal) {
      addToCart(selectedMeal);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container px-4 py-12 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-white rounded-full shadow-sm text-primary">
              <ChefHat className="w-4 h-4" />
              Notre Menu Complet
            </div>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Découvrez toutes nos spécialités
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Plus de {meals.length} plats préparés avec soin par nos{" "}
              {restaurants.length} restaurants partenaires
            </p>

            {/* Barre de recherche */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un plat, un restaurant ou une cuisine..."
                  className="py-6 pl-12 pr-4 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filtres rapides */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category, index) => (
                <Badge
                  key={index}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  className="px-4 py-2 text-sm transition-all cursor-pointer hover:scale-105"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "Tous" ? "Toutes les catégories" : category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section principale */}
      <div className="container px-4 py-8 mx-auto">
        {/* Informations et filtres */}
        <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Plats disponibles</h2>
            <p className="text-muted-foreground">
              {filteredMeals.length}{" "}
              {filteredMeals.length === 1 ? "plat" : "plats"} •{" "}
              {restaurants.length} restaurants
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Badge variant="secondary" className="px-3 py-1">
              <Flame className="w-3 h-3 mr-1" />
              {meals.filter((m) => m.popular).length} plats populaires
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <ChefHat className="w-3 h-3 mr-1" />
              {restaurants.length} restaurants
            </Badge>
          </div>
        </div>

        {/* Grille des plats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMeals.map((meal, index) => {
            const restaurant = getRestaurantInfo(meal.restaurantId);

            return (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="overflow-hidden transition-all duration-300 border-gray-200 shadow-sm hover:shadow-lg">
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 to-transparent" />
                    <img
                      src={meal.image}
                      alt={meal.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Badge populaire */}
                    {meal.popular && (
                      <div className="absolute z-20 top-3 right-3">
                        <Badge className="text-white bg-red-500">
                          <Flame className="w-3 h-3 mr-1" />
                          Populaire
                        </Badge>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="absolute z-20 flex gap-2 top-3 left-3">
                      {meal.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-white/90 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Restaurant info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${restaurant.logoColor}`}
                          ></div>
                          <span className="text-sm font-medium text-white truncate">
                            {restaurant.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-medium text-white">
                            {meal.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold transition-colors line-clamp-1 group-hover:text-primary">
                        {meal.title}
                      </h3>
                      <span className="font-bold text-primary whitespace-nowrap">
                        {meal.price.toLocaleString()} XOF
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">
                        {restaurant.location}
                      </span>
                    </div>

                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                      {meal.description}
                    </p>

                    {/* Caractéristiques */}
                    <div className="mb-4 space-y-1">
                      {meal.features.slice(0, 2).map((feature, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-xs"
                        >
                          <CheckCircle className="flex-shrink-0 w-3 h-3 text-green-500" />
                          <span className="line-clamp-1">{feature}</span>
                        </div>
                      ))}
                      {meal.features.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{meal.features.length - 2} autres caractéristiques
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{meal.deliveryTime}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">
                          {meal.rating}
                        </span>
                      </div>
                    </div>

                    {/* Bouton d'ajout au panier */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full gap-2 mt-4"
                          variant="link"
                          onClick={() => setSelectedMeal(meal)}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Ajouter au Panier
                        </Button>
                      </DialogTrigger>

                      {/* Dialogue pour personnaliser la commande */}
                      {selectedMeal && selectedMeal.id === meal.id && (
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Ajouter {meal.title}</DialogTitle>
                            <DialogDescription>
                              Personnalisez votre commande avant de l'ajouter au
                              panier
                            </DialogDescription>
                          </DialogHeader>

                          <div className="py-4 space-y-4">
                            {/* Infos restaurant */}
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                              <div
                                className={`flex items-center justify-center w-10 h-10 rounded-lg ${restaurant.logoColor} text-white`}
                              >
                                <ChefHat className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-semibold">
                                  {restaurant.name}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  <span>{restaurant.location}</span>
                                  <Clock className="w-3 h-3" />
                                  <span>{restaurant.deliveryTime}</span>
                                </div>
                              </div>
                            </div>

                            {/* Quantité */}
                            <div className="space-y-2">
                              <Label htmlFor="quantity">Quantité</Label>
                              <div className="flex items-center gap-4">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() =>
                                    setQuantity(Math.max(1, quantity - 1))
                                  }
                                >
                                  -
                                </Button>
                                <Input
                                  id="quantity"
                                  type="number"
                                  min="1"
                                  value={quantity}
                                  onChange={(e) =>
                                    setQuantity(
                                      Math.max(
                                        1,
                                        parseInt(e.target.value) || 1,
                                      ),
                                    )
                                  }
                                  className="w-20 text-center"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setQuantity(quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </div>

                            {/* Instructions spéciales */}
                            <div className="space-y-2">
                              <Label htmlFor="instructions">
                                Instructions spéciales
                                <span className="ml-2 text-sm text-muted-foreground">
                                  (Optionnel)
                                </span>
                              </Label>
                              <Textarea
                                id="instructions"
                                placeholder="Ex: Sans oignons, sauce à part, bien cuit..."
                                value={specialInstructions}
                                onChange={(e) =>
                                  setSpecialInstructions(e.target.value)
                                }
                                className="min-h-[80px]"
                              />
                            </div>

                            {/* Récapitulatif */}
                            <div className="p-3 border rounded-lg bg-muted/30">
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Plat:</span>
                                  <span className="font-medium">
                                    {meal.title}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Prix unitaire:</span>
                                  <span>{meal.price.toLocaleString()} XOF</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Frais de livraison:</span>
                                  <span>
                                    {restaurant.deliveryFee.toLocaleString()}{" "}
                                    XOF
                                  </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-primary">
                                  <span>Total:</span>
                                  <span>
                                    {(
                                      meal.price * quantity +
                                      restaurant.deliveryFee
                                    ).toLocaleString()}{" "}
                                    XOF
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setQuantity(1);
                                setSpecialInstructions("");
                                setSelectedMeal(null);
                              }}
                            >
                              Annuler
                            </Button>
                            <Button onClick={handleAddToCart} className="gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              Ajouter au panier
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      )}
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Message si aucun résultat */}
        {filteredMeals.length === 0 && (
          <div className="py-16 text-center">
            <div className="max-w-md mx-auto">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold">Aucun plat trouvé</h3>
              <p className="mb-6 text-muted-foreground">
                Aucun plat ne correspond à vos critères de recherche. Essayez
                avec d'autres termes.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Tous");
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        )}

        {/* Panier flottant */}
        {cart.length > 0 && (
          <div className="fixed z-50 max-w-sm p-4 border rounded-lg shadow-lg bottom-6 right-6 bg-background animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Votre panier ({cart.length})</h3>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/cart">
                  Voir le panier
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="space-y-2 overflow-y-auto max-h-60">
              {cart.slice(-3).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between pb-2 text-sm border-b"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.title}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <div
                        className={`w-2 h-2 rounded-full ${item.restaurantLogoColor}`}
                      ></div>
                      <span className="truncate">{item.restaurant}</span>
                    </div>
                  </div>
                  <div className="ml-2 font-medium text-primary whitespace-nowrap">
                    {item.price.toLocaleString()} XOF
                  </div>
                </div>
              ))}
              {cart.length > 3 && (
                <div className="text-sm text-center text-muted-foreground">
                  +{cart.length - 3} autres plats
                </div>
              )}
            </div>
            <Button className="w-full mt-3" asChild>
              <Link to="/checkout">Commander maintenant</Link>
            </Button>
          </div>
        )}

        {/* Section restaurants partenaires */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="p-6 border rounded-lg bg-muted/30">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  Nos restaurants partenaires
                </h3>
                <p className="text-muted-foreground">
                  Découvrez tous nos restaurants et leurs spécialités
                </p>
              </div>
              <Button variant="outline" asChild className="mt-4 md:mt-0">
                <Link to="/restaurants">
                  <Users className="w-4 h-4 mr-2" />
                  Voir tous les restaurants
                </Link>
              </Button>
            </div>

            {/* Mini galerie restaurants */}
            <div className="grid grid-cols-2 gap-4 mt-6 sm:grid-cols-4">
              {restaurants.slice(0, 4).map((restaurant, index) => (
                <div
                  key={index}
                  className="p-3 text-center bg-white border rounded-lg"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg ${restaurant.logoColor} text-white`}
                  >
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <h4 className="font-medium truncate">{restaurant.name}</h4>
                  <p className="text-xs truncate text-muted-foreground">
                    {restaurant.cuisine}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium">
                      {restaurant.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
