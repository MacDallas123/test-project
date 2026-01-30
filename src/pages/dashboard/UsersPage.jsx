import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  Calendar,
  TrendingUp,
  Lock,
  Unlock,
  CreditCard,
  Building,
  ChevronDown,
  ChevronUp,
  Clock,
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
import { Switch } from "@/components/ui/switch";
import UserDetailsDialog from "@/components/dialog/UserDetailsDialog";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);

  // Simuler le chargement des données
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Données des utilisateurs
  const utilisateurs = [
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@example.com",
      telephone: "+33 1 23 45 67 89",
      role: "admin",
      statut: "actif",
      dateInscription: "15 Jan 2024",
      derniereConnexion: "Aujourd'hui, 09:30",
      compteVerifie: true,
      abonnement: "Premium",
      entreprise: "TechCorp",
      //avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
      avatar: "",
      stats: {
        candidatures: 12,
        offresPostees: 8,
        messages: 24,
        satisfaction: 4.5,
      },
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Sophie",
      email: "sophie.martin@example.com",
      telephone: "+33 1 98 76 54 32",
      role: "candidat",
      statut: "actif",
      dateInscription: "12 Jan 2024",
      derniereConnexion: "Hier, 14:20",
      compteVerifie: true,
      abonnement: "Gratuit",
      entreprise: null,
      //avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      avatar: "",
      stats: {
        candidatures: 5,
        offresPostees: 0,
        messages: 8,
        satisfaction: 4.2,
      },
    },
    {
      id: 3,
      nom: "Dubois",
      prenom: "Pierre",
      email: "pierre.dubois@example.com",
      telephone: "+33 1 45 67 89 01",
      role: "recruteur",
      statut: "inactif",
      dateInscription: "10 Jan 2024",
      derniereConnexion: "Il y a 5 jours",
      compteVerifie: true,
      abonnement: "Pro",
      entreprise: "CloudSystems",
      // avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre",
      avatar: "",
      stats: {
        candidatures: 0,
        offresPostees: 3,
        messages: 15,
        satisfaction: 4.0,
      },
    },
    {
      id: 4,
      nom: "Leroy",
      prenom: "Marie",
      email: "marie.leroy@example.com",
      telephone: "+33 1 23 98 76 54",
      role: "candidat",
      statut: "suspendu",
      dateInscription: "05 Jan 2024",
      derniereConnexion: "Il y a 2 semaines",
      compteVerifie: false,
      abonnement: "Gratuit",
      entreprise: null,
      // avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
      avatar: "",
      stats: {
        candidatures: 8,
        offresPostees: 0,
        messages: 3,
        satisfaction: 3.8,
      },
    },
    {
      id: 5,
      nom: "Moreau",
      prenom: "Thomas",
      email: "thomas.moreau@example.com",
      telephone: "+33 1 54 32 10 98",
      role: "admin",
      statut: "actif",
      dateInscription: "18 Jan 2024",
      derniereConnexion: "Aujourd'hui, 11:45",
      compteVerifie: true,
      abonnement: "Premium",
      entreprise: "DataTech",
      // avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
      avatar: "",
      stats: {
        candidatures: 0,
        offresPostees: 15,
        messages: 42,
        satisfaction: 4.7,
      },
    },
    {
      id: 6,
      nom: "Garcia",
      prenom: "Luis",
      email: "luis.garcia@example.com",
      telephone: "+34 91 23 45 67",
      role: "candidat",
      statut: "actif",
      dateInscription: "20 Déc 2023",
      derniereConnexion: "Il y a 2 jours",
      compteVerifie: true,
      abonnement: "Pro",
      entreprise: null,
      // avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luis",
      avatar: "",
      stats: {
        candidatures: 18,
        offresPostees: 0,
        messages: 12,
        satisfaction: 4.3,
      },
    },
    {
      id: 7,
      nom: "Kowalski",
      prenom: "Anna",
      email: "anna.kowalski@example.com",
      telephone: "+48 22 123 45 67",
      role: "recruteur",
      statut: "actif",
      dateInscription: "25 Déc 2023",
      derniereConnexion: "Hier, 16:30",
      compteVerifie: true,
      abonnement: "Premium",
      entreprise: "DesignLab",
      // avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
      avatar: "",
      stats: {
        candidatures: 0,
        offresPostees: 6,
        messages: 28,
        satisfaction: 4.6,
      },
    },
    {
      id: 8,
      nom: "Chen",
      prenom: "Wei",
      email: "wei.chen@example.com",
      telephone: "+86 10 1234 5678",
      role: "candidat",
      statut: "en attente",
      dateInscription: "28 Déc 2023",
      derniereConnexion: "Jamais",
      compteVerifie: false,
      abonnement: "Gratuit",
      entreprise: null,
      // avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wei",
      avatar: "",
      stats: {
        candidatures: 0,
        offresPostees: 0,
        messages: 0,
        satisfaction: 0,
      },
    },
  ];

  // Statistiques des utilisateurs
  const statsUtilisateurs = [
    {
      title: "Utilisateurs actifs",
      value: "5",
      change: "+2",
      trend: "up",
      icon: UserCheck,
      color: "green",
      percentage: "62.5%",
    },
    {
      title: "Nouveaux (30j)",
      value: "8",
      change: "+3",
      trend: "up",
      icon: TrendingUp,
      color: "blue",
      percentage: "100%",
    },
    {
      title: "Utilisateurs bloqués",
      value: "3",
      change: "-1",
      trend: "down",
      icon: UserX,
      color: "amber",
      percentage: "37.5%",
    },
  ];

  // Répartition par rôle
  const repartitionRoles = [
    { role: "Candidats", count: 4, color: "bg-blue-500", percentage: 50 },
    { role: "Recruteurs", count: 2, color: "bg-green-500", percentage: 25 },
    {
      role: "Administrateurs",
      count: 2,
      color: "bg-purple-500",
      percentage: 25,
    },
  ];

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case "actif":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactif":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "suspendu":
        return "bg-red-100 text-red-800 border-red-200";
      case "en attente":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir la couleur du rôle
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "recruteur":
        return "bg-green-100 text-green-800";
      case "candidat":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status) => {
    switch (status) {
      case "actif":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "inactif":
        return <Clock className="w-3 h-3 text-amber-500" />;
      case "suspendu":
        return <XCircle className="w-3 h-3 text-red-500" />;
      case "en attente":
        return <Clock className="w-3 h-3 text-gray-500" />;
      default:
        return null;
    }
  };

  // Filtrer les utilisateurs
  const filteredUsers = utilisateurs.filter((user) => {
    const matchesSearch =
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.entreprise?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.statut === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Ouvrir les détails d'un utilisateur
  const openUserDetail = (user) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
  };

  // Actions sur les utilisateurs
  const toggleUserStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "actif" ? "suspendu" : "actif";
    console.log(`Changer le statut de l'utilisateur ${userId} à ${newStatus}`);
    // Ici, vous appelleriez votre API
  };

  const verifyUser = (userId) => {
    console.log(`Vérifier l'utilisateur ${userId}`);
    // Ici, vous appelleriez votre API
  };

  const deleteUser = (userId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      console.log(`Supprimer l'utilisateur ${userId}`);
      // Ici, vous appelleriez votre API
    }
  };

  return (
    <main className="flex flex-col w-full p-4 overflow-auto lg:p-8">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 mb-8 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des utilisateurs
          </h1>
          <p className="text-muted-foreground">
            Gérez les comptes, rôles et permissions des utilisateurs
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nouvel utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                <DialogDescription>
                  Créez un nouveau compte utilisateur. Les informations de
                  connexion seront envoyées par email.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-nom">Nom</Label>
                    <Input id="new-nom" placeholder="Dupont" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-prenom">Prénom</Label>
                    <Input id="new-prenom" placeholder="Jean" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-email">Email</Label>
                  <Input
                    id="new-email"
                    type="email"
                    placeholder="jean.dupont@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-role">Rôle</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candidat">Candidat</SelectItem>
                      <SelectItem value="recruteur">Recruteur</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Créer l'utilisateur</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="flex flex-col flex-wrap gap-3 mb-3 md:flex-row">
        {statsUtilisateurs.map((stat, index) => {
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
                      {stat.percentage}
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
                  placeholder="Rechercher par nom, prénom, email..."
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
                  <SelectItem value="actif">Actifs</SelectItem>
                  <SelectItem value="inactif">Inactifs</SelectItem>
                  <SelectItem value="suspendu">Suspendus</SelectItem>
                  <SelectItem value="en attente">En attente</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <User className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="candidat">Candidats</SelectItem>
                  <SelectItem value="recruteur">Recruteurs</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setRoleFilter("all");
                }}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des utilisateurs */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des utilisateurs</CardTitle>
              <CardDescription>
                {filteredUsers.length} utilisateurs trouvés sur{" "}
                {utilisateurs.length}
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-2">
              <User className="w-3 h-3" />
              {utilisateurs.length} utilisateurs
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rôle & Abonnement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Activité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
                      <p className="text-sm text-muted-foreground">
                        Chargement des utilisateurs...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <User className="w-12 h-12 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Aucun utilisateur trouvé
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-accent/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.prenom[0]}
                            {user.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">
                            {user.prenom} {user.nom}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {user.compteVerifie ? (
                              <Badge
                                variant="outline"
                                className="gap-1 text-xs"
                              >
                                <Shield className="w-2.5 h-2.5" />
                                Vérifié
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-xs bg-amber-50 text-amber-700"
                              >
                                Non vérifié
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span>{user.telephone}</span>
                        </div>
                        {user.entreprise && (
                          <div className="flex items-center gap-2 text-sm">
                            <Building className="w-3 h-3 text-muted-foreground" />
                            <span>{user.entreprise}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant="outline"
                          className={`w-fit ${getRoleColor(user.role)}`}
                        >
                          {user.role === "admin"
                            ? "Administrateur"
                            : user.role === "recruteur"
                              ? "Recruteur"
                              : "Candidat"}
                        </Badge>
                        <Badge variant="outline" className="text-xs w-fit">
                          <CreditCard className="w-2.5 h-2.5 mr-1" />
                          {user.abonnement}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.statut)}
                        <Badge
                          variant="outline"
                          className={`w-fit ${getStatusColor(user.statut)}`}
                        >
                          {user.statut === "actif"
                            ? "Actif"
                            : user.statut === "inactif"
                              ? "Inactif"
                              : user.statut === "suspendu"
                                ? "Suspendu"
                                : "En attente"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span>Inscrit le {user.dateInscription}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Dernière connexion: {user.derniereConnexion}
                        </div>
                        {user.stats.candidatures > 0 && (
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <span className="font-medium">
                              {user.stats.candidatures} candidatures
                            </span>
                            {user.stats.offresPostees > 0 && (
                              <span className="text-muted-foreground">
                                • {user.stats.offresPostees} offres
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openUserDetail(user)}
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
                              onClick={() => openUserDetail(user)}
                            >
                              <Eye className="w-4 h-4" />
                              Voir le profil
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" />
                              Modifier
                            </DropdownMenuItem>
                            {!user.compteVerifie && (
                              <DropdownMenuItem
                                className="gap-2 text-green-600"
                                onClick={() => verifyUser(user.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Vérifier le compte
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="gap-2"
                              onClick={() =>
                                toggleUserStatus(user.id, user.statut)
                              }
                            >
                              {user.statut === "actif" ? (
                                <>
                                  <Lock className="w-4 h-4" />
                                  Suspendre
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-4 h-4" />
                                  Activer
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 text-red-600"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </DropdownMenuItem>
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

      {/* Section inférieure */}
      <div className="grid gap-6 mt-6 lg:grid-cols-3">
        {/* Répartition par rôle */}
        {/* <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Répartition des utilisateurs</CardTitle>
            <CardDescription>Par rôle et par statut</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="mb-4 font-medium">Par rôle</h4>
                <div className="space-y-4">
                  {repartitionRoles.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm font-medium">{item.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{item.count}</span>
                          <span className="text-sm text-muted-foreground">({item.percentage}%)</span>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="mb-4 font-medium">Par statut</h4>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    { status: "Actifs", count: 5, color: "bg-green-500" },
                    { status: "Inactifs", count: 1, color: "bg-amber-500" },
                    { status: "Suspendus", count: 1, color: "bg-red-500" },
                    { status: "En attente", count: 1, color: "bg-gray-500" },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center p-4 border rounded-lg">
                      <div className={`w-4 h-4 rounded-full ${item.color} mb-2`}></div>
                      <span className="text-2xl font-bold">{item.count}</span>
                      <span className="text-sm text-muted-foreground">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Derniers inscrits */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Derniers inscrits</CardTitle>
            <CardDescription>Nouveaux utilisateurs (7 derniers jours)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {utilisateurs
                .sort((a, b) => new Date(b.dateInscription) - new Date(a.dateInscription))
                .slice(0, 4)
                .map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.prenom[0]}{user.nom[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-sm font-medium">{user.prenom} {user.nom}</h4>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{user.dateInscription}</div>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {user.statut}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
            <Button variant="outline" className="w-full gap-2 mt-4">
              <User className="w-4 h-4" />
              Voir tous les utilisateurs
            </Button>
          </CardContent>
        </Card> */}
      </div>

      {/* Modal de détail utilisateur */}
      <UserDetailsDialog
        isUserDetailOpen={isUserDetailOpen}
        setIsUserDetailOpen={setIsUserDetailOpen}
        selectedUser={selectedUser}
        getStatusColor={getStatusColor}
        getRoleColor={getRoleColor}
        toggleUserStatus={toggleUserStatus}
      />
    </main>
  );
};

export default UsersPage;
