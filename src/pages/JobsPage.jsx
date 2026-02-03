// JobsPage.jsx - Version Restauration
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  MapPin,
  Clock,
  Building,
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Filter,
  Search,
  Star,
  ChevronRight,
  Bookmark,
  Share2,
  ChefHat,
  Coffee,
  Utensils,
  Bike,
  Car,
  Package,
  Truck,
  Home,
  User,
  Shield,
  Heart,
  Zap,
  CheckCircle,
} from "lucide-react";

const JobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  // Données des restaurants
  const restaurants = [
    {
      id: 1,
      name: "Le Dakarois",
      cuisine: "Africain",
      location: "Dakar, Plateau",
      rating: 4.8,
      logoColor: "bg-orange-600",
      description:
        "Restaurant traditionnel sénégalais, spécialiste du poulet yassa et thieboudienne",
    },
    {
      id: 2,
      name: "Burger House",
      cuisine: "Fast-food",
      location: "Dakar, Almadies",
      rating: 4.7,
      logoColor: "bg-red-600",
      description: "Burgers artisanaux et cuisine rapide de qualité",
    },
    {
      id: 3,
      name: "Pizzeria Roma",
      cuisine: "Italien",
      location: "Dakar, Point E",
      rating: 4.9,
      logoColor: "bg-green-600",
      description: "Pizzeria traditionnelle napolitaine au feu de bois",
    },
    {
      id: 4,
      name: "Sushi Zen",
      cuisine: "Japonais",
      location: "Dakar, Ouakam",
      rating: 4.8,
      logoColor: "bg-blue-600",
      description: "Sushi bar avec poissons frais importés quotidiennement",
    },
    {
      id: 5,
      name: "Café de Paris",
      cuisine: "Café",
      location: "Dakar, Plateau",
      rating: 4.4,
      logoColor: "bg-yellow-600",
      description: "Café-brasserie avec spécialités françaises",
    },
  ];

  // Offres d'emploi dans la restauration
  const jobOffers = [
    {
      id: 1,
      title: "Cuisinier Senior",
      restaurantId: 1,
      type: "CDI",
      location: "Plateau, Dakar",
      salary: "300K-400K XOF",
      experience: "3-5 ans",
      category: "Cuisine",
      description:
        "Recherche cuisinier expérimenté pour notre cuisine traditionnelle sénégalaise.",
      skills: [
        "Cuisine africaine",
        "Gestion de brigade",
        "Hygiène alimentaire",
        "Créativité",
      ],
      postedDate: "Il y a 2 jours",
      remote: false,
      urgent: true,
      schedule: "Temps plein",
      contractType: "CDI",
    },
    {
      id: 2,
      title: "Serveur/Serveuse",
      restaurantId: 2,
      type: "CDD",
      location: "Almadies, Dakar",
      salary: "150K-200K XOF",
      experience: "1-2 ans",
      category: "Service",
      description:
        "Recrutement serveurs dynamiques pour notre restaurant burger.",
      skills: ["Accueil client", "Service de table", "Commande", "Caisse"],
      postedDate: "Il y a 5 jours",
      remote: false,
      urgent: false,
      schedule: "Temps plein",
      contractType: "CDD 6 mois",
    },
    {
      id: 3,
      title: "Livreur à vélo",
      restaurantId: 3,
      type: "Freelance",
      location: "Point E, Dakar",
      salary: "À la course + pourboires",
      experience: "Débutant accepté",
      category: "Livraison",
      description: "Recherche livreurs à vélo pour livraison de pizzas.",
      skills: [
        "Conduite vélo",
        "Connaissance ville",
        "Ponctualité",
        "Service client",
      ],
      postedDate: "Il y a 1 semaine",
      remote: false,
      urgent: true,
      schedule: "Horaires flexibles",
      contractType: "Freelance",
    },
    {
      id: 4,
      title: "Apprenti Sushi Chef",
      restaurantId: 4,
      type: "Apprentissage",
      location: "Ouakam, Dakar",
      salary: "Formation rémunérée",
      experience: "Étudiant/Débutant",
      category: "Cuisine",
      description: "Formation en préparation de sushis pour débutant motivé.",
      skills: [
        "Précision",
        "Hygiene",
        "Apprentissage rapide",
        "Passion cuisine",
      ],
      postedDate: "Il y a 3 jours",
      remote: false,
      urgent: false,
      schedule: "Temps plein",
      contractType: "Contrat d'apprentissage",
    },
    {
      id: 5,
      title: "Livreur en scooter",
      restaurantId: 2,
      type: "CDI",
      location: "Dakar (Toute la ville)",
      salary: "250K-300K XOF",
      experience: "1 an minimum",
      category: "Livraison",
      description:
        "Livreur expérimenté avec scooter personnel pour livraisons rapides.",
      skills: [
        "Permis scooter",
        "GPS",
        "Service client",
        "Gestion des commandes",
      ],
      postedDate: "Il y a 1 jour",
      remote: false,
      urgent: true,
      schedule: "Rotation",
      contractType: "CDI",
    },
    {
      id: 6,
      title: "Responsable de salle",
      restaurantId: 5,
      type: "CDI",
      location: "Plateau, Dakar",
      salary: "400K-500K XOF",
      experience: "5-7 ans",
      category: "Management",
      description: "Gestion d'équipe et organisation du service en salle.",
      skills: ["Management", "Planification", "Service client", "Formation"],
      postedDate: "Il y a 2 semaines",
      remote: false,
      urgent: false,
      schedule: "Temps plein",
      contractType: "CDI",
    },
    {
      id: 7,
      title: "Plongeur/Pizzaïolo",
      restaurantId: 3,
      type: "CDD",
      location: "Point E, Dakar",
      salary: "180K-220K XOF",
      experience: "Débutant accepté",
      category: "Cuisine",
      description: "Poste polyvalent: préparation pizzas et plonge.",
      skills: ["Travail d'équipe", "Rapidité", "Hygiene", "Apprentissage"],
      postedDate: "Il y a 4 jours",
      remote: false,
      urgent: false,
      schedule: "Soirées et week-ends",
      contractType: "CDD 3 mois",
    },
    {
      id: 8,
      title: "Livreur voiture",
      restaurantId: 4,
      type: "Freelance",
      location: "Grand Dakar",
      salary: "À la course + bonus",
      experience: "2 ans minimum",
      category: "Livraison",
      description: "Livreur avec véhicule personnel pour grandes commandes.",
      skills: [
        "Permis B",
        "Véhicule personnel",
        "Service client",
        "Organisation",
      ],
      postedDate: "Il y a 6 jours",
      remote: false,
      urgent: false,
      schedule: "Horaires flexibles",
      contractType: "Freelance",
    },
  ];

  // États pour les filtres
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedType, setSelectedType] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");

  // Trouver les informations du restaurant
  const getRestaurantInfo = (restaurantId) => {
    return restaurants.find((r) => r.id === restaurantId) || restaurants[0];
  };

  // Catégories et types uniques
  const categories = ["Tous", "Cuisine", "Service", "Livraison", "Management"];
  const jobTypes = ["Tous", "CDI", "CDD", "Freelance", "Apprentissage"];

  // Filtrer les offres
  const filteredJobs = jobOffers.filter((job) => {
    const matchesCategory =
      selectedCategory === "Tous" || job.category === selectedCategory;
    const matchesType = selectedType === "Tous" || job.type === selectedType;
    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()),
      ) ||
      getRestaurantInfo(job.restaurantId)
        .name.toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesType && matchesSearch;
  });

  const toggleSavedJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId],
    );
  };

  // Icônes par catégorie
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Cuisine":
        return <ChefHat className="w-5 h-5" />;
      case "Service":
        return <Utensils className="w-5 h-5" />;
      case "Livraison":
        return <Bike className="w-5 h-5" />;
      case "Management":
        return <Users className="w-5 h-5" />;
      default:
        return <Briefcase className="w-5 h-5" />;
    }
  };

  // Couleurs par catégorie
  const getCategoryColor = (category) => {
    switch (category) {
      case "Cuisine":
        return "bg-orange-100 text-orange-800";
      case "Service":
        return "bg-blue-100 text-blue-800";
      case "Livraison":
        return "bg-green-100 text-green-800";
      case "Management":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      {/* <section className="bg-gradient-to-r from-primary/5 via-white to-primary/5"> */}
      <section className="bg-primary/10">
        <div className="container px-4 py-12 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
              <Briefcase className="w-4 h-4" />
              Emplois Restauration
            </div>

            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Trouvez votre emploi dans la restauration
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              Rejoignez nos restaurants partenaires et développez votre carrière
            </p>

            {/* Barre de recherche */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un poste, un restaurant ou une compétence..."
                  className="w-full py-3 pl-12 pr-4 border border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Stats rapides */}
            <div className="grid max-w-lg grid-cols-2 gap-4 mx-auto sm:grid-cols-4">
              <div className="p-4 text-center bg-white border shadow-sm rounded-xl">
                <div className="text-2xl font-bold text-primary">
                  {jobOffers.length}
                </div>
                <div className="text-sm text-gray-600">Offres actives</div>
              </div>
              <div className="p-4 text-center bg-white border shadow-sm rounded-xl">
                <div className="text-2xl font-bold text-primary">
                  {restaurants.length}
                </div>
                <div className="text-sm text-gray-600">Restaurants</div>
              </div>
              <div className="p-4 text-center bg-white border shadow-sm rounded-xl">
                <div className="text-2xl font-bold text-primary">
                  {jobOffers.filter((j) => j.category === "Livraison").length}
                </div>
                <div className="text-sm text-gray-600">Postes livraison</div>
              </div>
              <div className="p-4 text-center bg-white border shadow-sm rounded-xl">
                <div className="text-2xl font-bold text-primary">
                  {jobOffers.filter((j) => j.urgent).length}
                </div>
                <div className="text-sm text-gray-600">Urgent</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section principale */}
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filtres */}
          <div className="lg:w-1/4">
            <div className="sticky space-y-6 top-8">
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h3 className="flex items-center gap-2 mb-6 text-lg font-bold">
                  <Filter className="w-5 h-5" />
                  Filtres
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="mb-3 font-medium">Catégorie</h4>
                    <div className="flex flex-col gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                            selectedCategory === category
                              ? "bg-primary text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {getCategoryIcon(category)}
                          <span>{category}</span>
                          {category !== "Tous" && (
                            <span className="ml-auto text-xs opacity-70">
                              {
                                jobOffers.filter((j) => j.category === category)
                                  .length
                              }
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="mb-3 font-medium">Type de contrat</h4>
                    <div className="space-y-2">
                      {jobTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all ${
                            selectedType === type
                              ? "bg-primary text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <span>{type}</span>
                          <span className="text-xs opacity-70">
                            {
                              jobOffers.filter((j) =>
                                type === "Tous" ? true : j.type === type,
                              ).length
                            }
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="mb-3 font-medium">Horaire</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          className="rounded text-primary"
                        />
                        <span>Temps plein</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          className="rounded text-primary"
                        />
                        <span>Soirées/Week-ends</span>
                      </label>
                      <label className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          className="rounded text-primary"
                        />
                        <span>Horaires flexibles</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conseils */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h3 className="mb-4 font-bold">Conseils de candidature</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">
                      Préparez un CV simple et clair
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">
                      Soyez ponctuel pour les entretiens
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <User className="w-5 h-5 mt-0.5 text-purple-500 flex-shrink-0" />
                    <span className="text-sm">
                      Mentionnez votre expérience en restauration
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-5 h-5 mt-0.5 text-amber-500 flex-shrink-0" />
                    <span className="text-sm">Certification HACCP un plus</span>
                  </li>
                </ul>
              </div>

              {/* Devenir livreur */}
              {/* <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                <h3 className="mb-3 font-bold">🚴 Devenir livreur</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Rejoignez notre équipe de livreurs et gagnez en toute
                  flexibilité
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/become-deliverer">
                    <Bike className="w-4 h-4 mr-2" />
                    Postuler comme livreur
                  </Link>
                </Button>
              </div> */}
            </div>
          </div>

          {/* Liste des offres */}
          <div className="lg:w-3/4">
            <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold">Offres disponibles</h2>
                <p className="text-gray-600">
                  {filteredJobs.length} offre
                  {filteredJobs.length > 1 ? "s" : ""} correspondante
                  {filteredJobs.length > 1 ? "s" : ""} à vos critères
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Trier par :</span>
                <select className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Plus récentes</option>
                  <option>Salaire (plus élevé)</option>
                  <option>Urgentes d'abord</option>
                  <option>Proximité</option>
                </select>
              </div>
            </div>

            {/* Grille des offres */}
            <div className="grid gap-6 md:grid-cols-2">
              {filteredJobs.map((job) => {
                const restaurant = getRestaurantInfo(job.restaurantId);

                return (
                  <div
                    key={job.id}
                    className="overflow-hidden transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg hover:border-primary/50 group"
                  >
                    {/* En-tête de l'offre */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex items-center justify-center w-12 h-12 rounded-xl ${restaurant.logoColor} text-white shadow-md`}
                          >
                            {getCategoryIcon(job.category)}
                          </div>
                          <div>
                            <h3 className="font-bold transition-colors group-hover:text-primary">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">
                                {restaurant.name}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                {restaurant.cuisine}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => toggleSavedJob(job.id)}
                            className="p-2 transition-colors rounded-lg hover:bg-gray-100"
                            title={
                              savedJobs.includes(job.id)
                                ? "Retirer des favoris"
                                : "Sauvegarder"
                            }
                          >
                            <Bookmark
                              className={`w-4 h-4 ${savedJobs.includes(job.id) ? "fill-primary text-primary" : ""}`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={`${getCategoryColor(job.category)} border-0`}
                        >
                          {job.category}
                        </Badge>
                        <Badge variant="outline">{job.contractType}</Badge>
                        {job.urgent && (
                          <Badge
                            variant="destructive"
                            className="animate-pulse"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                        <Badge variant="secondary">{job.schedule}</Badge>
                      </div>
                    </div>

                    {/* Détails de l'offre */}
                    <div className="p-6">
                      <p className="mb-4 text-gray-600 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Informations clés */}
                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium">Lieu</div>
                            <div className="text-gray-600">{job.location}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <div>
                            <div className="font-medium">Salaire</div>
                            <div className="font-bold text-primary">
                              {job.salary}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                          <Briefcase className="w-4 h-4 text-blue-500" />
                          <div>
                            <div className="font-medium">Expérience</div>
                            <div className="text-gray-600">
                              {job.experience}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <div>
                            <div className="font-medium">Publiée</div>
                            <div className="text-gray-600">
                              {job.postedDate}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Compétences */}
                      <div className="mb-6">
                        <h4 className="mb-3 font-medium">
                          Compétences recherchées
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-lg"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex gap-3">
                        {/* <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          asChild
                        >
                          <Link to={`/restaurant/${restaurant.id}`}>
                            <Utensils className="w-4 h-4" />
                            Voir le restaurant
                          </Link>
                        </Button> */}

                        <Button
                          variant="default"
                          className="flex-1 gap-2"
                          asChild
                        >
                          <Link to={`/apply/job/${job.id}`}>
                            <Briefcase className="w-4 h-4" />
                            Postuler maintenant
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message si aucun résultat */}
            {filteredJobs.length === 0 && (
              <div className="py-16 text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Aucune offre trouvée</h3>
                <p className="mb-6 text-gray-600">
                  Essayez de modifier vos filtres ou de chercher avec d'autres
                  termes
                </p>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    setSelectedCategory("Tous");
                    setSelectedType("Tous");
                    setSearchTerm("");
                  }}
                >
                  <Filter className="w-4 h-4" />
                  Réinitialiser les filtres
                </Button>
              </div>
            )}

            {/* Section CTA */}
            <div className="mt-8">
              <div className="p-8 border border-gray-200 rounded-xl bg-gradient-to-r from-primary/5 via-white to-primary/5">
                <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                  <div className="text-center md:text-left">
                    <h3 className="mb-3 text-xl font-bold">
                      Vous êtes restaurateur ?
                    </h3>
                    <p className="max-w-lg text-gray-600">
                      Recrutez des talents qualifiés et développez votre équipe
                      avec LivrerNourriture
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="gap-2">
                      <Link to="/recruiter/post-job">
                        <Users className="w-4 h-4" />
                        Publier une offre
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="gap-2">
                      <Link to="/restaurateurs/recrutement">
                        <ExternalLink className="w-4 h-4" />
                        Espace recruteur
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section livreur */}
            {/* <div className="mt-8">
              <div className="p-8 border border-gray-200 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex flex-col items-center gap-8 md:flex-row">
                  <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                    <Bike className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="mb-3 text-xl font-bold">
                      Devenez livreur LivrerNourriture
                    </h3>
                    <p className="mb-4 text-gray-600">
                      Gagnez de l'argent en toute flexibilité. Choisissez vos
                      horaires et travaillez à votre rythme.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Flexibilité horaire</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Rémunération attractive</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Formation fournie</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/become-deliverer">
                      Postuler comme livreur
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
