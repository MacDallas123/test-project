import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  MoreVertical,
  Download,
  ExternalLink,
  Building,
  TrendingUp,
  Calendar,
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

const OffresEmploisPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Simuler le chargement des données
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Données des offres d'emplois
  const offresEmplois = [
    {
      id: 1,
      titre: "Développeur React Senior",
      entreprise: "TechCorp",
      lieu: "Paris, France",
      type: "CDI",
      salaire: "€65k-€80k",
      statut: "active",
      datePublication: "15 Jan 2024",
      dateExpiration: "15 Fév 2024",
      candidatures: 24,
      vues: 156,
      priorite: "haute",
      tags: ["React", "TypeScript", "Node.js"],
    },
    {
      id: 2,
      titre: "Product Manager",
      entreprise: "StartUpXYZ",
      lieu: "Remote",
      type: "CDI",
      salaire: "€70k-€85k",
      statut: "active",
      datePublication: "12 Jan 2024",
      dateExpiration: "12 Fév 2024",
      candidatures: 18,
      vues: 89,
      priorite: "moyenne",
      tags: ["Product", "Agile", "SaaS"],
    },
    {
      id: 3,
      titre: "DevOps Engineer",
      entreprise: "CloudSystems",
      lieu: "Lyon, France",
      type: "Freelance",
      salaire: "€60k-€75k",
      statut: "en attente",
      datePublication: "10 Jan 2024",
      dateExpiration: "10 Fév 2024",
      candidatures: 12,
      vues: 67,
      priorite: "basse",
      tags: ["AWS", "Docker", "Kubernetes"],
    },
    {
      id: 4,
      titre: "UX Designer",
      entreprise: "DesignLab",
      lieu: "Bordeaux, France",
      type: "CDD",
      salaire: "€55k-€70k",
      statut: "expiree",
      datePublication: "05 Jan 2024",
      dateExpiration: "05 Fév 2024",
      candidatures: 32,
      vues: 145,
      priorite: "moyenne",
      tags: ["Figma", "UI/UX", "Prototype"],
    },
    {
      id: 5,
      titre: "Data Scientist",
      entreprise: "DataTech",
      lieu: "Remote",
      type: "CDI",
      salaire: "€75k-€90k",
      statut: "active",
      datePublication: "18 Jan 2024",
      dateExpiration: "18 Fév 2024",
      candidatures: 8,
      vues: 42,
      priorite: "haute",
      tags: ["Python", "Machine Learning", "SQL"],
    },
    {
      id: 6,
      titre: "Marketing Manager",
      entreprise: "GrowthInc",
      lieu: "Paris, France",
      type: "CDI",
      salaire: "€60k-€75k",
      statut: "archivee",
      datePublication: "20 Déc 2023",
      dateExpiration: "20 Jan 2024",
      candidatures: 45,
      vues: 210,
      priorite: "basse",
      tags: ["Marketing", "SEO", "Content"],
    },
  ];

  // Statistiques des offres
  const statsOffres = [
    {
      title: "Offres actives",
      value: "3",
      change: "+1",
      trend: "up",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Candidatures totales",
      value: "139",
      change: "+24",
      trend: "up",
      icon: Users,
      color: "blue",
    },
  ];

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "en attente":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "expiree":
        return "bg-red-100 text-red-800 border-red-200";
      case "archivee":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir la couleur de la priorité
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "haute":
        return "bg-red-100 text-red-800";
      case "moyenne":
        return "bg-amber-100 text-amber-800";
      case "basse":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filtrer les offres
  const filteredOffres = offresEmplois.filter((offre) => {
    const matchesSearch =
      offre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.entreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.lieu.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || offre.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex flex-col w-full p-4 overflow-auto lg:p-8">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 mb-8 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Offres d'emplois
          </h1>
          <p className="text-muted-foreground">
            Gérez et suivez vos offres d'emplois publiées
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle offre
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="flex flex-col flex-wrap gap-3 mb-3 md:flex-row">
        {statsOffres.map((stat, index) => {
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
                  placeholder="Rechercher une offre, entreprise ou lieu..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actives</SelectItem>
                  <SelectItem value="en attente">En attente</SelectItem>
                  <SelectItem value="expiree">Expirées</SelectItem>
                  <SelectItem value="archivee">Archivées</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="cdi">CDI</SelectItem>
                  <SelectItem value="cdd">CDD</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des offres */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des offres</CardTitle>
              <CardDescription>
                {filteredOffres.length} offres trouvées
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-2">
              <Briefcase className="w-3 h-3" />
              {offresEmplois.length} offres au total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offre</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead>Type/Salaire</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Candidatures</TableHead>
                <TableHead>Date d'expiration</TableHead>
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
                        Chargement des offres...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredOffres.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Briefcase className="w-12 h-12 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Aucune offre trouvée
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOffres.map((offre) => (
                  <TableRow key={offre.id} className="hover:bg-accent/50">
                    <TableCell>
                      <div>
                        <h4 className="font-semibold">{offre.titre}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {offre.lieu}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {offre.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {offre.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{offre.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                          <Building className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium">{offre.entreprise}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className="mb-1">
                          {offre.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="w-3 h-3" />
                          {offre.salaire}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant="outline"
                          className={`w-fit ${getStatusColor(offre.statut)}`}
                        >
                          {offre.statut === "active"
                            ? "Active"
                            : offre.statut === "en attente"
                              ? "En attente"
                              : offre.statut === "expiree"
                                ? "Expirée"
                                : "Archivée"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`w-fit text-xs ${getPriorityColor(offre.priorite)}`}
                        >
                          {offre.priorite} priorité
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {offre.candidatures}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {offre.vues} vues
                          </span>
                        </div>
                        <Progress
                          value={(offre.candidatures / offre.vues) * 100}
                          className="h-2"
                        />
                        <span className="text-xs text-muted-foreground">
                          {((offre.candidatures / offre.vues) * 100).toFixed(1)}
                          % de conversion
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{offre.dateExpiration}</span>
                        <span className="text-xs text-muted-foreground">
                          Publiée le {offre.datePublication}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                            <Eye className="w-4 h-4" />
                            Voir l'offre
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Users className="w-4 h-4" />
                            Voir candidatures
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="w-4 h-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            Publier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-red-600">
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default OffresEmploisPage;
