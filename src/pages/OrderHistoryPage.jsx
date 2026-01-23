// OrderHistoryPage.jsx
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, Package, FileText, Shield } from "lucide-react";
import OrderHistoryCard from "@/components/custom/OrderHistoryCard";

const sampleOrder = {
    id: "CMD-2024-001",
    orderNumber: "CMD-2024-001",
    date: "2024-03-15",
    status: "completed",
    itemsCount: 3,
    totalAmount: 2250.00,
    subtotal: 2250.00,
    discount: 0,
    tax: 450.00,
    taxRate: 20,
    paymentMethod: "Carte bancaire",
    paymentReference: "PAY-789012",
    warranty: "3 mois",
    deliveryDate: "30/03/2024",
    
    billing: {
      name: "Mr AAA",
      email: "mr.aaa@email.com",
      phone: "+33 6 12 34 56 78",
      address: "123 Avenue des Champs-Élysées",
      postalCode: "75008",
      city: "Paris",
      country: "France"
    },
    
    items: [
      {
        id: 1,
        title: "Site Vitrine Professionnel",
        provider: "TechSolutions Inc.",
        providerId: "1",
        providerEmail: "contact@techsolutions.com",
        category: "Développement Web",
        description: "Création d'un site vitrine responsive et moderne avec CMS intégré.",
        price: 1500.00,
        unitPrice: 1500.00,
        quantity: 1,
        duration: "2-3 semaines",
        startDate: "18/03/2024",
        endDate: "05/04/2024",
        icon: Package,
        features: ["Design responsive", "CMS personnalisé", "Optimisation SEO", "Formation incluse"]
      },
      {
        id: 2,
        title: "Consulting Technique",
        provider: "TechSolutions Inc.",
        providerId: "1",
        providerEmail: "contact@techsolutions.com",
        category: "Conseil",
        description: "Audit et conseil pour votre projet digital.",
        price: 750.00,
        unitPrice: 250.00,
        quantity: 3,
        duration: "Sur mesure",
        startDate: "20/03/2024",
        icon: FileText,
        features: ["Analyse technique", "Recommandations", "Roadmap projet", "Rapport détaillé"]
      },
      {
        id: 3,
        title: "Maintenance Mensuelle",
        provider: "DesignCreatives Studio",
        providerId: "2",
        providerEmail: "contact@designcreatives.com",
        category: "Support",
        description: "Forfait de maintenance et support technique.",
        price: 300.00,
        unitPrice: 300.00,
        quantity: 1,
        duration: "Forfait mensuel",
        startDate: "01/04/2024",
        icon: Shield,
        features: ["Mises à jour sécurité", "Sauvegardes", "Support prioritaire", "Monitoring 24/7"]
      }
    ]
  };

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([sampleOrder]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch = order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                         order.billing.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group par année/mois
  const groupedOrders = filteredOrders.reduce((groups, order) => {
    const date = new Date(order.date);
    const year = date.getFullYear();
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    const key = `${year}-${month}`;
    
    if (!groups[key]) {
      groups[key] = {
        year,
        month,
        orders: []
      };
    }
    groups[key].orders.push(order);
    return groups;
  }, {});

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-semibold">Historique des commandes</h1>
        <p className="text-muted-foreground">
          Retrouvez toutes vos commandes passées et leurs détails
        </p>
      </div>

      {/* Barre de filtres et recherche */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une commande..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtrer
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>

        {/* Filtres par statut */}
        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="completed">Terminées</TabsTrigger>
            <TabsTrigger value="in_progress">En cours</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="cancelled">Annulées</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Liste des commandes */}
      {Object.values(groupedOrders).length === 0 ? (
        <div className="py-12 text-center border rounded-lg">
          <p className="text-muted-foreground">Aucune commande trouvée</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.values(groupedOrders).map((group) => (
            <div key={`${group.year}-${group.month}`}>
              <h2 className="mb-4 text-lg font-semibold capitalize">
                {group.month} {group.year} ({group.orders.length})
              </h2>
              <div className="space-y-4">
                {group.orders.map((order) => (
                  <OrderHistoryCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistiques */}
      <div className="pt-8 mt-12 border-t">
        <h3 className="mb-6 text-lg font-semibold">Vos statistiques</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-semibold">{orders.length}</div>
            <div className="text-sm text-muted-foreground">Commandes totales</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-semibold">
              {orders.filter(o => o.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Commandes terminées</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-semibold">
              {orders.filter(o => o.status === 'in_progress').length}
            </div>
            <div className="text-sm text-muted-foreground">En cours</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-2xl font-semibold">
              {orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)} XAF
            </div>
            <div className="text-sm text-muted-foreground">Montant total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;