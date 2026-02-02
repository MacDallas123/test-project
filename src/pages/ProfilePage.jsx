// ProfilePage.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building,
  DollarSign,
  FileText,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Heart,
  Car,
  GraduationCap,
  Award,
  Contact,
  Shield,
  Calendar,
  X,
  Check,
  Trash2,
  Download,
  Plus,
  Edit,
  Save,
  Camera,
  Key,
  Users,
  Target,
  Paperclip,
  File,
  CreditCard,
  TagIcon,
} from "lucide-react";
import Logo from "@/assets/logo_fibem3.jpg";
import { useLanguage } from "@/context/LanguageContext";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "CV.pdf",
      type: "CV",
      size: "2.4 MB",
      uploaded: "2024-01-15",
    },
    {
      id: 2,
      name: "CIN_recto.jpg",
      type: "Identité",
      size: "1.2 MB",
      uploaded: "2024-01-15",
    },
    {
      id: 3,
      name: "CIN_verso.jpg",
      type: "Identité",
      size: "1.1 MB",
      uploaded: "2024-01-15",
    },
    {
      id: 4,
      name: "Diplome_Master.pdf",
      type: "Diplôme",
      size: "3.5 MB",
      uploaded: "2024-01-10",
    },
  ]);
  const [leisureCenters, setLeisureCenters] = useState([
    "Football",
    "Lecture",
    "Voyage",
  ]);
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Mr AAA",
      relationship: "Colègue",
      phone: "+33 6 12 34 56 78",
    },
    {
      id: 2,
      name: "Mme BBB",
      relationship: "Superieur",
      phone: "+33 6 23 45 67 89",
    },
  ]);
  const { t } = useLanguage();

  // Schéma de validation pour les informations personnelles
  const personalInfoSchema = z.object({
    firstName: z
      .string()
      .min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
    lastName: z
      .string()
      .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
    email: z.string().email({ message: "Format d'email invalide" }),
    phone: z
      .string()
      .regex(/^[\+]?[0-9\s\-\(\)]{10,}$/, {
        message: "Format de téléphone invalide",
      }),
    accountType: z.string(),
    language: z.string(),
    company: z.string().optional(),
    position: z.string().optional(),
    salary: z.string().optional(),
    bio: z
      .string()
      .max(500, {
        message: "La biographie ne peut pas dépasser 500 caractères",
      })
      .optional(),
  });

  // Schéma de validation pour le mot de passe
  const passwordSchema = z
    .object({
      currentPassword: z
        .string()
        .min(1, { message: "Le mot de passe actuel est requis" }),
      newPassword: z
        .string()
        .min(8, {
          message: "Le mot de passe doit contenir au moins 8 caractères",
        })
        .regex(/[A-Z]/, { message: "Au moins une majuscule" })
        .regex(/[a-z]/, { message: "Au moins une minuscule" })
        .regex(/[0-9]/, { message: "Au moins un chiffre" })
        .regex(/[^A-Za-z0-9]/, { message: "Au moins un caractère spécial" }),
      confirmPassword: z
        .string()
        .min(1, { message: "La confirmation est requise" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    });

  // Initialisation des formulaires
  const personalForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "AAA",
      lastName: "BBBB",
      email: "contact@example.com",
      phone: "+33 6 12 34 56 78",
      accountType: "candidat",
      language: "fr",
      company: "FIBEM Corp",
      position: "Développeur Full Stack",
      salary: "45000",
      bio: "Développeur passionné avec 5 ans d'expérience dans le développement web. Spécialisé en React et Node.js.",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    mobility: "local",
    experienceYears: "5",
    noticePeriod: "1",
    availability: "immediate",
    workType: "full-time",
    salaryVisible: false,
    profileVisible: true,
  });

  // Types de documents
  const documentTypes = [
    { value: "CV", label: "Curriculum Vitae", icon: FileText },
    { value: "identity", label: "Pièce d'identité", icon: CreditCard },
    { value: "vital", label: "Carte Vitale", icon: TagIcon },
    { value: "license", label: "Permis de conduire", icon: Car },
    { value: "diploma", label: "Diplôme", icon: GraduationCap },
    { value: "certificate", label: "Certificat de travail", icon: Award },
    { value: "other", label: "Autre document", icon: File },
  ];

  // Mobilité géographique
  const mobilityOptions = [
    { value: "local", label: "Local (20km)", icon: MapPin },
    { value: "region", label: "Régional", icon: MapPin },
    { value: "national", label: "National", icon: MapPin },
    { value: "international", label: "International", icon: Globe },
  ];

  // Types de travail
  const workTypes = [
    { value: "full-time", label: "Temps plein" },
    { value: "part-time", label: "Temps partiel" },
    { value: "freelance", label: "Freelance" },
    { value: "contract", label: "Contrat" },
    { value: "internship", label: "Stage" },
  ];

  // Soumission des informations personnelles
  const handlePersonalSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Informations mises à jour:", data);
      // API call would go here
    } finally {
      setIsLoading(false);
    }
  };

  // Soumission du changement de mot de passe
  const handlePasswordSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Mot de passe changé");
      passwordForm.reset();
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion des centres d'intérêt
  const [newLeisureCenter, setNewLeisureCenter] = useState("");
  const addLeisureCenter = () => {
    if (
      newLeisureCenter.trim() &&
      !leisureCenters.includes(newLeisureCenter.trim())
    ) {
      setLeisureCenters([...leisureCenters, newLeisureCenter.trim()]);
      setNewLeisureCenter("");
    }
  };

  const removeLeisureCenter = (index) => {
    setLeisureCenters(leisureCenters.filter((_, i) => i !== index));
  };

  // Gestion des contacts
  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    phone: "",
  });
  const addContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      setContacts([...contacts, { ...newContact, id: contacts.length + 1 }]);
      setNewContact({ name: "", relationship: "", phone: "" });
    }
  };

  const removeContact = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  // Gestion des documents
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newDoc = {
        id: documents.length + 1,
        name: file.name,
        type: "other",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploaded: new Date().toISOString().split("T")[0],
      };
      setDocuments([...documents, newDoc]);
    }
  };

  const removeDocument = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  // Vérification de la force du mot de passe
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "Vide" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const labels = [
      "Très faible",
      "Faible",
      "Moyen",
      "Bon",
      "Très bon",
      "Excellent",
    ];
    return { score, label: labels[Math.min(score, 5)] };
  };

  const passwordStrength = getPasswordStrength(
    passwordForm.watch("newPassword"),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        {/* En-tête */}
        <div className="flex flex-col gap-6 px-4 mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion du Profil</h1>
            <p className="text-muted-foreground">
              Gérez vos informations personnelles et professionnelles
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <p className="font-medium">
                Compte {personalForm.watch("accountType")}
              </p>
              <p className="text-muted-foreground">Membre depuis Janv. 2023</p>
            </div>
            <Avatar className="w-12 h-12 border">
              {/* <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jean" /> */}
              <AvatarImage src="" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* <div className="grid gap-8 lg:grid-cols-3"> */}
        <div className="flex justify-center">
          {/* Colonne latérale - Navigation */}
          {/* <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Informations Personnelles</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent">
                    <Key className="w-5 h-5" />
                    <span className="font-medium">Sécurité & Mot de passe</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">Préférences Professionnelles</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">Documents & Pièces jointes</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Contacts d'urgence</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Confidentialité</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="mb-2 font-medium">Statut du profil</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Profil visible</span>
                    <Switch checked={additionalInfo.profileVisible} />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-muted-foreground">Salaire visible</span>
                    <Switch checked={additionalInfo.salaryVisible} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div> */}

          {/* Colonne principale - Contenu */}
          {/* <div className="lg:col-span-2"> */}
          <div className="min-w-full md:min-w-2xl">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full h-auto grid-cols-2 gap-2 sm:grid-cols-4">
                <TabsTrigger
                  value="personal"
                  className="flex items-center gap-2 px-2 py-2 text-xs sm:text-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Personnelles</span>
                  <span className="sm:hidden">Perso</span>
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="flex items-center gap-2 px-2 py-2 text-xs sm:text-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">Mot de passe</span>
                  <span className="sm:hidden">Mot de passe</span>
                </TabsTrigger>
                <TabsTrigger
                  value="professional"
                  className="flex items-center gap-2 px-2 py-2 text-xs sm:text-sm"
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="hidden sm:inline">Professionnel</span>
                  <span className="sm:hidden">Pro</span>
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="flex items-center gap-2 px-2 py-2 text-xs sm:text-sm"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="hidden sm:inline">Documents</span>
                  <span className="sm:hidden">Docs</span>
                </TabsTrigger>
              </TabsList>

              {/* Onglet 1: Informations personnelles */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations Personnelles</CardTitle>
                    <CardDescription>
                      Gérez vos informations de base et vos préférences
                    </CardDescription>
                  </CardHeader>
                  <form
                    onSubmit={personalForm.handleSubmit(handlePersonalSubmit)}
                  >
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-6">
                        <Avatar className="w-20 h-20 border-2">
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jean" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            <Camera className="w-4 h-4" />
                            Changer la photo
                          </Button>
                          <p className="mt-2 text-xs text-muted-foreground">
                            JPG, PNG ou GIF, max 2MB
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <div className="relative">
                            <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                              <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <Input
                              id="firstName"
                              className="pl-10"
                              {...personalForm.register("firstName")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom</Label>
                          <div className="relative">
                            <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                              <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <Input
                              id="lastName"
                              className="pl-10"
                              {...personalForm.register("lastName")}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <Input
                              id="email"
                              type="email"
                              className="pl-10"
                              {...personalForm.register("email")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <div className="relative">
                            <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <Input
                              id="phone"
                              className="pl-10"
                              {...personalForm.register("phone")}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="accountType">Type de compte</Label>
                          <Select
                            onValueChange={(value) =>
                              personalForm.setValue("accountType", value)
                            }
                            defaultValue={personalForm.getValues("accountType")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="particulier">
                                Particulier
                              </SelectItem>
                              <SelectItem value="candidat">Candidat</SelectItem>
                              <SelectItem value="partenaire">
                                Partenaire
                              </SelectItem>
                              <SelectItem value="entreprise">
                                Entreprise
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="language">Langue préférée</Label>
                          <Select
                            onValueChange={(value) =>
                              personalForm.setValue("language", value)
                            }
                            defaultValue={personalForm.getValues("language")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une langue" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fr">Français</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="zh">中文</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Centres d'intérêt / Loisirs
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {leisureCenters.map((center, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="gap-1"
                            >
                              <Heart className="w-3 h-3" />
                              {center}
                              <button
                                type="button"
                                onClick={() => removeLeisureCenter(index)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newLeisureCenter}
                            onChange={(e) =>
                              setNewLeisureCenter(e.target.value)
                            }
                            placeholder="Ajouter un centre d'intérêt"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={addLeisureCenter}
                            variant="outline"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Biographie</Label>
                        <Textarea
                          id="bio"
                          placeholder="Parlez-nous de vous..."
                          className="min-h-[100px]"
                          {...personalForm.register("bio")}
                        />
                        <p className="text-xs text-muted-foreground">
                          {personalForm.watch("bio")?.length || 0}/500
                          caractères
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="gap-2"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-current rounded-full border-t-transparent animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Enregistrer les modifications
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              {/* Onglet 2: Mot de passe */}
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Changement du mot de passe</CardTitle>
                    <CardDescription>
                      Mettez à jour votre mot de passe pour sécuriser votre
                      compte
                    </CardDescription>
                  </CardHeader>
                  <form
                    onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                  >
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Mot de passe actuel
                        </Label>
                        <div className="relative">
                          <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            {...passwordForm.register("currentPassword")}
                          />
                          <button
                            type="button"
                            className="absolute transform -translate-y-1/2 right-3 top-1/2"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">
                          Nouveau mot de passe
                        </Label>
                        <div className="relative">
                          <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            {...passwordForm.register("newPassword")}
                          />
                          <button
                            type="button"
                            className="absolute transform -translate-y-1/2 right-3 top-1/2"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>

                        {passwordForm.watch("newPassword") && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">
                                Force:{" "}
                                <span
                                  className={`font-medium ${
                                    passwordStrength.score <= 1
                                      ? "text-red-500"
                                      : passwordStrength.score <= 3
                                        ? "text-yellow-500"
                                        : "text-green-500"
                                  }`}
                                >
                                  {passwordStrength.label}
                                </span>
                              </span>
                            </div>
                            <div className="w-full h-1 overflow-hidden bg-gray-200 rounded-full">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  passwordStrength.score <= 1
                                    ? "bg-red-500 w-1/5"
                                    : passwordStrength.score <= 2
                                      ? "bg-red-500 w-2/5"
                                      : passwordStrength.score <= 3
                                        ? "bg-yellow-500 w-3/5"
                                        : passwordStrength.score <= 4
                                          ? "bg-green-500 w-4/5"
                                          : "bg-green-600 w-full"
                                }`}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirmer le nouveau mot de passe
                        </Label>
                        <div className="relative">
                          <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            {...passwordForm.register("confirmPassword")}
                          />
                          <button
                            type="button"
                            className="absolute transform -translate-y-1/2 right-3 top-1/2"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                        {passwordForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-500">
                            {
                              passwordForm.formState.errors.confirmPassword
                                .message
                            }
                          </p>
                        )}
                      </div>

                      <div className="p-4 text-sm border rounded-lg bg-muted/30">
                        <h4 className="mb-2 font-medium">
                          Conseils de sécurité :
                        </h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <Check className="w-3 h-3 text-green-500" />
                            Utilisez au moins 8 caractères
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3 h-3 text-green-500" />
                            Mélangez majuscules, minuscules, chiffres et
                            symboles
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3 h-3 text-green-500" />
                            Évitez les mots de passe courants ou personnels
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="gap-2 mt-2"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-current rounded-full border-t-transparent animate-spin" />
                        ) : (
                          <Key className="w-4 h-4" />
                        )}
                        Mettre à jour le mot de passe
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              {/* Onglet 3: Informations professionnelles */}
              <TabsContent value="professional">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations Professionnelles</CardTitle>
                    <CardDescription>
                      Complétez votre profil professionnel
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="company">Entreprise</Label>
                        <div className="relative">
                          <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <Input
                            id="company"
                            className="pl-10"
                            {...personalForm.register("company")}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position">Poste / Fonction</Label>
                        <div className="relative">
                          <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <Input
                            id="position"
                            className="pl-10"
                            {...personalForm.register("position")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salary">Salaire actuel (€)</Label>
                      <div className="relative">
                        <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <Input
                          id="salary"
                          type="number"
                          className="pl-10"
                          {...personalForm.register("salary")}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Cette information n'apparaîtra pas publiquement
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Mobilité Géographique
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {mobilityOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                              additionalInfo.mobility === option.value
                                ? "border-primary bg-primary/5"
                                : "border-input hover:border-primary/50"
                            }`}
                            onClick={() =>
                              setAdditionalInfo({
                                ...additionalInfo,
                                mobility: option.value,
                              })
                            }
                          >
                            <option.icon
                              className={`w-6 h-6 mb-2 ${
                                additionalInfo.mobility === option.value
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                            <span
                              className={`font-medium ${
                                additionalInfo.mobility === option.value
                                  ? "text-primary"
                                  : ""
                              }`}
                            >
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="experienceYears">
                          Années d'expérience
                        </Label>
                        <Select
                          value={additionalInfo.experienceYears}
                          onValueChange={(value) =>
                            setAdditionalInfo({
                              ...additionalInfo,
                              experienceYears: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(31)].map((_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i === 0
                                  ? "Moins d'un an"
                                  : `${i} an${i > 1 ? "s" : ""}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="workType">
                          Type de travail recherché
                        </Label>
                        <Select
                          value={additionalInfo.workType}
                          onValueChange={(value) =>
                            setAdditionalInfo({
                              ...additionalInfo,
                              workType: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {workTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="availability">Disponibilité</Label>
                        <Select
                          value={additionalInfo.availability}
                          onValueChange={(value) =>
                            setAdditionalInfo({
                              ...additionalInfo,
                              availability: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immédiate</SelectItem>
                            <SelectItem value="1month">1 mois</SelectItem>
                            <SelectItem value="3months">3 mois</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Personnes à contacter
                        </h3>
                        {/* <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter
                        </Button> */}
                      </div>

                      <div className="space-y-3">
                        {contacts.map((contact) => (
                          <div
                            key={contact.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {contact.relationship} • {contact.phone}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeContact(contact.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label htmlFor="contactName">Nom</Label>
                            <Input
                              id="contactName"
                              value={newContact.name}
                              onChange={(e) =>
                                setNewContact({
                                  ...newContact,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Nom complet"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactRelationship">
                              Relation
                            </Label>
                            <Input
                              id="contactRelationship"
                              value={newContact.relationship}
                              onChange={(e) =>
                                setNewContact({
                                  ...newContact,
                                  relationship: e.target.value,
                                })
                              }
                              placeholder="Colègue, Supérieur..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactPhone">Téléphone</Label>
                            <Input
                              id="contactPhone"
                              value={newContact.phone}
                              onChange={(e) =>
                                setNewContact({
                                  ...newContact,
                                  phone: e.target.value,
                                })
                              }
                              placeholder="+33 6 12 34 56 78"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={addContact}
                          className="w-full gap-2 mt-4"
                          variant="outline"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter ce contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="button"
                      className="gap-2"
                      onClick={() =>
                        personalForm.handleSubmit(handlePersonalSubmit)()
                      }
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer les informations
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Onglet 4: Documents */}
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents & Pièces jointes</CardTitle>
                    <CardDescription>
                      Gérez vos documents professionnels et administratifs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Zone de téléchargement */}
                    <div className="p-8 text-center border-2 border-dashed rounded-lg">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="mb-2 text-lg font-semibold">
                        Glissez-déposez vos fichiers
                      </h3>
                      <p className="mb-4 text-muted-foreground">
                        ou cliquez pour parcourir vos fichiers
                      </p>
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <Button asChild variant="outline">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Sélectionner des fichiers
                        </label>
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground">
                        PDF, JPG, PNG jusqu'à 10MB
                      </p>
                    </div>

                    {/* Liste des documents */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Documents téléchargés
                      </h3>

                      <div className="space-y-3">
                        {documents.map((doc) => {
                          const DocIcon =
                            documentTypes.find((d) => d.value === doc.type)
                              ?.icon || File;
                          return (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                  <DocIcon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{doc.name}</p>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <File className="w-3 h-3" />
                                      {doc.type}
                                    </span>
                                    <span>{doc.size}</span>
                                    <span>Téléchargé le {doc.uploaded}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => removeDocument(doc.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Liste des documents requis */}
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h4 className="mb-3 font-medium">
                        Documents recommandés :
                      </h4>
                      <div className="grid gap-3 md:grid-cols-2">
                        {documentTypes.map((docType) => {
                          const hasDocument = documents.some(
                            (d) => d.type === docType.value,
                          );
                          const Icon = docType.icon;
                          return (
                            <div
                              key={docType.value}
                              className="flex items-center gap-3 p-2"
                            >
                              <div
                                className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                                  hasDocument
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {docType.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {hasDocument
                                    ? "Document fourni"
                                    : "Document manquant"}
                                </p>
                              </div>
                              {hasDocument ? (
                                <Check className="w-4 h-4 ml-auto text-green-500" />
                              ) : (
                                <X className="w-4 h-4 ml-auto text-gray-300" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      {documents.length} documents •{" "}
                      {documents
                        .reduce((acc, doc) => {
                          const size = parseFloat(doc.size);
                          return isNaN(size) ? acc : acc + size;
                        }, 0)
                        .toFixed(1)}{" "}
                      MB utilisés
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger tous les documents
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
