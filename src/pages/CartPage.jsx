// CartPage.jsx - Version Livraison de Repas
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Shield,
  Truck,
  Gift,
  MapPin,
  Clock,
  CheckCircle,
  Package,
  Home,
  ChefHat,
  Receipt,
  Phone,
  MessageSquare,
  Sparkles,
  Leaf,
  Flame,
  DollarSign,
  User,
  Star,
} from "lucide-react";

// Images de plats (à remplacer par vos assets réels)
import Plat1 from "@/assets/hero.avif";
import Plat2 from "@/assets/hero.avif";
import Plat3 from "@/assets/hero.avif";

const CartPage = () => {
  const navigate = useNavigate();

  // État du panier avec données de repas
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      mealId: 1,
      title: "Poulet Yassa Complet",
      restaurant: "Le Dakarois",
      restaurantId: "1",
      price: 4500,
      quantity: 2,
      deliveryTime: "30-40 min",
      category: "Africain",
      description:
        "Poulet mariné au citron avec oignons caramélisés, accompagné de riz blanc et légumes frais.",
      image: Plat1,
      tags: ["Épicé", "Traditionnel"],
      specialInstructions: "Sans piment",
    },
    {
      id: 2,
      mealId: 2,
      title: "Burger Gourmet Deluxe",
      restaurant: "Burger House",
      restaurantId: "2",
      price: 5000,
      quantity: 1,
      deliveryTime: "25-35 min",
      category: "Fast-food",
      description:
        "Double steak haché, cheddar, bacon, oignons caramélisés et sauce spéciale maison.",
      image: Plat2,
      tags: ["Gourmet", "Nouveau"],
      specialInstructions: "Sans oignons",
    },
    {
      id: 3,
      mealId: 5,
      title: "Plateau Sushi Mix",
      restaurant: "Sushi Zen",
      restaurantId: "5",
      price: 8000,
      quantity: 1,
      deliveryTime: "40-50 min",
      category: "Japonais",
      description:
        "Assortiment de sushis, sashimis et makis frais du jour avec sauces accompagnement.",
      image: Plat3,
      tags: ["Frais", "Premium"],
      specialInstructions: "",
    },
  ]);

  // Données des restaurants
  const restaurants = [
    {
      id: "1",
      name: "Le Dakarois",
      deliveryFee: 500,
      minimumOrder: 3000,
      rating: 4.8,
      logoColor: "bg-orange-600",
    },
    {
      id: "2",
      name: "Burger House",
      deliveryFee: 700,
      minimumOrder: 2000,
      rating: 4.7,
      logoColor: "bg-red-600",
    },
    {
      id: "5",
      name: "Sushi Zen",
      deliveryFee: 800,
      minimumOrder: 5000,
      rating: 4.9,
      logoColor: "bg-blue-600",
    },
  ];

  // Regrouper les items par restaurant
  const groupedByRestaurant = cartItems.reduce((groups, item) => {
    if (!groups[item.restaurantId]) {
      const restaurant = restaurants.find((r) => r.id === item.restaurantId);
      groups[item.restaurantId] = {
        restaurant: item.restaurant,
        restaurantId: item.restaurantId,
        deliveryFee: restaurant?.deliveryFee || 0,
        minimumOrder: restaurant?.minimumOrder || 0,
        logoColor: restaurant?.logoColor || "bg-gray-600",
        items: [],
      };
    }
    groups[item.restaurantId].items.push(item);
    return groups;
  }, {});

  // Gestion du panier
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const checkout = () => {
    navigate("/checkout");
  };

  const getRestaurantInfo = (restaurantId) => {
    return restaurants.find((r) => r.id === restaurantId);
  };

  // Calcul du sous-total pour un restaurant spécifique
  const getRestaurantSubtotal = (restaurantId) => {
    return cartItems
      .filter((item) => item.restaurantId === restaurantId)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Calcul du total général
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Calcul des frais de livraison (maximum des frais de livraison des restaurants)
  const deliveryFee = Object.values(groupedByRestaurant).reduce(
    (max, group) => {
      return Math.max(max, group.deliveryFee);
    },
    0,
  );

  const total = subtotal + deliveryFee;

  // Vérifier si le minimum de commande est atteint pour chaque restaurant
  const checkMinimumOrder = (restaurantId) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    const restaurantSubtotal = getRestaurantSubtotal(restaurantId);
    return restaurantSubtotal >= (restaurant?.minimumOrder || 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/20">
              <ShoppingCart className="w-12 h-12 text-primary" />
            </div>
            <h1 className="mb-4 text-2xl font-bold">Votre panier est vide</h1>
            <p className="mb-8 text-gray-600">
              Ajoutez des plats délicieux à votre panier pour commencer votre
              commande
            </p>
            <div className="space-y-4">
              <Button asChild className="w-full gap-2">
                <Link to="/menu">
                  <ChefHat className="w-4 h-4" />
                  Explorer le menu
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full gap-2">
                <Link to="/restaurants">
                  <MapPin className="w-4 h-4" />
                  Voir les restaurants
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      {/* Hero Section */}
      {/* <section className="bg-linear-to-r from-primary/10 via-white to-primary/10"> */}
      <section className="bg-primary/10">
        <div className="container px-4 py-12 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Votre Panier
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              Révisez votre commande avant de passer à la caisse
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-primary/10 text-primary">
              <Clock className="w-4 h-4" />
              Livraison estimée : 30-45 minutes
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 py-8 mx-auto lg:px-8">
        {/* En-tête */}
        <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold md:text-3xl">Votre commande</h2>
            <p className="text-gray-600">
              Groupé par restaurant pour une meilleure organisation
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              <ShoppingCart className="w-3 h-3 mr-1" />
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} article
              {cartItems.length > 1 ? "s" : ""}
            </Badge>
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
        </div>

        {/* Commandes par restaurant */}
        <div className="space-y-8">
          {Object.values(groupedByRestaurant).map((group, index) => {
            const restaurantSubtotal = getRestaurantSubtotal(
              group.restaurantId,
            );
            const restaurantInfo = getRestaurantInfo(group.restaurantId);
            const meetsMinimumOrder = checkMinimumOrder(group.restaurantId);

            return (
              <motion.div
                key={group.restaurantId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
              >
                {/* Header du restaurant */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        navigate(`/restaurant/${group.restaurantId}`)
                      }
                      className="flex items-center gap-3 transition-opacity group hover:opacity-80"
                    >
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl ${group.logoColor} text-white shadow-md`}
                      >
                        <ChefHat className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold transition-colors group-hover:text-primary">
                          {group.restaurant}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span>{restaurantInfo?.rating || 4.5}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {group.items[0]?.deliveryTime || "30-40 min"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Statut de commande minimum */}
                    <div className="text-right">
                      {!meetsMinimumOrder && (
                        <Badge variant="destructive" className="mb-2">
                          Minimum{" "}
                          {restaurantInfo?.minimumOrder?.toLocaleString()} XOF
                        </Badge>
                      )}
                      <p className="text-sm text-gray-600">Sous-total</p>
                      <p className="text-xl font-bold text-primary">
                        {restaurantSubtotal.toLocaleString()} XOF
                      </p>
                    </div>
                  </div>

                  {/* Frais de livraison du restaurant */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t">
                    <div className="text-sm text-gray-600">
                      <Truck className="inline w-4 h-4 mr-2" />
                      Frais de livraison :{" "}
                      <span className="font-medium">
                        {group.deliveryFee.toLocaleString()} XOF
                      </span>
                    </div>
                    {!meetsMinimumOrder && (
                      <p className="text-sm text-red-500">
                        Ajoutez{" "}
                        {(
                          (restaurantInfo?.minimumOrder || 0) -
                          restaurantSubtotal
                        ).toLocaleString()}{" "}
                        XOF pour commander
                      </p>
                    )}
                  </div>
                </div>

                {/* Liste des plats */}
                <div className="divide-y">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex gap-4">
                        {/* Image du plat */}
                        <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        {/* Détails du plat */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                {item.tags.map((tag, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">
                                {(item.price * item.quantity).toLocaleString()}{" "}
                                XOF
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.price.toLocaleString()} XOF l'unité
                              </p>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>

                          {/* Instructions spéciales */}
                          {item.specialInstructions && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-700">
                                Instructions :
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.specialInstructions}
                              </p>
                            </div>
                          )}

                          {/* Contrôle quantité */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 font-medium text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Retirer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total par restaurant */}
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Total {group.restaurant}
                      </p>
                      <p className="text-lg font-bold">
                        {(
                          restaurantSubtotal + group.deliveryFee
                        ).toLocaleString()}{" "}
                        XOF
                      </p>
                    </div>

                    {meetsMinimumOrder ? (
                      <Badge className="px-3 py-1 bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Prêt à commander
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="px-3 py-1 text-red-500 border-red-300"
                      >
                        Minimum non atteint
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Récapitulatif global */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Panier résumé */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="p-6 border-b">
                  <h3 className="text-xl font-bold">
                    Récapitulatif de la commande
                  </h3>
                  <p className="text-gray-600">Détails de votre panier</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {/* Détails des restaurants */}
                    {Object.values(groupedByRestaurant).map((group) => {
                      const restaurantSubtotal = getRestaurantSubtotal(
                        group.restaurantId,
                      );
                      const restaurantInfo = getRestaurantInfo(
                        group.restaurantId,
                      );

                      return (
                        <div
                          key={group.restaurantId}
                          className="p-4 transition-colors rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full ${group.logoColor}`}
                              ></div>
                              <span className="font-medium">
                                {group.restaurant}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {group.items.length} plat
                                {group.items.length > 1 ? "s" : ""}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                Plats : {restaurantSubtotal.toLocaleString()}{" "}
                                XOF
                              </p>
                              <p className="text-sm text-gray-600">
                                Livraison : {group.deliveryFee.toLocaleString()}{" "}
                                XOF
                              </p>
                              <p className="font-semibold">
                                {(
                                  restaurantSubtotal + group.deliveryFee
                                ).toLocaleString()}{" "}
                                XOF
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <Separator />

                    {/* Totaux */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Sous-total des plats</span>
                        <span className="font-medium">
                          {subtotal.toLocaleString()} XOF
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frais de livraison</span>
                        <span>{deliveryFee.toLocaleString()} XOF</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total à payer</span>
                        <span className="text-primary">
                          {total.toLocaleString()} XOF
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions et informations */}
            <div className="space-y-6">
              {/* CTA Paiement */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h4 className="mb-4 text-lg font-bold">Passer commande</h4>

                {/* Vérification des minimums de commande */}
                {Object.keys(groupedByRestaurant).some(
                  (restaurantId) => !checkMinimumOrder(restaurantId),
                ) ? (
                  <div className="p-3 mb-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm font-medium text-red-600">
                      Certains restaurants n'ont pas atteint le minimum de
                      commande
                    </p>
                  </div>
                ) : (
                  <div className="p-3 mb-4 border border-green-200 rounded-lg bg-green-50">
                    <p className="text-sm font-medium text-green-600">
                      ✅ Toutes les conditions sont remplies
                    </p>
                  </div>
                )}

                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={checkout}
                  disabled={Object.keys(groupedByRestaurant).some(
                    (restaurantId) => !checkMinimumOrder(restaurantId),
                  )}
                >
                  <CreditCard className="w-5 h-5" />
                  Procéder au paiement
                </Button>

                <p className="mt-3 text-xs text-center text-gray-500">
                  Paiement sécurisé • Livraison rapide
                </p>
              </div>

              {/* Avantages */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h4 className="mb-4 text-lg font-bold">
                  Avantages de LivrerNourriture
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold">
                        Livraison rapide
                      </h5>
                      <p className="text-xs text-gray-600">
                        30-45 minutes en moyenne
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold">
                        Paiement sécurisé
                      </h5>
                      <p className="text-xs text-gray-600">
                        Cryptage SSL 256-bit
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold">Plats frais</h5>
                      <p className="text-xs text-gray-600">
                        Préparés à la commande
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h4 className="mb-4 text-lg font-bold">Besoin d'aide ?</h4>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="justify-start w-full gap-2"
                    asChild
                  >
                    <Link to="/contact">
                      <MessageSquare className="w-4 h-4" />
                      Support client
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start w-full gap-2"
                    asChild
                  >
                    <Link to="/restaurants">
                      <MapPin className="w-4 h-4" />
                      Plus de restaurants
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="justify-start w-full gap-2"
                    asChild
                  >
                    <Link to="/menu">
                      <ChefHat className="w-4 h-4" />
                      Continuer mes achats
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Promotion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-primary/5 via-white to-primary/5">
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <div className="text-center md:text-left">
                <h4 className="text-lg font-bold">🚚 Livraison gratuite !</h4>
                <p className="text-gray-600">
                  Commandez pour plus de 10 000 XOF et bénéficiez de la
                  livraison gratuite
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/promotions">Voir les promotions</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;
