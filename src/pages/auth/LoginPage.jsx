// LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock,
  AlertCircle,
  CheckCircle,
  User,
  Shield,
  ArrowRight,
  Smartphone,
  Fingerprint,
  Building,
} from "lucide-react";
import Logo from "@/assets/logo_fibem3.jpg";
import { useLanguage } from "@/context/LanguageContext";
import SiteTileForm1 from "@/components/custom/SiteTitleForm1";
import { useDispatch, useSelector } from "react-redux";
import { loginAction, selectUser, setIsLoggedIn } from "@/redux/slices/AppSlice";

//type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: ""
  });
  
  const dispatch = useDispatch();
  const selectUserFS = useSelector(selectUser);

  const { t } = useLanguage();

  // Schéma de validation avec Zod
  const loginSchema = z.object({
    identifier: z
      .string()
      .min(1, {
        message: t(
          "login.identifier.required",
          "L'email ou le numéro de téléphone est requis",
        ),
      })
      .refine(
        (value) => {
          // Valider soit comme email, soit comme numéro de téléphone
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
          return emailRegex.test(value) || phoneRegex.test(value);
        },
        {
          message: t(
            "login.identifier.incorrect",
            "Veuillez entrer un email valide ou un numéro de téléphone",
          ),
        },
      ),
    password: z
      .string()
      .min(6, {
        message: t(
          "login.password.tooShort",
          "Le mot de passe doit contenir au moins 6 caractères",
        ),
      })
      .max(50, {
        message: t("login.identifier.tooLong", "Le mot de passe est trop long"),
      }),
    rememberMe: z.boolean().optional(),
  });

  // Initialisation de React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  // Observateur pour l'identifiant
  const identifierValue = watch("identifier");

  // Détecter automatiquement le type d'identifiant
  const detectIdentifierType = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;

    if (emailRegex.test(value)) {
      setLoginMethod("email");
    } else if (phoneRegex.test(value)) {
      setLoginMethod("phone");
    }
  };

  // Soumission du formulaire
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(setIsLoggedIn(true));

      console.log("Connexion avec:", data);

      // Redirection vers le dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur de connexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion avec les comptes de démo
  const handleDemoLogin = (type, identifier, password) => {
    dispatch(loginAction({ identifier, password }));
    /*setIsLoading(true);
    
    const demoCredentials = {
      user: { identifier: "client@demo.com", password: "demo123" },
      provider: { identifier: "prestataire@demo.com", password: "demo123" },
      admin: { identifier: "admin@fibem.com", password: "demo123" },
    };
    
    const demo = demoCredentials[type];
    
    setValue("identifier", demo.identifier);
    setValue("password", demo.password);
    
    setTimeout(() => {
      console.log(`Connexion démo ${type}:`, demo);
      navigate("/dashboard");
      setIsLoading(false);
    }, 800);*/
  };

  return (
    <motion.div className="min-h-screen bg-linear-to-b from-primary to-muted/20">
      <div className="container px-4 py-8 mx-auto md:py-16">
        <div className="max-w-md mx-auto">
          {/* Logo et titre */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                {/* <Shield className="w-6 h-6 text-primary" /> */}
                <img src={Logo} alt="Logo FIBEM" className="w-12 h-8" />
              </div>
              <SiteTileForm1 />
            </div>
            <p className="text-primary-foreground">
              Accédez à votre espace professionnel
            </p>
          </div>

          {/* Carte de connexion */}
          <Card className="border">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Connexion</CardTitle>
              <CardDescription>
                Utilisez votre email ou numéro de téléphone
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Champ identifiant */}
                <div className="space-y-2">
                  <Label htmlFor="identifier">
                    Email ou numéro de téléphone
                  </Label>
                  <div className="relative">
                    <div className="absolute transform -translate-y-1/2 left-3 top-1/2">
                      {loginMethod === "email" ? (
                        <Mail className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Phone className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <Input
                      id="identifier"
                      type="text"
                      placeholder={t(
                        "login.identifier.placeholder",
                        "Email ou numero de telephone",
                      )}
                      className="pl-10"
                      {...register("identifier", {
                        onChange: (e) => detectIdentifierType(e.target.value),
                      })}
                      aria-invalid={!!errors.identifier}
                    />
                    {identifierValue && !errors.identifier && (
                      <div className="absolute transform -translate-y-1/2 right-3 top-1/2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.identifier && (
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.identifier.message}</span>
                    </div>
                  )}
                </div>

                {/* Champ mot de passe */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Link
                      to="/auth/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
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
                        showPassword
                          ? "Cacher le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="flex items-center gap-2 text-sm text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password.message}</span>
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="w-4 h-4 border rounded border-input"
                      {...register("rememberMe")}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Se souvenir de moi
                    </label>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">
                      Connexion sécurisée
                    </span>
                  </div>
                </div>

                {/* Bouton de connexion */}
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current rounded-full border-t-transparent animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      Se connecter
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
                  Pas encore de compte ?{" "}
                </span>
                <Link
                  to="/auth/register"
                  className="font-medium text-primary hover:underline"
                >
                  S'inscrire gratuitement
                </Link>
              </div>

              <div className="text-xs text-center text-muted-foreground">
                En vous connectant, vous acceptez nos{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  conditions d'utilisation
                </Link>{" "}
                et notre{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  politique de confidentialité
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
