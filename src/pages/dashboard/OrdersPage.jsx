import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Package,
  DollarSign,
  Calendar,
  User,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Download,
  RefreshCw,
  TrendingUp,
  ShoppingCart,
  CreditCard,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Printer,
  FileText,
  AlertCircle,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderDetailsDialog from "@/components/dialog/OrderDetailsDialog";

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "table" ou "cards"

  // Simuler le chargement des données
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Données des commandes
  const commandes = [
    {
      id: "CMD-2024-001",
      client: {
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@example.com",
        telephone: "+33 1 23 45 67 89",
        entreprise: "TechCorp",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
      },
      montant: 1499.99,
      devise: "EUR",
      statut: "livrée",
      type: "abonnement",
      dateCommande: "15 Jan 2024",
      dateLivraison: "20 Jan 2024",
      modePaiement: "Carte de crédit",
      referencePaiement: "PAY-001234",
      articles: [
        { nom: "Abonnement Premium Mensuel", quantite: 1, prix: 49.99 },
        { nom: "Annonces prioritaires", quantite: 5, prix: 250 },
      ],
      adresseLivraison: {
        nom: "AAAA",
        entreprise: "TechCorp",
        rue: "123 Avenue des Champs-Élysées",
        ville: "Paris",
        codePostal: "75008",
        pays: "France",
      },
      notes: "Livraison avant 18h",
      suivi: "TRK-789456123",
    },
    {
      id: "CMD-2024-002",
      client: {
        nom: "Martin",
        prenom: "Sophie",
        email: "sophie.martin@example.com",
        telephone: "+33 1 98 76 54 32",
        entreprise: "StartUpXYZ",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      },
      montant: 299.99,
      devise: "EUR",
      statut: "en cours",
      type: "publication",
      dateCommande: "12 Jan 2024",
      dateLivraison: "18 Jan 2024",
      modePaiement: "PayPal",
      referencePaiement: "PAY-001235",
      articles: [
        { nom: "Publication d'offre premium", quantite: 1, prix: 299.99 },
      ],
      adresseLivraison: {
        nom: "Sophie Martin",
        entreprise: "StartUpXYZ",
        rue: "456 Boulevard Saint-Germain",
        ville: "Paris",
        codePostal: "75006",
        pays: "France",
      },
      notes: "Facture proforma nécessaire",
      suivi: "TRK-789456124",
    },
    {
      id: "CMD-2024-003",
      client: {
        nom: "Dubois",
        prenom: "Pierre",
        email: "pierre.dubois@example.com",
        telephone: "+33 1 45 67 89 01",
        entreprise: "CloudSystems",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre",
      },
      montant: 799.5,
      devise: "EUR",
      statut: "en attente",
      type: "abonnement",
      dateCommande: "10 Jan 2024",
      dateLivraison: null,
      modePaiement: "Virement bancaire",
      referencePaiement: null,
      articles: [
        { nom: "Abonnement Pro Trimestriel", quantite: 1, prix: 799.5 },
      ],
      adresseLivraison: {
        nom: "Pierre Dubois",
        entreprise: "CloudSystems",
        rue: "789 Rue de Rivoli",
        ville: "Lyon",
        codePostal: "69001",
        pays: "France",
      },
      notes: "En attente de paiement",
      suivi: null,
    },
    {
      id: "CMD-2024-004",
      client: {
        nom: "Leroy",
        prenom: "Marie",
        email: "marie.leroy@example.com",
        telephone: "+33 1 23 98 76 54",
        entreprise: "DesignLab",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
      },
      montant: 129.99,
      devise: "EUR",
      statut: "annulée",
      type: "service",
      dateCommande: "05 Jan 2024",
      dateLivraison: null,
      modePaiement: "Carte de crédit",
      referencePaiement: "PAY-001236",
      articles: [{ nom: "Optimisation de profil", quantite: 1, prix: 129.99 }],
      adresseLivraison: {
        nom: "Marie Leroy",
        entreprise: "DesignLab",
        rue: "321 Rue de la Paix",
        ville: "Bordeaux",
        codePostal: "33000",
        pays: "France",
      },
      notes: "Annulée par le client",
      suivi: null,
    },
    {
      id: "CMD-2024-005",
      client: {
        nom: "Moreau",
        prenom: "Thomas",
        email: "thomas.moreau@example.com",
        telephone: "+33 1 54 32 10 98",
        entreprise: "DataTech",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
      },
      montant: 2499.99,
      devise: "EUR",
      statut: "livrée",
      type: "abonnement",
      dateCommande: "18 Jan 2024",
      dateLivraison: "19 Jan 2024",
      modePaiement: "Carte de crédit",
      referencePaiement: "PAY-001237",
      articles: [
        { nom: "Abonnement Entreprise Annuel", quantite: 1, prix: 2499.99 },
      ],
      adresseLivraison: {
        nom: "Thomas Moreau",
        entreprise: "DataTech",
        rue: "654 Avenue Montaigne",
        ville: "Paris",
        codePostal: "75008",
        pays: "France",
      },
      notes: "Client VIP - Livraison express",
      suivi: "TRK-789456125",
    },
    {
      id: "CMD-2024-006",
      client: {
        nom: "Garcia",
        prenom: "Luis",
        email: "luis.garcia@example.com",
        telephone: "+34 91 23 45 67",
        entreprise: null,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis",
      },
      montant: 49.99,
      devise: "EUR",
      statut: "en préparation",
      type: "abonnement",
      dateCommande: "20 Déc 2023",
      dateLivraison: "25 Déc 2023",
      modePaiement: "PayPal",
      referencePaiement: "PAY-001238",
      articles: [
        { nom: "Abonnement Mensuel Basique", quantite: 1, prix: 49.99 },
      ],
      adresseLivraison: {
        nom: "Luis Garcia",
        entreprise: null,
        rue: "Calle Gran Via 123",
        ville: "Madrid",
        codePostal: "28013",
        pays: "Espagne",
      },
      notes: "Renouvellement automatique",
      suivi: "TRK-789456126",
    },
    {
      id: "CMD-2024-007",
      client: {
        nom: "Kowalski",
        prenom: "Anna",
        email: "anna.kowalski@example.com",
        telephone: "+48 22 123 45 67",
        entreprise: "GrowthInc",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
      },
      montant: 599.99,
      devise: "EUR",
      statut: "en attente",
      type: "publication",
      dateCommande: "25 Déc 2023",
      dateLivraison: null,
      modePaiement: "Virement bancaire",
      referencePaiement: null,
      articles: [{ nom: "Pack de 10 publications", quantite: 1, prix: 599.99 }],
      adresseLivraison: {
        nom: "Anna Kowalski",
        entreprise: "GrowthInc",
        rue: "ul. Marszałkowska 1",
        ville: "Varsovie",
        codePostal: "00-001",
        pays: "Pologne",
      },
      notes: "En attente de confirmation bancaire",
      suivi: null,
    },
    {
      id: "CMD-2024-008",
      client: {
        nom: "Chen",
        prenom: "Wei",
        email: "wei.chen@example.com",
        telephone: "+86 10 1234 5678",
        entreprise: "TechGlobal",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wei",
      },
      montant: 899.99,
      devise: "USD",
      statut: "livrée",
      type: "service",
      dateCommande: "28 Déc 2023",
      dateLivraison: "02 Jan 2024",
      modePaiement: "Carte de crédit",
      referencePaiement: "PAY-001239",
      articles: [{ nom: "Audit de recrutement", quantite: 1, prix: 899.99 }],
      adresseLivraison: {
        nom: "Wei Chen",
        entreprise: "TechGlobal",
        rue: "123 Nanjing Road",
        ville: "Shanghai",
        codePostal: "200001",
        pays: "Chine",
      },
      notes: "Traduction nécessaire pour la documentation",
      suivi: "TRK-789456127",
    },
  ];

  // Statistiques des commandes
  const statsCommandes = [
    {
      title: "Chiffre d'affaires",
      value: "€6,339.43",
      change: "+18.5%",
      trend: "up",
      icon: DollarSign,
      color: "green",
      description: "Ce mois-ci",
    },
    {
      title: "Commandes totales",
      value: "8",
      change: "+2",
      trend: "up",
      icon: ShoppingCart,
      color: "blue",
      description: "30 derniers jours",
    },
    {
      title: "Taux de conversion",
      value: "24.3%",
      change: "+3.2%",
      trend: "up",
      icon: TrendingUp,
      color: "purple",
      description: "Panier moyen: €792.43",
    },
    {
      title: "Commandes en attente",
      value: "2",
      change: "-1",
      trend: "down",
      icon: Clock,
      color: "amber",
      description: "À traiter",
    },
  ];

  // Répartition par statut
  const repartitionStatuts = [
    { statut: "Livrées", count: 4, color: "bg-green-500", montant: 4949.47 },
    { statut: "En cours", count: 2, color: "bg-blue-500", montant: 899.98 },
    { statut: "En attente", count: 2, color: "bg-amber-500", montant: 1399.49 },
    { statut: "Annulées", count: 1, color: "bg-red-500", montant: 129.99 },
  ];

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case "livrée":
        return "bg-green-100 text-green-800 border-green-200";
      case "en cours":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "en préparation":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "en attente":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "annulée":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir la couleur du type
  const getTypeColor = (type) => {
    switch (type) {
      case "abonnement":
        return "bg-purple-100 text-purple-800";
      case "publication":
        return "bg-blue-100 text-blue-800";
      case "service":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status) => {
    switch (status) {
      case "livrée":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "en cours":
        return <Truck className="w-3 h-3 text-blue-500" />;
      case "en préparation":
        return <Package className="w-3 h-3 text-amber-500" />;
      case "en attente":
        return <Clock className="w-3 h-3 text-gray-500" />;
      case "annulée":
        return <XCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  // Formater le montant
  const formatMontant = (montant, devise) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: devise,
    }).format(montant);
  };

  // Filtrer les commandes
  const filteredOrders = commandes.filter((commande) => {
    const matchesSearch =
      commande.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.client.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || commande.statut === statusFilter;
    const matchesType = typeFilter === "all" || commande.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculer les totaux
  const totalCA = commandes.reduce((sum, cmd) => sum + cmd.montant, 0);
  const avgPanier = totalCA / commandes.length;

  // Ouvrir les détails d'une commande
  const openOrderDetail = (commande) => {
    setSelectedOrder(commande);
    setIsOrderDetailOpen(true);
  };

  // Actions sur les commandes
  const updateOrderStatus = (orderId, newStatus) => {
    console.log(`Mettre à jour la commande ${orderId} vers ${newStatus}`);
    // Ici, vous appelleriez votre API
  };

  const resendInvoice = (orderId) => {
    console.log(`Renvoyer la facture pour ${orderId}`);
    // Ici, vous appelleriez votre API
  };

  const cancelOrder = (orderId) => {
    if (confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      console.log(`Annuler la commande ${orderId}`);
      // Ici, vous appelleriez votre API
    }
  };

  return (
    <main className="flex flex-col w-full p-4 overflow-auto lg:p-8">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 mb-8 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des commandes
          </h1>
          <p className="text-muted-foreground">
            Gérez et suivez les commandes de votre plateforme
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Imprimer
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              Tableau
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("cards")}
            >
              Cartes
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="flex flex-col flex-wrap gap-3 mb-3 md:flex-row">
        {statsCommandes.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="w-full md:w-[250px]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <Badge
                        variant={stat.trend === "up" ? "default" : "secondary"}
                        className="gap-1"
                      >
                        {stat.trend === "up" ? "↗" : "↘"}
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filtres et recherche */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par ID, nom client, email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="livrée">Livrées</SelectItem>
                  <SelectItem value="en cours">En cours</SelectItem>
                  <SelectItem value="en préparation">En préparation</SelectItem>
                  <SelectItem value="en attente">En attente</SelectItem>
                  <SelectItem value="annulée">Annulées</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <Package className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="abonnement">Abonnements</SelectItem>
                  <SelectItem value="publication">Publications</SelectItem>
                  <SelectItem value="service">Services</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vue tableau */}
      {viewMode === "table" && (
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Liste des commandes</CardTitle>
                <CardDescription>
                  {filteredOrders.length} commandes trouvées sur{" "}
                  {commandes.length}
                </CardDescription>
              </div>
              <Badge variant="outline" className="gap-2">
                <Package className="w-3 h-3" />
                {commandes.length} commandes
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Commande</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
                        <p className="text-sm text-muted-foreground">
                          Chargement des commandes...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Package className="w-12 h-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Aucune commande trouvée
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((commande) => (
                    <TableRow key={commande.id} className="hover:bg-accent/50">
                      <TableCell>
                        <div>
                          <h4 className="font-semibold">{commande.id}</h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <CreditCard className="w-3 h-3" />
                            <span>{commande.modePaiement}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={commande.client.avatar} />
                            <AvatarFallback>
                              {commande.client.prenom[0]}
                              {commande.client.nom[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">
                              {commande.client.prenom} {commande.client.nom}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                              {commande.client.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold">
                            {formatMontant(commande.montant, commande.devise)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {commande.articles.length} article
                            {commande.articles.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`w-fit ${getTypeColor(commande.type)}`}
                        >
                          {commande.type === "abonnement"
                            ? "Abonnement"
                            : commande.type === "publication"
                              ? "Publication"
                              : "Service"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(commande.statut)}
                          <Badge
                            variant="outline"
                            className={`w-fit ${getStatusColor(commande.statut)}`}
                          >
                            {commande.statut === "livrée"
                              ? "Livrée"
                              : commande.statut === "en cours"
                                ? "En cours"
                                : commande.statut === "en préparation"
                                  ? "En préparation"
                                  : commande.statut === "en attente"
                                    ? "En attente"
                                    : "Annulée"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            Commande: {commande.dateCommande}
                          </div>
                          {commande.dateLivraison && (
                            <div className="text-xs text-muted-foreground">
                              Livraison: {commande.dateLivraison}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openOrderDetail(commande)}
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => openOrderDetail(commande)}
                              >
                                <Eye className="w-4 h-4" />
                                Voir les détails
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <FileText className="w-4 h-4" />
                                Générer facture
                              </DropdownMenuItem>
                              {commande.statut !== "livrée" &&
                                commande.statut !== "annulée" && (
                                  <DropdownMenuItem className="gap-2">
                                    <Truck className="w-4 h-4" />
                                    Mettre à jour statut
                                  </DropdownMenuItem>
                                )}
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => resendInvoice(commande.id)}
                              >
                                <Mail className="w-4 h-4" />
                                Renvoyer facture
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {commande.statut !== "annulée" && (
                                <DropdownMenuItem
                                  className="gap-2 text-red-600"
                                  onClick={() => cancelOrder(commande.id)}
                                >
                                  <XCircle className="w-4 h-4" />
                                  Annuler la commande
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Vue cartes */}
      {viewMode === "cards" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="py-8 text-center col-span-full">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
                <p className="text-sm text-muted-foreground">
                  Chargement des commandes...
                </p>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-8 text-center col-span-full">
              <div className="flex flex-col items-center justify-center gap-2">
                <Package className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground">Aucune commande trouvée</p>
              </div>
            </div>
          ) : (
            filteredOrders.map((commande) => (
              <Card
                key={commande.id}
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{commande.id}</CardTitle>
                      <CardDescription>{commande.dateCommande}</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(commande.statut)}`}
                    >
                      {commande.statut}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Client */}
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={commande.client.avatar} />
                        <AvatarFallback>
                          {commande.client.prenom[0]}
                          {commande.client.nom[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {commande.client.prenom} {commande.client.nom}
                        </p>
                        <p className="text-sm truncate text-muted-foreground">
                          {commande.client.email}
                        </p>
                      </div>
                    </div>

                    {/* Détails commande */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Montant</p>
                        <p className="font-bold">
                          {formatMontant(commande.montant, commande.devise)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getTypeColor(commande.type)}`}
                        >
                          {commande.type}
                        </Badge>
                      </div>
                    </div>

                    {/* Articles */}
                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">
                        Articles
                      </p>
                      <div className="space-y-1">
                        {commande.articles.slice(0, 2).map((article, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="truncate">{article.nom}</span>
                            <span className="font-medium">
                              {article.quantite} ×{" "}
                              {formatMontant(article.prix, commande.devise)}
                            </span>
                          </div>
                        ))}
                        {commande.articles.length > 2 && (
                          <p className="text-xs text-center text-muted-foreground">
                            +{commande.articles.length - 2} autres articles
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openOrderDetail(commande)}
                      >
                        Détails
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Facture
                        </Button>
                        {commande.suivi && (
                          <Button variant="outline" size="sm">
                            <Truck className="w-3 h-3 mr-1" />
                            Suivi
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Section inférieure */}
      <div className="grid gap-6 mt-6 lg:grid-cols-3">
        {/* Répartition par statut */}
        {/* <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Analyse des commandes</CardTitle>
            <CardDescription>Répartition par statut et type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 font-medium">Par statut</h4>
                <div className="space-y-4">
                  {repartitionStatuts.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm font-medium">{item.statut}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{item.count}</span>
                          <span className="text-sm text-muted-foreground">
                            ({formatMontant(item.montant, 'EUR')})
                          </span>
                        </div>
                      </div>
                      <Progress value={(item.count / commandes.length) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="mb-4 font-medium">Performances mensuelles</h4>
                <div className="space-y-3">
                  {[
                    { mois: "Jan 2024", ca: 6339.43, commandes: 8, evolution: "+18.5%" },
                    { mois: "Déc 2023", ca: 5349.20, commandes: 12, evolution: "+12.2%" },
                    { mois: "Nov 2023", ca: 4768.90, commandes: 10, evolution: "+5.8%" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">{item.mois}</h5>
                        <p className="text-sm text-muted-foreground">{item.commandes} commandes</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatMontant(item.ca, 'EUR')}</p>
                        <Badge variant="outline" className="mt-1 text-xs text-green-700 bg-green-50">
                          {item.evolution}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Commandes récentes */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
            <CardDescription>Dernières 24 heures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commandes
                .sort((a, b) => new Date(b.dateCommande) - new Date(a.dateCommande))
                .slice(0, 3)
                .map((commande) => (
                  <div key={commande.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Package className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{commande.id}</h4>
                        <p className="text-xs text-muted-foreground">{commande.client.prenom} {commande.client.nom}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{formatMontant(commande.montant, commande.devise)}</div>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {commande.statut}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
            <Button variant="outline" className="w-full gap-2 mt-4">
              <BarChart3 className="w-4 h-4" />
              Voir toutes les statistiques
            </Button>
          </CardContent>
        </Card> */}
      </div>

      {/* Modal de détail commande */}
      <OrderDetailsDialog
        isOrderDetailOpen={isOrderDetailOpen}
        setIsOrderDetailOpen={setIsOrderDetailOpen}
        selectedOrder={selectedOrder}
        getStatusColor={getStatusColor}
        getTypeColor={getTypeColor}
        formatMontant={formatMontant}
        commandes={commandes}
        cancelOrder={cancelOrder}
      />
    </main>
  );
};

export default OrdersPage;
