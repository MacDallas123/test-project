import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Calendar,
  Download,
  User,
  Briefcase,
  MapPin,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  ExternalLink,
  Send,
  TrendingUp,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const CandidaturesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Simuler le chargement des données
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Données minimales des candidatures (2 lignes)
  const candidatures = [
    {
      id: "CAND-2024-001",
      candidat: {
        nom: "Martin",
        prenom: "Sophie",
        email: "sophie.martin@example.com",
        telephone: "+33 1 98 76 54 32",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
        cv: "cv_sophie_martin.pdf",
        linkedin: "linkedin.com/in/sophiemartin",
      },
      offre: {
        titre: "Développeur React Senior",
        entreprise: "TechCorp",
        lieu: "Paris",
        type: "CDI",
        salaire: "€65k-€80k",
      },
      dateCandidature: "15 Jan 2024",
      dateEntretien: "20 Jan 2024",
      statut: "entretien",
      source: "Site web",
      notes: "Très bon profil, expérience pertinente",
      documents: ["CV", "Lettre de motivation", "Portfolio"],
      progression: 75,
    },
    {
      id: "CAND-2024-002",
      candidat: {
        nom: "Dubois",
        prenom: "Pierre",
        email: "pierre.dubois@example.com",
        telephone: "+33 1 45 67 89 01",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre",
        cv: "cv_pierre_dubois.pdf",
        linkedin: "linkedin.com/in/pierredubois",
      },
      offre: {
        titre: "Product Manager",
        entreprise: "StartUpXYZ",
        lieu: "Remote",
        type: "CDI",
        salaire: "€70k-€85k",
      },
      dateCandidature: "12 Jan 2024",
      dateEntretien: "18 Jan 2024",
      statut: "nouvelle",
      source: "LinkedIn",
      notes: "À contacter pour un premier entretien",
      documents: ["CV", "Lettre de motivation"],
      progression: 20,
    },
  ];

  // Statistiques simples
  const stats = [
    {
      title: "Nouvelles candidatures",
      value: "1",
      change: "+1",
      trend: "up",
      icon: Clock,
      color: "blue",
    },
    {
      title: "En entretien",
      value: "1",
      change: "0",
      trend: "stable",
      icon: Calendar,
      color: "green",
    },
    {
      title: "Taux de réponse",
      value: "50%",
      change: "+10%",
      trend: "up",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case "nouvelle":
        return "bg-blue-100 text-blue-800";
      case "entretien":
        return "bg-green-100 text-green-800";
      case "acceptée":
        return "bg-emerald-100 text-emerald-800";
      case "refusée":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status) => {
    switch (status) {
      case "nouvelle":
        return <Clock className="w-3 h-3 text-blue-500" />;
      case "entretien":
        return <Calendar className="w-3 h-3 text-green-500" />;
      case "acceptée":
        return <CheckCircle className="w-3 h-3 text-emerald-500" />;
      case "refusée":
        return <XCircle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  // Filtrer les candidatures
  const filteredCandidatures = candidatures.filter((candidature) => {
    const matchesSearch =
      candidature.candidat.nom
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      candidature.candidat.prenom
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      candidature.offre.titre.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || candidature.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Ouvrir les détails
  const openDetail = (candidature) => {
    setSelectedCandidature(candidature);
    setIsDetailOpen(true);
  };

  // Actions rapides
  const updateStatus = (id, newStatus) => {
    console.log(`Mettre à jour la candidature ${id} vers ${newStatus}`);
    // API call ici
  };

  const sendEmail = (email) => {
    console.log(`Envoyer un email à ${email}`);
    // API call ici
  };

  return (
    <main className="flex flex-col w-full p-4 overflow-auto lg:p-8">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 mb-8 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des candidatures
          </h1>
          <p className="text-muted-foreground">
            Suivez et gérez les candidatures reçues
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Button className="gap-2">
            <User className="w-4 h-4" />
            Nouvelle candidature
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <Badge
                        variant={stat.trend === "up" ? "default" : "secondary"}
                        className="gap-1 text-xs"
                      >
                        {stat.trend === "up" ? "↗" : "↘"}
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, prénom ou poste..."
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
                  <SelectItem value="nouvelle">Nouvelles</SelectItem>
                  <SelectItem value="entretien">En entretien</SelectItem>
                  <SelectItem value="acceptée">Acceptées</SelectItem>
                  <SelectItem value="refusée">Refusées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des candidatures */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des candidatures</CardTitle>
              <CardDescription>
                {filteredCandidatures.length} candidatures trouvées
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-2">
              <User className="w-3 h-3" />
              {candidatures.length} candidatures
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
                <p className="text-sm text-muted-foreground">
                  Chargement des candidatures...
                </p>
              </div>
            </div>
          ) : filteredCandidatures.length === 0 ? (
            <div className="py-8 text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <User className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Aucune candidature trouvée
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Offre</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Progression</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidatures.map((candidature) => (
                  <TableRow key={candidature.id} className="hover:bg-accent/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={candidature.candidat.avatar} />
                          <AvatarFallback>
                            {candidature.candidat.prenom[0]}
                            {candidature.candidat.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">
                            {candidature.candidat.prenom}{" "}
                            {candidature.candidat.nom}
                          </h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[180px]">
                              {candidature.candidat.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <h4 className="font-medium">
                          {candidature.offre.titre}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Briefcase className="w-3 h-3" />
                          <span>{candidature.offre.entreprise}</span>
                          <span>•</span>
                          <MapPin className="w-3 h-3" />
                          <span>{candidature.offre.lieu}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          Candidature: {candidature.dateCandidature}
                        </div>
                        {candidature.dateEntretien && (
                          <div className="text-xs text-muted-foreground">
                            Entretien: {candidature.dateEntretien}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(candidature.statut)}
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(candidature.statut)}`}
                        >
                          {candidature.statut === "nouvelle"
                            ? "Nouvelle"
                            : candidature.statut === "entretien"
                              ? "Entretien"
                              : candidature.statut === "acceptée"
                                ? "Acceptée"
                                : "Refusée"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{candidature.progression}%</span>
                        </div>
                        <Progress
                          value={candidature.progression}
                          className="h-2"
                        />
                        <span className="text-xs text-muted-foreground">
                          {candidature.statut === "nouvelle"
                            ? "En attente de traitement"
                            : candidature.statut === "entretien"
                              ? "Entretien programmé"
                              : candidature.statut === "acceptée"
                                ? "Processus terminé"
                                : "Clôturée"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDetail(candidature)}
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
                              onClick={() => openDetail(candidature)}
                            >
                              <Eye className="w-4 h-4" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() =>
                                sendEmail(candidature.candidat.email)
                              }
                            >
                              <Mail className="w-4 h-4" />
                              Envoyer un email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Contacter
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <FileText className="w-4 h-4" />
                              Voir le CV
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 text-green-600"
                              onClick={() =>
                                updateStatus(candidature.id, "acceptée")
                              }
                            >
                              <CheckCircle className="w-4 h-4" />
                              Accepter
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-red-600"
                              onClick={() =>
                                updateStatus(candidature.id, "refusée")
                              }
                            >
                              <XCircle className="w-4 h-4" />
                              Refuser
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Détail modal */}
      {selectedCandidature && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 ${
            isDetailOpen ? "block" : "hidden"
          }`}
          onClick={() => setIsDetailOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-lg shadow-lg bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* En-tête */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold">
                    Détails de la candidature
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedCandidature.id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDetailOpen(false)}
                >
                  ✕
                </Button>
              </div>

              {/* Informations du candidat */}
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informations du candidat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={selectedCandidature.candidat.avatar} />
                      <AvatarFallback>
                        {selectedCandidature.candidat.prenom[0]}
                        {selectedCandidature.candidat.nom[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-bold">
                        {selectedCandidature.candidat.prenom}{" "}
                        {selectedCandidature.candidat.nom}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedCandidature.candidat.email}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedCandidature.candidat.telephone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 gap-2">
                      <FileText className="w-4 h-4" />
                      Voir le CV
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <ExternalLink className="w-4 h-4" />
                      LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Informations de l'offre */}
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informations de l'offre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Poste
                      </Label>
                      <p className="font-medium">
                        {selectedCandidature.offre.titre}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Entreprise
                        </Label>
                        <p className="font-medium">
                          {selectedCandidature.offre.entreprise}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Lieu
                        </Label>
                        <p className="font-medium">
                          {selectedCandidature.offre.lieu}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Type
                        </Label>
                        <p className="font-medium">
                          {selectedCandidature.offre.type}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Salaire
                        </Label>
                        <p className="font-medium">
                          {selectedCandidature.offre.salaire}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statut et progression */}
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Suivi de la candidature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Statut</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(selectedCandidature.statut)}
                          <Badge
                            className={`${getStatusColor(selectedCandidature.statut)}`}
                          >
                            {selectedCandidature.statut}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Progression</p>
                        <p className="mt-1 text-2xl font-bold">
                          {selectedCandidature.progression}%
                        </p>
                      </div>
                    </div>

                    <Progress
                      value={selectedCandidature.progression}
                      className="h-2"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Date de candidature
                        </Label>
                        <p className="font-medium">
                          {selectedCandidature.dateCandidature}
                        </p>
                      </div>
                      {selectedCandidature.dateEntretien && (
                        <div>
                          <Label className="text-sm text-muted-foreground">
                            Date d'entretien
                          </Label>
                          <p className="font-medium">
                            {selectedCandidature.dateEntretien}
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedCandidature.notes && (
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Notes
                        </Label>
                        <p className="p-3 mt-1 border rounded-lg bg-accent/50">
                          {selectedCandidature.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedCandidature.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span>{doc}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDetailOpen(false)}
                >
                  Fermer
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Send className="w-4 h-4" />
                  Contacter
                </Button>
                <Button className="flex-1 gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Accepter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

// Composant Label pour le modal
const Label = ({ children, className = "" }) => (
  <label className={`block text-sm font-medium ${className}`}>{children}</label>
);

export default CandidaturesPage;
