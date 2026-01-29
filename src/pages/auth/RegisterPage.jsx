// RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock,
  AlertCircle,
  CheckCircle,
  User,
  Globe,
  Briefcase,
  UserCircle,
  Handshake,
  ArrowRight,
  Building,
  Check,
  X,
} from "lucide-react";
import Logo from "@/assets/logo_fibem3.jpg";
import { useLanguage } from "@/context/LanguageContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  // Schéma de validation avec Zod
  const registerSchema = z.object({
    accountName: z
      .string()
      .min(2, { message: t("register.accountName.tooShort", "Le nom de compte doit contenir au moins 2 caractères") })
      .max(50, { message: t("register.accountName.tooLong", "Le nom de compte est trop long") })
      .regex(/^[a-zA-Z0-9_\-\. ]+$/, { 
        message: t("register.accountName.invalid", "Caractères spéciaux non autorisés (sauf - _ . et espace)") 
      }),

    phone: z
      .string()
      .min(10, { message: t("register.phone.tooShort", "Le numéro de téléphone est trop court") })
      .max(20, { message: t("register.phone.tooLong", "Le numéro de téléphone est trop long") })
      .regex(/^[\+]?[0-9\s\-\(\)]{10,}$/, {
        message: t("register.phone.invalid", "Format international invalide (ex: +33 1 23 45 67 89)"),
      }),

    email: z
      .string()
      .min(1, { message: t("register.email.required", "L'email est requis") })
      .email({ message: t("register.email.invalid", "Format d'email invalide") }),

    accountType: z
      .string()
      .min(1, { message: t("register.accountType.required", "Le type de compte est requis") }),

    preferredLanguage: z
      .string()
      .min(1, { message: t("register.language.required", "La langue préférée est requise") }),

    password: z
      .string()
      .min(8, { message: t("register.password.tooShort", "Le mot de passe doit contenir au moins 8 caractères") })
      .max(50, { message: t("register.password.tooLong", "Le mot de passe est trop long") })
      .regex(/[A-Z]/, { message: t("register.password.uppercase", "Au moins une majuscule") })
      .regex(/[a-z]/, { message: t("register.password.lowercase", "Au moins une minuscule") })
      .regex(/[0-9]/, { message: t("register.password.number", "Au moins un chiffre") })
      .regex(/[^A-Za-z0-9]/, { message: t("register.password.special", "Au moins un caractère spécial") }),

    confirmPassword: z
      .string()
      .min(1, { message: t("register.confirmPassword.required", "La confirmation du mot de passe est requise") }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("register.passwords.mismatch", "Les mots de passe ne correspondent pas"),
    path: ["confirmPassword"],
  });

  // Initialisation de React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accountName: "",
      phone: "",
      email: "",
      accountType: "",
      preferredLanguage: "fr",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedFields = watch();

  // Vérification de la force du mot de passe
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "Vide" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const labels = ["Très faible", "Faible", "Moyen", "Bon", "Très bon", "Excellent"];
    return { score, label: labels[Math.min(score, 5)] };
  };

  const passwordStrength = getPasswordStrength(watchedFields.password);

  // Soumission du formulaire
  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Inscription avec:", {
        ...data,
        // Ne pas logger le mot de passe en production
        password: "***",
        confirmPassword: "***",
      });
      
      // Redirection vers la page de confirmation
      navigate("/register/success");
      
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Types de compte disponibles
  const accountTypes = [
    { value: "particulier", label: "Particulier", icon: UserCircle, description: "Pour les utilisateurs individuels" },
    { value: "candidat", label: "Candidat", icon: User, description: "Recherche d'emploi ou de missions" },
    { value: "partenaire", label: "Partenaire", icon: Handshake, description: "Entreprises et prestataires" },
    { value: "professionnel", label: "Professionnel", icon: UserCircle, description: "Entreprises et prestataires" },
  ];

  // Langues disponibles
  const languages = [
    { value: "fr", label: "Français", flag: "🇫🇷" },
    { value: "en", label: "English", flag: "🇬🇧" },
    { value: "es", label: "Español", flag: "🇪🇸" },
    { value: "zh", label: "Chinese", flag: "🇨🇳" },
    // { value: "zh", label: "中文", flag: "🇨🇳" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container px-4 py-8 mx-auto md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Logo et titre */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <img src={Logo} alt="Logo FIBEM" className="w-12 h-8" />
              </div>
              <h1 className="text-2xl font-semibold"><span className="text-3xl text-secondary">L</span>ivreur<span className="text-3xl text-secondary">N</span>ourriture</h1>
            </div>
            <p className="text-muted-foreground">
              Rejoignez notre plateforme de livraison des repas
            </p>
          </div>

          {/* Carte d'inscription */}
          <Card className="border">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Créer un compte</CardTitle>
              <CardDescription>
                Remplissez les informations pour créer votre compte
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Informations de base */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Nom de compte */}
                  <div className="space-y-2">
                    <Label htmlFor="accountName">
                      Nom de compte <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="accountName"
                        type="text"
                        placeholder="Votre nom d'utilisateur"
                        className="pl-10"
                        {...register("accountName")}
                        aria-invalid={!!errors.accountName}
                      />
                      {watchedFields.accountName && !errors.accountName && (
                        <div className="absolute transform -translate-y-1/2 right-3 top-1/2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.accountName && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.accountName.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Téléphone (format international) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+33 1 23 45 67 89"
                        className="pl-10"
                        {...register("phone")}
                        aria-invalid={!!errors.phone}
                      />
                      {watchedFields.phone && !errors.phone && (
                        <div className="absolute transform -translate-y-1/2 right-3 top-1/2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.phone && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.phone.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Adresse email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-10"
                      {...register("email")}
                      aria-invalid={!!errors.email}
                    />
                    {watchedFields.email && !errors.email && (
                      <div className="absolute transform -translate-y-1/2 right-3 top-1/2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email.message}</span>
                    </div>
                  )}
                </div>

                {/* Type de compte */}
                <div className="space-y-2">
                  <Label htmlFor="accountType">
                    Type de compte <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid gap-3 md:grid-cols-3">
                    {accountTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = watchedFields.accountType === type.value;
                      
                      return (
                        <button
                          type="button"
                          key={type.value}
                          className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all hover:border-primary ${
                            isSelected 
                              ? "border-primary bg-primary/5" 
                              : "border-input"
                          }`}
                          onClick={() => {
                            setValue("accountType", type.value);
                            trigger("accountType");
                          }}
                        >
                          <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`font-medium ${isSelected ? "text-primary" : ""}`}>
                            {type.label}
                          </span>
                          <span className="mt-1 text-xs text-center text-muted-foreground">
                            {type.description}
                          </span>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <Check className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="hidden"
                    {...register("accountType")}
                  />
                  {errors.accountType && (
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.accountType.message}</span>
                    </div>
                  )}
                </div>

                {/* Langue préférée */}
                <div className="space-y-2">
                  <Label htmlFor="preferredLanguage">
                    Langue préférée <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute z-10 transform -translate-y-1/2 left-3 top-1/2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <Select
                      onValueChange={(value) => {
                        setValue("preferredLanguage", value);
                        trigger("preferredLanguage");
                      }}
                      defaultValue={watchedFields.preferredLanguage}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Sélectionnez une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            <div className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span>{lang.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.preferredLanguage && (
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.preferredLanguage.message}</span>
                    </div>
                  )}
                </div>

                {/* Mot de passe */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Mot de passe <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        className="pl-10 pr-10"
                        {...register("password")}
                        aria-invalid={!!errors.password}
                      />
                      <button
                        type="button"
                        className="absolute transform -translate-y-1/2 right-3 top-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    
                    {/* Indicateur de force du mot de passe */}
                    {watchedFields.password && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Force du mot de passe:{" "}
                            <span className={`font-medium ${
                              passwordStrength.score <= 1 ? "text-red-500" :
                              passwordStrength.score <= 3 ? "text-yellow-500" :
                              "text-green-500"
                            }`}>
                              {passwordStrength.label}
                            </span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {watchedFields.password.length}/50
                          </span>
                        </div>
                        <div className="w-full h-1 overflow-hidden bg-gray-200 rounded-full">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              passwordStrength.score <= 1 ? "bg-red-500 w-1/5" :
                              passwordStrength.score <= 2 ? "bg-red-500 w-2/5" :
                              passwordStrength.score <= 3 ? "bg-yellow-500 w-3/5" :
                              passwordStrength.score <= 4 ? "bg-green-500 w-4/5" :
                              "bg-green-600 w-full"
                            }`}
                          />
                        </div>
                        
                        {/* Critères de validation */}
                        <div className="grid grid-cols-2 gap-1 mt-2">
                          {[
                            { label: "8 caractères min", valid: watchedFields.password.length >= 8 },
                            { label: "1 majuscule", valid: /[A-Z]/.test(watchedFields.password) },
                            { label: "1 minuscule", valid: /[a-z]/.test(watchedFields.password) },
                            { label: "1 chiffre", valid: /[0-9]/.test(watchedFields.password) },
                            { label: "1 caractère spécial", valid: /[^A-Za-z0-9]/.test(watchedFields.password) },
                          ].map((criterion, index) => (
                            <div key={index} className="flex items-center gap-1 text-xs">
                              {criterion.valid ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <X className="w-3 h-3 text-gray-300" />
                              )}
                              <span className={criterion.valid ? "text-green-500" : "text-gray-400"}>
                                {criterion.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {errors.password && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.password.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Confirmation du mot de passe */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmer le mot de passe <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmez votre mot de passe"
                        className="pl-10 pr-10"
                        {...register("confirmPassword")}
                        aria-invalid={!!errors.confirmPassword}
                      />
                      <button
                        type="button"
                        className="absolute transform -translate-y-1/2 right-3 top-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={
                          showConfirmPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    {watchedFields.confirmPassword && !errors.confirmPassword && watchedFields.password === watchedFields.confirmPassword && (
                      <div className="flex items-center gap-2 text-sm text-green-500">
                        <CheckCircle className="w-4 h-4" />
                        <span>Les mots de passe correspondent</span>
                      </div>
                    )}
                    {errors.confirmPassword && (
                      <div className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.confirmPassword.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bouton d'inscription */}
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current rounded-full border-t-transparent animate-spin" />
                      Création du compte...
                    </>
                  ) : (
                    <>
                      Créer mon compte
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex-col space-y-4">
              <Separator />
              <div className="text-sm text-center">
                <span className="text-muted-foreground">
                  Vous avez déjà un compte ?{" "}
                </span>
                <Link
                  to="/auth/login"
                  className="font-medium text-primary hover:underline"
                >
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;