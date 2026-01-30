import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Users, 
  FileText, 
  Building, 
  ArrowRight,
  CheckCircle,
  Zap,
  FileSpreadsheet,
  Receipt,
  Package,
  BarChart3,
  Clock,
  Star,
  MapPin,
  ChefHat,
  Truck,
  Shield,
  Heart
} from "lucide-react";
import { Card, CardContent } from "../ui/card";

import Plat1 from "@/assets/hero.avif";
import Plat2 from "@/assets/hero.avif";
import Plat3 from "@/assets/hero.avif";
import Plat4 from "@/assets/hero.avif";

const ServicesSection = () => {
    // Données des plats populaires
    const popularMeals = [
        {
            id: 1,
            title: "Poulet Yassa",
            restaurant: "Le Dakarois",
            category: "Africain",
            price: 3500,
            rating: 4.8,
            deliveryTime: "30-40 min",
            description: "Poulet mariné au citron avec oignons caramélisés, accompagné de riz blanc",
            image: Plat1,
            tags: ["Populaire", "Épicé"]
        },
        {
            id: 2,
            title: "Burger Gourmet",
            restaurant: "Burger House",
            category: "Fast-food",
            price: 4500,
            rating: 4.7,
            deliveryTime: "25-35 min",
            description: "Steak haché 180g, cheddar fondu, bacon croustillant et sauce maison",
            image: Plat2,
            tags: ["Nouveau"]
        },
        {
            id: 3,
            title: "Pizza Margherita",
            restaurant: "Pizzeria Roma",
            category: "Italien",
            price: 4000,
            rating: 4.9,
            deliveryTime: "35-45 min",
            description: "Base tomate, mozzarella fraîche, basilic et huile d'olive",
            image: Plat3,
            tags: ["Végétarien"]
        },
        {
            id: 4,
            title: "Salade César",
            restaurant: "Green Life",
            category: "Healthy",
            price: 2800,
            rating: 4.6,
            deliveryTime: "20-30 min",
            description: "Poulet grillé, parmesan, croûtons et sauce césar maison",
            image: Plat4,
            tags: ["Healthy"]
        }
    ];

    // Autres services (résumés)
    const otherServices = [
        {
            id: 5,
            title: "Recherche d'emploi dans la restauration",
            subtitle: "Trouvez un emploi ou recrutez des talents",
            description: "Mettez en relation restaurateurs et professionnels de la restauration. Des centaines d'offres d'emploi disponibles dans toute la ville.",
            icon: <Users className="w-6 h-6" />,
            link: "/emploi",
            linkText: "Voir les offres",
            features: [
                "Offres de restauration",
                "CV de chefs et serveurs",
                "Matching intelligent",
                "Alertes personnalisées"
            ],
            stats: [
                { label: "Offres actives", value: "150+" },
                { label: "Restaurants", value: "80+" },
                { label: "Taux de match", value: "78%" }
            ]
        },
        {
            id: 6,
            title: "Outils pour restaurateurs",
            subtitle: "Gérez votre restaurant efficacement",
            description: "Suite d'outils dédiée aux restaurateurs pour optimiser la gestion de votre établissement, des commandes à la comptabilité.",
            icon: <Building className="w-6 h-6" />,
            link: "/restaurateurs",
            linkText: "Découvrir les outils",
            features: [
                "Gestion des commandes",
                "Analyse des ventes",
                "Gestion des stocks",
                "Suivi des livraisons"
            ],
            tools: [
                { icon: <FileSpreadsheet className="w-5 h-5" />, name: "Commandes" },
                { icon: <Receipt className="w-5 h-5" />, name: "Facturation" },
                { icon: <Package className="w-5 h-5" />, name: "Stocks" },
                { icon: <BarChart3 className="w-5 h-5" />, name: "Analytics" }
            ]
        }
    ];

    return (
        <section id="services" className="px-4 py-16 bg-white">
            <div className="container max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="max-w-3xl mx-auto mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
                            <ChefHat className="w-4 h-4" />
                            Découvrez nos services
                        </div>
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                            Plus qu'une simple livraison de repas
                        </h2>
                        <p className="text-gray-600">
                            Des plats délicieux et des services complets pour une expérience culinaire exceptionnelle
                        </p>
                    </motion.div>
                </div>

                {/* Section 1: Plats populaires */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold">Plats populaires du moment</h3>
                            <p className="text-gray-600">Découvrez les préférés de nos clients</p>
                        </div>
                        <Button variant="link" asChild className="gap-2">
                            <Link to="/services">
                                Voir plus de menus
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {popularMeals.map((meal, index) => (
                            <motion.div
                                key={meal.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group"
                            >
                                <Card className="overflow-hidden transition-all duration-300 border-gray-200 shadow-sm hover:shadow-lg">
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 to-transparent" />
                                        <img 
                                            src={meal.image} 
                                            alt={meal.title}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                        />
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
                                    </div>
                                    
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-bold line-clamp-1">{meal.title}</h4>
                                            <span className="font-bold text-primary">{meal.price.toLocaleString()} XOF</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                                            <MapPin className="w-4 h-4" />
                                            <span className="line-clamp-1">{meal.restaurant}</span>
                                        </div>
                                        
                                        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                                            {meal.description}
                                        </p>
                                        
                                        <div className="flex flex-wrap items-center justify-between pt-4 border-t">
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                <span>{meal.deliveryTime}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="text-sm font-medium">{meal.rating}</span>
                                            </div>
                                            
                                            <Button size="sm" variant="link" className="w-full mt-4 text-center">
                                                <ShoppingCart className="w-4 h-4" />
                                                Ajouter au Panier
                                                {/* <Link to={`/meal/${meal.id}`}>
                                                    Commander
                                                </Link> */}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Section 2: Autres services (résumés) */}
                <div className="mb-16">
                    <h3 className="mb-8 text-2xl font-bold text-center">Services complémentaires</h3>
                    
                    <div className="flex flex-col gap-8">
                        {otherServices.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="h-full transition-shadow duration-300 border-gray-200 hover:shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
                                                {service.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{service.title}</h3>
                                                <p className="text-gray-500">{service.subtitle}</p>
                                            </div>
                                        </div>

                                        <p className="mb-6 text-gray-700">
                                            {service.description}
                                        </p>

                                        {/* Features */}
                                        <div className="mb-6 space-y-3">
                                            <h4 className="font-medium text-gray-900">Avantages :</h4>
                                            <ul className="space-y-2">
                                                {service.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                                                        <span className="text-gray-600">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Stats or Tools */}
                                        {service.stats && (
                                            <div className="grid grid-cols-3 gap-3 mb-6">
                                                {service.stats.map((stat, i) => (
                                                    <div key={i} className="p-3 text-center rounded-lg bg-gray-50">
                                                        <div className="text-lg font-bold text-primary">{stat.value}</div>
                                                        <div className="text-xs text-gray-500">{stat.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {service.tools && (
                                            <div className="mb-6">
                                                <h4 className="mb-3 font-medium text-gray-900">Outils inclus :</h4>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {service.tools.map((tool, i) => (
                                                        <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                                                            {tool.icon}
                                                            <span className="text-sm text-gray-700">{tool.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <Button asChild className="w-full gap-2 md:w-md">
                                            <Link to={service.link}>
                                                {service.linkText}
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Blog section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto"
                >
                    <h3 className="mb-8 text-2xl font-bold text-center">Derniers articles du blog</h3>
                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Article 1 */}
                        <div className="flex flex-col transition bg-white border shadow-sm rounded-xl hover:shadow-md">
                            <img
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&q=80"
                                alt="Blog article"
                                className="object-cover w-full h-40 rounded-t-xl"
                            />
                            <div className="flex flex-col flex-1 p-4">
                                <span className="mb-2 text-xs font-semibold uppercase text-primary">Conseils</span>
                                <h4 className="mb-2 text-lg font-bold">5 astuces pour optimiser vos commandes à emporter</h4>
                                <p className="flex-1 mb-3 text-gray-600">
                                    Découvrez comment gagner du temps et profiter au mieux de notre service de livraison rapide.
                                </p>
                                <Link to="/blog/optimiser-commandes" className="inline-flex items-center mt-auto font-medium text-primary hover:underline">
                                    Lire l'article
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                        {/* Article 2 */}
                        <div className="flex flex-col transition bg-white border shadow-sm rounded-xl hover:shadow-md">
                            <img
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&q=80"
                                alt="Blog article"
                                className="object-cover w-full h-40 rounded-t-xl"
                            />
                            <div className="flex flex-col flex-1 p-4">
                                <span className="mb-2 text-xs font-semibold uppercase text-primary">Tendance</span>
                                <h4 className="mb-2 text-lg font-bold">Les plats préférés de nos utilisateurs en 2024</h4>
                                <p className="flex-1 mb-3 text-gray-600">
                                    Un tour d’horizon des saveurs qui font vibrer la communauté LivrerNourriture cette année.
                                </p>
                                <Link to="/blog/plats-preferes-2024" className="inline-flex items-center mt-auto font-medium text-primary hover:underline">
                                    Lire l'article
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                        {/* Article 3 */}
                        <div className="flex flex-col transition bg-white border shadow-sm rounded-xl hover:shadow-md">
                            <img
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=400&q=80"
                                alt="Blog article"
                                className="object-cover w-full h-40 rounded-t-xl"
                            />
                            <div className="flex flex-col flex-1 p-4">
                                <span className="mb-2 text-xs font-semibold uppercase text-primary">Nutrition</span>
                                <h4 className="mb-2 text-lg font-bold">Bien manger même quand on manque de temps</h4>
                                <p className="flex-1 mb-3 text-gray-600">
                                    Conseils d’experts pour allier rapidité et alimentation équilibrée grâce à la livraison.
                                </p>
                                <Link to="/blog/manger-vite-bien" className="inline-flex items-center mt-auto font-medium text-primary hover:underline">
                                    Lire l'article
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA final */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="max-w-2xl mx-auto mt-16 text-center"
                >
                    <div className="p-8 border rounded-2xl bg-gradient-to-r from-primary/5 via-white to-primary/5">
                        <h3 className="mb-3 text-2xl font-bold">📱 Prêt à commander ?</h3>
                        <p className="mb-6 text-gray-600">
                            Téléchargez notre application pour une expérience encore plus fluide
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button asChild size="lg" className="gap-2">
                                <Link to="/download">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.523 15.3414C17.523 15.3414 17.7345 15.0001 17.7557 14.8361C17.4886 14.7443 15.89 13.9723 15.6364 13.8874C15.3832 13.8023 15.2664 13.6705 15.2664 13.6705C15.2664 13.6705 15.0003 13.945 14.8284 14.117C14.485 14.1075 13.2476 14.0762 11.959 14.0762C10.67 14.0762 9.4326 14.1075 9.0896 14.117C8.9176 13.945 8.6515 13.6705 8.6515 13.6705C8.6515 13.6705 8.5347 13.8023 8.2815 13.8874C8.0279 13.9723 6.4293 14.7443 6.1622 14.8361C6.1834 15.0001 6.3949 15.3414 6.3949 15.3414C6.3949 15.3414 6.8826 15.3645 7.7571 15.4239C8.6316 15.4833 9.9733 15.5353 11.959 15.5353C13.9447 15.5353 15.2864 15.4833 16.1609 15.4239C17.0354 15.3645 17.523 15.3414 17.523 15.3414Z"/>
                                    </svg>
                                    Télécharger sur l'App Store
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="gap-2">
                                <Link to="/register">
                                    Commencer maintenant
                                    <ArrowRight className="w-4 h-4" />
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