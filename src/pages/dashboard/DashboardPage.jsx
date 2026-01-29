// pages/dashboard/DashboardPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Calendar,
  FileText,
  MessageSquare,
  Bell,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Search,
  Filter,
  Target,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/dashboard/Sidebar";

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [isLoading, setIsLoading] = useState(true);

  // Simuler le chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Données des cartes de statistiques
  const statsCards = [
    {
      title: "Vues du profil",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Eye,
      color: "blue",
      description: "Depuis le mois dernier",
    },
    {
      title: "Candidatures actives",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Briefcase,
      color: "green",
      description: "En cours d'évaluation",
    },
    {
      title: "Messages non lus",
      value: "5",
      change: "-3",
      trend: "down",
      icon: MessageSquare,
      color: "purple",
      description: "À répondre",
    },
    {
      title: "Revenu estimé",
      value: "4 250 000 €",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "amber",
      description: "Ce mois-ci",
    },
  ];

  // Projets/Offres récents
  const recentProjects = [
    {
      id: 1,
      title: "Développeur React Senior",
      company: "TechCorp",
      status: "active",
      progress: 75,
      date: "15 Jan 2024",
      salary: "€65k-€80k",
      type: "CDI",
    },
    {
      id: 2,
      title: "Product Manager",
      company: "StartUpXYZ",
      status: "review",
      progress: 40,
      date: "12 Jan 2024",
      salary: "€70k-€85k",
      type: "CDI",
    },
    {
      id: 3,
      title: "DevOps Engineer",
      company: "CloudSystems",
      status: "pending",
      progress: 20,
      date: "10 Jan 2024",
      salary: "€60k-€75k",
      type: "Freelance",
    },
    {
      id: 4,
      title: "UX Designer",
      company: "DesignLab",
      status: "completed",
      progress: 100,
      date: "05 Jan 2024",
      salary: "€55k-€70k",
      type: "CDD",
    },
  ];

  // Activités récentes
  const recentActivities = [
    {
      id: 1,
      type: "application",
      title: "Candidature envoyée",
      description: "Développeur Full Stack chez DigitalCorp",
      time: "Il y a 2 heures",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      id: 2,
      type: "message",
      title: "Nouveau message",
      description: "De Sarah Martin (Recruteuse)",
      time: "Il y a 4 heures",
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      id: 3,
      type: "view",
      title: "Profil consulté",
      description: "Par TechRecruit LLC",
      time: "Il y a 1 jour",
      icon: Eye,
      color: "text-amber-500",
    },
    {
      id: 4,
      type: "document",
      title: "Document mis à jour",
      description: "CV version 3.0 téléchargé",
      time: "Il y a 2 jours",
      icon: FileText,
      color: "text-purple-500",
    },
  ];

  // Candidatures par statut
  const applicationsByStatus = [
    { status: "En attente", count: 3, color: "bg-amber-500" },
    { status: "En revue", count: 2, color: "bg-blue-500" },
    { status: "Entretien", count: 1, color: "bg-purple-500" },
    { status: "Accepté", count: 1, color: "bg-green-500" },
    { status: "Refusé", count: 1, color: "bg-red-500" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case "review":
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case "pending":
        return <div className="w-2 h-2 rounded-full bg-amber-500" />;
      case "completed":
        return <div className="w-2 h-2 bg-purple-500 rounded-full" />;
      default:
        return null;
    }
  };

  return (
      <div>
        {/* Contenu principal */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Cartes de statistiques */}
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} variant="flat" className="max-w-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center justify-center w-full">
                        <div className={`p-2 m-auto rounded-lg bg-${stat.color}-100 mb-2`}>
                            <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <div className="flex items-baseline gap-2 mt-2">
                          <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Section inférieure */}
          <div className="grid gap-6 mt-6 lg:grid-cols-3">
            {/* Statut des candidatures */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Statut des candidatures</CardTitle>
                <CardDescription>Répartition par statut</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationsByStatus.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.status}</span>
                        <span className="text-sm font-bold">{item.count}</span>
                      </div>
                      <Progress
                        value={(item.count / 8) * 100}
                        className={`h-2 ${item.color}`}
                      />
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total des candidatures</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +2 cette semaine
                  </Badge>
                </div>
              </CardContent>
            </Card> */}

            {/* Progression du profil */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Progression du profil</CardTitle>
                <CardDescription>Complétez votre profil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">85% complété</span>
                    <span className="text-sm text-muted-foreground">17/20 sections</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  {[
                    { task: "Photo de profil", completed: true },
                    { task: "Expérience professionnelle", completed: true },
                    { task: "Compétences", completed: true },
                    { task: "Documents", completed: false },
                    { task: "Préférences", completed: true },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500" />
                        )}
                        <span className="text-sm">{item.task}</span>
                      </div>
                      {!item.completed && (
                        <Button variant="outline" size="sm">
                          Compléter
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Améliorer la visibilité
                </Button>
              </CardFooter>
            </Card> */}

            {/* Conseils et recommandations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
                <CardDescription>Optimisez votre profil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border border-blue-100 rounded-lg bg-blue-50">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Activez les notifications</h4>
                        <p className="text-sm text-blue-700">
                          Soyez alerté des nouvelles offres correspondant à votre profil
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-green-100 rounded-lg bg-green-50">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Élargissez votre réseau</h4>
                        <p className="text-sm text-green-700">
                          Connectez-vous avec 5 recruteurs ce mois-ci
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-amber-50 border-amber-100">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-amber-600" />
                      <div>
                        <h4 className="font-medium">Mettez à jour votre CV</h4>
                        <p className="text-sm text-amber-700">
                          Votre CV n'a pas été mis à jour depuis 2 mois
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/dashboard/settings" className="w-full">
                  <Button variant="outline" className="w-full">
                    Voir toutes les recommandations
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
  );
};

export default DashboardPage;