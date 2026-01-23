// JobsPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  ExternalLink,
  Building,
  Users,
  TrendingUp,
  BookOpen,
  Star,
  ChevronRight,
  Eye,
  FileText,
  Send,
  Bookmark,
  Share2,
} from "lucide-react";

const JobsPage = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Développeur Full Stack React/Node.js",
      company: "TechSolutions Inc.",
      location: "Yaoundé, Cameroun",
      type: "CDI",
      salary: "800,000 - 1,200,000 XAF",
      experience: "2-3 ans",
      remote: true,
      description: "Nous recherchons un développeur full stack pour rejoindre notre équipe technique et participer au développement d'applications web innovantes.",
      category: "Développement",
      tags: ["React", "Node.js", "MongoDB", "TypeScript"],
      datePosted: "Il y a 2 jours",
      isInternshipAvailable: true,
      companyLogo: "TS"
    },
    {
      id: 2,
      title: "Designer UX/UI Senior",
      company: "DesignCreatives Studio",
      location: "Douala, Cameroun",
      type: "CDD",
      salary: "700,000 - 1,000,000 XAF",
      experience: "3-5 ans",
      remote: true,
      description: "Notre studio créatif recherche un designer UX/UI expérimenté pour concevoir des interfaces utilisateur intuitives et modernes.",
      category: "Design",
      tags: ["Figma", "UI Design", "Prototypage", "User Research"],
      datePosted: "Il y a 3 jours",
      isInternshipAvailable: true,
      companyLogo: "DC"
    },
    {
      id: 3,
      title: "Marketing Digital Manager",
      company: "MarketingBoost Agency",
      location: "Yaoundé, Cameroun",
      type: "CDI",
      salary: "900,000 - 1,400,000 XAF",
      experience: "4-6 ans",
      remote: false,
      description: "Responsable de la stratégie marketing digitale et des campagnes publicitaires pour nos clients internationaux.",
      category: "Marketing",
      tags: ["SEO", "Facebook Ads", "Analytics", "Content Marketing"],
      datePosted: "Il y a 5 jours",
      isInternshipAvailable: false,
      companyLogo: "MB"
    },
    {
      id: 4,
      title: "Commercial B2B",
      company: "LegalEase Consultants",
      location: "Douala, Cameroun",
      type: "CDI",
      salary: "600,000 + Commission",
      experience: "1-2 ans",
      remote: false,
      description: "Développement du portefeuille clients B2B dans le secteur des services juridiques aux entreprises.",
      category: "Commercial",
      tags: ["Vente", "Relation Client", "Négociation", "CRM"],
      datePosted: "Il y a 1 semaine",
      isInternshipAvailable: true,
      companyLogo: "LE"
    },
    {
      id: 5,
      title: "Expert DevOps",
      company: "FinTech Solutions",
      location: "Remote",
      type: "CDI",
      salary: "1,200,000 - 1,800,000 XAF",
      experience: "3-4 ans",
      remote: true,
      description: "Gestion de l'infrastructure cloud et automatisation des processus de déploiement pour nos applications financières.",
      category: "IT & DevOps",
      tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      datePosted: "Il y a 1 semaine",
      isInternshipAvailable: false,
      companyLogo: "FT"
    },
    {
      id: 6,
      title: "Assistant Comptable",
      company: "BuildMaster Construction",
      location: "Yaoundé, Cameroun",
      type: "Stage",
      salary: "Gratification",
      experience: "Étudiant",
      remote: false,
      description: "Stage pour étudiant en comptabilité pour assister notre service comptable dans la gestion des opérations courantes.",
      category: "Comptabilité",
      tags: ["Sage", "Excel", "Comptabilité", "Facturation"],
      datePosted: "Il y a 2 jours",
      isInternshipAvailable: false,
      companyLogo: "BM"
    },
    {
      id: 7,
      title: "Community Manager",
      company: "MarketingBoost Agency",
      location: "Remote",
      type: "CDD",
      salary: "500,000 - 700,000 XAF",
      experience: "1-2 ans",
      remote: true,
      description: "Animation des communautés en ligne et gestion des réseaux sociaux pour nos clients.",
      category: "Marketing",
      tags: ["Social Media", "Content Creation", "Community", "Branding"],
      datePosted: "Il y a 3 jours",
      isInternshipAvailable: true,
      companyLogo: "MB"
    },
    {
      id: 8,
      title: "Développeur Frontend",
      company: "TechSolutions Inc.",
      location: "Douala, Cameroun",
      type: "Alternance",
      salary: "300,000 - 500,000 XAF",
      experience: "0-1 an",
      remote: true,
      description: "Contrat en alternance pour un développeur frontend souhaitant se spécialiser en React et Next.js.",
      category: "Développement",
      tags: ["React", "Next.js", "JavaScript", "CSS"],
      datePosted: "Il y a 4 jours",
      isInternshipAvailable: false,
      companyLogo: "TS"
    }
  ]);

  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showRemoteOnly, setShowRemoteOnly] = useState(false);

  // Catégories disponibles
  const categories = [
    { id: "all", label: "Toutes les catégories", count: jobs.length },
    { id: "Développement", label: "Développement", count: jobs.filter(j => j.category === "Développement").length },
    { id: "Design", label: "Design", count: jobs.filter(j => j.category === "Design").length },
    { id: "Marketing", label: "Marketing", count: jobs.filter(j => j.category === "Marketing").length },
    { id: "Commercial", label: "Commercial", count: jobs.filter(j => j.category === "Commercial").length },
    { id: "IT & DevOps", label: "IT & DevOps", count: jobs.filter(j => j.category === "IT & DevOps").length },
    { id: "Comptabilité", label: "Comptabilité", count: jobs.filter(j => j.category === "Comptabilité").length }
  ];

  // Types de contrats
  const contractTypes = [
    { id: "all", label: "Tous les contrats" },
    { id: "CDI", label: "CDI" },
    { id: "CDD", label: "CDD" },
    { id: "Stage", label: "Stage" },
    { id: "Alternance", label: "Alternance" }
  ];

  // Filtrer les offres
  useEffect(() => {
    let filtered = jobs;

    // Recherche par mot-clé
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    // Filtre remote
    if (showRemoteOnly) {
      filtered = filtered.filter(job => job.remote);
    }

    setFilteredJobs(filtered);
  }, [searchQuery, selectedCategory, showRemoteOnly, jobs]);

  const applyForJob = (jobId) => {
    console.log(`Postuler pour l'offre ${jobId}`);
    // Ici, vous pouvez rediriger vers un formulaire de candidature
  };

  const requestInternship = (jobId) => {
    console.log(`Demander un stage pour l'offre ${jobId}`);
    // Ici, vous pouvez rediriger vers un formulaire de demande de stage
  };

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête */}
      <div className="border-b">
        <div className="container px-4 py-8 mx-auto">
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-semibold">Offres d'emploi</h1>
            <p className="text-muted-foreground">
              Trouvez votre prochaine opportunité professionnelle
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un poste, une entreprise, un mot-clé..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filtres rapides */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              Toutes les catégories
            </Button>
            {categories.slice(1).map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>

          {/* Filtres supplémentaires */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Button
              variant={showRemoteOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowRemoteOnly(!showRemoteOnly)}
            >
              <MapPin className="w-3 h-3 mr-2" />
              Télétravail seulement
            </Button>
            
            <div className="flex items-center gap-2">
              <Filter className="w-3 h-3" />
              <span>Type de contrat :</span>
              <select 
                className="bg-transparent border-none focus:outline-none"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {contractTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Colonne des offres */}
          <div className="lg:w-2/3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">
                  {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} disponible{filteredJobs.length > 1 ? 's' : ''}
                </h2>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground">
                    Résultats pour : "{searchQuery}"
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Offres sauvegardées
                </Button>
              </div>
            </div>

            {/* Liste des offres */}
            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <Card className="border">
                  <CardContent className="pt-6 text-center">
                    <p className="mb-4 text-muted-foreground">Aucune offre ne correspond à vos critères</p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setShowRemoteOnly(false);
                    }}>
                      Réinitialiser les filtres
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredJobs.map((job) => (
                  <Card key={job.id} className="transition-colors border hover:border-primary/50">
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        {/* Logo entreprise */}
                        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded bg-primary/10">
                          <span className="font-semibold text-primary">{job.companyLogo}</span>
                        </div>
                        
                        {/* Contenu de l'offre */}
                        <div className="flex-1">
                          <div className="flex flex-col justify-between gap-2 mb-3 sm:flex-row sm:items-start">
                            <div>
                              <h3 className="mb-1 text-lg font-semibold">{job.title}</h3>
                              <div className="flex items-center gap-3 mb-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Building className="w-3 h-3" />
                                  <span>{job.company}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{job.location}</span>
                                </div>
                                {job.remote && (
                                  <Badge variant="outline" className="text-xs">
                                    Télétravail
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="mb-1 font-semibold text-primary">{job.salary}</div>
                              <div className="text-xs text-muted-foreground">XAF/mois</div>
                            </div>
                          </div>
                          
                          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                            {job.description}
                          </p>
                          
                          {/* Tags et infos */}
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {job.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                <span>{job.type}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{job.experience}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{job.datePosted}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <div className="flex flex-col items-center justify-between w-full gap-3 sm:flex-row">
                        <div className="text-sm text-muted-foreground">
                          <Badge variant="outline" className="mr-2">
                            {job.category}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => applyForJob(job.id)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Voir l'offre
                          </Button>
                          
                          {job.type !== "Stage" && job.isInternshipAvailable && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => requestInternship(job.id)}
                              className="gap-2 text-blue-700 border-blue-300 hover:bg-blue-50"
                            >
                              <GraduationCap className="w-4 h-4" />
                              Demander un stage
                            </Button>
                          )}
                          
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => applyForJob(job.id)}
                            className="gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Postuler
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
            
            {/* Pagination */}
            {filteredJobs.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">← Précédent</Button>
                  <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Suivant →</Button>
                </div>
              </div>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="lg:w-1/3">
            <div className="space-y-6">
              {/* Statistiques */}
              <Card className="border">
                <CardContent className="pt-6">
                  <h3 className="mb-4 font-semibold">Marché de l'emploi</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Offres actives</span>
                      <span className="font-semibold">{jobs.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Entreprises</span>
                      <span className="font-semibold">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Offres en télétravail</span>
                      <span className="font-semibold">{jobs.filter(j => j.remote).length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Stages disponibles</span>
                      <span className="font-semibold">{jobs.filter(j => j.isInternshipAvailable).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conseils */}
              <Card className="border">
                <CardContent className="pt-6">
                  <h3 className="mb-4 font-semibold">Conseils FIBEM</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="mb-1 text-sm font-medium">CV Professionnel</h4>
                        <p className="text-xs text-muted-foreground">
                          Créez votre CV avec notre générateur gratuit
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="mb-1 text-sm font-medium">Préparation entretien</h4>
                        <p className="text-xs text-muted-foreground">
                          Conseils pour réussir vos entretiens
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="mb-1 text-sm font-medium">Formations gratuites</h4>
                        <p className="text-xs text-muted-foreground">
                          Développez vos compétences en ligne
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Entreprises qui recrutent */}
              <Card className="border">
                <CardContent className="pt-6">
                  <h3 className="mb-4 font-semibold">Entreprises qui recrutent</h3>
                  <div className="space-y-3">
                    {Array.from(new Set(jobs.map(j => j.company))).slice(0, 4).map((company, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10">
                            <span className="text-xs font-semibold text-primary">
                              {company.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm">{company}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {jobs.filter(j => j.company === company).length} offre(s)
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Inscription newsletter */}
              <Card className="border">
                <CardContent className="pt-6">
                  <h3 className="mb-4 font-semibold">Recevoir les nouvelles offres</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Soyez informé des nouvelles offres dans votre domaine
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Votre email" />
                    <Button className="w-full gap-2">
                      <Send className="w-4 h-4" />
                      S'inscrire
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Section CTA */}
      <div className="mt-12 border-t">
        <div className="container px-4 py-12 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-4 text-xl font-semibold">Vous recrutez ?</h2>
            <p className="mb-6 text-muted-foreground">
              Publiez vos offres d'emploi et touchez des milliers de talents qualifiés
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2">
                <TrendingUp className="w-5 h-5" />
                Publier une offre
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  Nous contacter
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;