// SubscriptionPage.jsx - Page des Abonnements Premium
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Crown,
  CheckCircle,
  XCircle,
  Users,
  Briefcase,
  User,
  Building,
  FileText,
  CreditCard,
  Shield,
  Zap,
  Globe,
  BarChart,
  Bell,
  Calendar,
  Award,
  Trophy,
  Star,
  Coffee,
  ChefHat,
  ShoppingBag,
  Receipt,
  FileSpreadsheet,
  UserPlus,
  Users as UsersIcon,
  Package,
  ShoppingCart,
  Rocket,
  Sparkles,
  Gift,
  Book,
} from "lucide-react";

const SubscriptionPage = () => {
  const [selectedProfile, setSelectedProfile] = useState("candidat");
  const [selectedPeriod, setSelectedPeriod] = useState("mensuel");
  const [selectedPlan, setSelectedPlan] = useState("essentiel");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Types de comptes
  const accountTypes = [
    {
      id: "candidat",
      name: "Candidat",
      icon: User,
      description: "Cherche un emploi dans la restauration",
      color: "bg-blue-500",
    },
    {
      id: "stagiaire",
      name: "Stagiaire",
      icon: Award,
      description: "En formation dans la restauration",
      color: "bg-green-500",
    },
    {
      id: "professionnel",
      name: "Professionnel",
      icon: Briefcase,
      description: "Chef, cuisinier, restaurateur",
      color: "bg-purple-500",
    },
    {
      id: "particulier",
      name: "Particulier",
      icon: User,
      description: "Client particulier commandant des repas",
      color: "bg-orange-500",
    },
    {
      id: "entreprise",
      name: "Entreprise",
      icon: Building,
      description: "Restauration d'entreprise, traiteur",
      color: "bg-red-500",
    },
  ];

  // Périodes d'abonnement
  const subscriptionPeriods = [
    { id: "mensuel", name: "Mensuel", discount: 0 },
    { id: "3mois", name: "3 mois", discount: 10 },
    { id: "6mois", name: "6 mois", discount: 15 },
    { id: "annuel", name: "Annuel", discount: 20 },
  ];

  // Plans d'abonnement
  const subscriptionPlans = {
    candidat: [
      {
        id: "essentiel",
        name: "Essentiel",
        price: 2500,
        description: "Accès basique aux offres d'emploi",
        features: [
          { name: "Consulter les offres d'emploi", included: true },
          { name: "Postuler à 3 offres/mois", included: true },
          { name: "Profil candidat visible", included: true },
          { name: "Notifications nouvelles offres", included: true },
          { name: "Accès illimité au catalogue", included: true },
          { name: "Livraison gratuite (1/mois)", included: true },
          { name: "Génération de CV", included: false },
          { name: "Formations en ligne", included: false },
          { name: "Coaching carrière", included: false },
          { name: "Offres premium visibles", included: false },
        ],
        popular: false,
      },
      {
        id: "pro",
        name: "Pro",
        price: 5000,
        description: "Accès complet aux opportunités",
        features: [
          { name: "Consulter les offres d'emploi", included: true },
          { name: "Postuler illimité", included: true },
          { name: "Profil mis en avant", included: true },
          { name: "Génération de CV professionnel", included: true },
          { name: "Accès illimité au catalogue", included: true },
          { name: "Livraison gratuite (3/mois)", included: true },
          { name: "Formations en ligne", included: true },
          { name: "Coaching carrière mensuel", included: false },
          { name: "Offres premium visibles", included: true },
          { name: "Statistiques de candidature", included: false },
        ],
        popular: true,
      },
      {
        id: "premium",
        name: "Premium",
        price: 8000,
        description: "Accès VIP aux meilleures offres",
        features: [
          { name: "Consulter les offres d'emploi", included: true },
          { name: "Postuler illimité", included: true },
          { name: "Profil mis en avant VIP", included: true },
          { name: "Génération de CV professionnel", included: true },
          { name: "Accès illimité au catalogue", included: true },
          { name: "Livraison gratuite illimitée", included: true },
          { name: "Formations en ligne complètes", included: true },
          { name: "Coaching carrière hebdomadaire", included: true },
          { name: "Offres premium visibles", included: true },
          { name: "Statistiques détaillées", included: true },
        ],
        popular: false,
      },
    ],
    professionnel: [
      {
        id: "essentiel",
        name: "Essentiel",
        price: 15000,
        description: "Gestion basique de votre activité",
        features: [
          { name: "Tableau de bord de base", included: true },
          { name: "Gestion des commandes", included: true },
          { name: "Catalogue jusqu'à 20 plats", included: true },
          { name: "Gestion clients", included: true },
          { name: "Génération de devis", included: true },
          { name: "Génération de factures", included: false },
          { name: "Génération d'avoirs", included: false },
          { name: "Analyses basiques", included: false },
          { name: "Multi-utilisateurs", included: false },
          { name: "Support prioritaire", included: false },
        ],
        popular: false,
      },
      {
        id: "pro",
        name: "Professionnel",
        price: 30000,
        description: "Solution complète pour votre business",
        features: [
          { name: "Tableau de bord avancé", included: true },
          { name: "Gestion des commandes", included: true },
          { name: "Catalogue illimité de plats", included: true },
          { name: "Gestion clients", included: true },
          { name: "Génération de devis", included: true },
          { name: "Génération de factures", included: true },
          { name: "Génération d'avoirs", included: true },
          { name: "Analyses détaillées", included: true },
          { name: "Jusqu'à 3 utilisateurs", included: true },
          { name: "Support prioritaire", included: true },
        ],
        popular: true,
      },
      {
        id: "entreprise",
        name: "Entreprise",
        price: 60000,
        description: "Solution sur mesure pour les grandes structures",
        features: [
          { name: "Tableau de dashboards personnalisés", included: true },
          { name: "Gestion des commandes avancée", included: true },
          { name: "Catalogue illimité", included: true },
          { name: "Gestion CRM complète", included: true },
          { name: "Génération de devis", included: true },
          { name: "Génération de factures", included: true },
          { name: "Génération d'avoirs", included: true },
          { name: "Analyses prédictives", included: true },
          { name: "Utilisateurs illimités", included: true },
          { name: "Support dédié 24/7", included: true },
        ],
        popular: false,
      },
    ],
    entreprise: [
      {
        id: "essentiel",
        name: "Basique",
        price: 25000,
        description: "Pour les petites entreprises",
        features: [
          { name: "Gestion des commandes de groupe", included: true },
          { name: "Jusqu'à 20 employés", included: true },
          { name: "Facturation mensuelle", included: true },
          { name: "Tableau de bord basique", included: true },
          { name: "Menu personnalisable", included: false },
          { name: "Analyses de consommation", included: false },
          { name: "Multi-sites", included: false },
          { name: "Intégration RH", included: false },
        ],
        popular: false,
      },
      {
        id: "pro",
        name: "Corporate",
        price: 50000,
        description: "Pour les moyennes entreprises",
        features: [
          { name: "Gestion des commandes de groupe", included: true },
          { name: "Jusqu'à 100 employés", included: true },
          { name: "Facturation détaillée", included: true },
          { name: "Tableau de bord avancé", included: true },
          { name: "Menu personnalisable", included: true },
          { name: "Analyses de consommation", included: true },
          { name: "Multi-sites (jusqu'à 3)", included: true },
          { name: "Intégration RH basique", included: true },
        ],
        popular: true,
      },
      {
        id: "premium",
        name: "Enterprise",
        price: 100000,
        description: "Pour les grandes entreprises",
        features: [
          { name: "Gestion des commandes de groupe", included: true },
          { name: "Employés illimités", included: true },
          { name: "Facturation détaillée", included: true },
          { name: "Tableau de dashboards personnalisés", included: true },
          { name: "Menu entièrement personnalisable", included: true },
          { name: "Analyses prédictives", included: true },
          { name: "Multi-sites illimités", included: true },
          { name: "Intégration RH complète", included: true },
        ],
        popular: false,
      },
    ],
    // Plans par défaut pour autres profils
    particulier: [
      {
        id: "essentiel",
        name: "Classique",
        price: 0,
        description: "Accès gratuit au catalogue",
        features: [
          { name: "Accès au catalogue complet", included: true },
          { name: "Commandes illimitées", included: true },
          { name: "Frais de livraison standards", included: true },
          { name: "Suivi de commande", included: true },
          { name: "Support standard", included: true },
          { name: "Livraison gratuite", included: false },
          { name: "Menu premium", included: false },
          { name: "Support prioritaire", included: false },
        ],
        popular: false,
      },
      {
        id: "pro",
        name: "Premium",
        price: 5000,
        description: "Avantages exclusifs pour gourmets",
        features: [
          { name: "Accès au catalogue complet", included: true },
          { name: "Commandes illimitées", included: true },
          { name: "Livraison gratuite illimitée", included: true },
          { name: "Suivi de commande en temps réel", included: true },
          { name: "Support prioritaire", included: true },
          { name: "Accès aux menus premium", included: true },
          { name: "Offres exclusives", included: true },
          { name: "Cadeaux mensuels", included: true },
        ],
        popular: true,
      },
    ],
    stagiaire: [
      {
        id: "essentiel",
        name: "Étudiant",
        price: 1000,
        description: "Tarif spécial pour étudiants",
        features: [
          { name: "Accès au catalogue complet", included: true },
          { name: "Commandes jusqu'à 10/mois", included: true },
          { name: "Frais de livraison réduits", included: true },
          { name: "Accès aux offres de stage", included: true },
          { name: "Formations gratuites", included: true },
          { name: "Livraison gratuite", included: false },
          { name: "Menu premium", included: false },
          { name: "Coaching", included: false },
        ],
        popular: true,
      },
    ],
  };

  // Calcul du prix avec remise
  const calculatePrice = (basePrice) => {
    const period = subscriptionPeriods.find(p => p.id === selectedPeriod);
    const discountMultiplier = (100 - period.discount) / 100;
    return Math.round(basePrice * discountMultiplier);
  };

  // Récupérer les plans pour le profil sélectionné
  const currentPlans = subscriptionPlans[selectedProfile] || subscriptionPlans.particulier;

  // Fonctionnalités par profil
  const profileFeatures = {
    candidat: [
      { icon: FileText, text: "Génération de CV professionnel" },
      { icon: Briefcase, text: "Accès aux offres d'emploi premium" },
      { icon: BarChart, text: "Statistiques de candidature" },
      { icon: Award, text: "Certifications en ligne" },
    ],
    professionnel: [
      { icon: ShoppingBag, text: "Gestion avancée des commandes" },
      { icon: Receipt, text: "Facturation et devis automatisés" },
      { icon: FileSpreadsheet, text: "Tableaux de bord analytics" },
      { icon: UsersIcon, text: "Gestion multi-utilisateurs" },
    ],
    entreprise: [
      { icon: Building, text: "Gestion des commandes de groupe" },
      { icon: Users, text: "Portail employés" },
      { icon: BarChart, text: "Analyses de consommation" },
      { icon: Globe, text: "Gestion multi-sites" },
    ],
    particulier: [
      { icon: ShoppingCart, text: "Livraison gratuite" },
      { icon: Crown, text: "Accès aux menus premium" },
      { icon: Zap, text: "Service prioritaire" },
      { icon: Gift, text: "Cadeaux et offres exclusives" },
    ],
    stagiaire: [
      { icon: Award, text: "Tarifs réduits" },
      { icon: Book, text: "Accès aux formations" },
      { icon: Briefcase, text: "Offres de stage" },
      { icon: Users, text: "Réseau d'anciens" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="border-b bg-primary/10">
        <div className="container px-4 py-4 mx-auto md:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-medium rounded-full md:text-sm bg-primary/10 text-primary">
              <Crown className="w-4 h-4" />
              Abonnements Premium
            </div>
            <h1 className="mb-6 text-2xl font-bold md:text-5xl">
              Choisissez l'abonnement adapté à vos besoins
            </h1>
            <p className="mb-8 text-md md:text-lg text-muted-foreground">
              Accédez à des fonctionnalités exclusives selon votre profil
            </p>
          </div>
        </div>
      </section>

      {/* Sélection du profil */}
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="p-6 mb-8 border rounded-lg bg-card">
            <h2 className="mb-4 text-2xl font-semibold">Sélectionnez votre profil</h2>
            <p className="mb-6 text-muted-foreground">
              Les tarifs et fonctionnalités varient selon votre type de compte
            </p>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              {accountTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <motion.div
                    key={type.id}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-300 ${selectedProfile === type.id ? 'ring-2 ring-primary' : 'hover:border-primary/50'}`}
                      onClick={() => setSelectedProfile(type.id)}
                    >
                      <CardContent className="flex flex-row items-center p-2 text-center md:flex-col md:p-6">
                        <div className={`p-3 mb-4 ml-2 mr-5 md:mr-auto md:ml-auto rounded-full ${type.color} text-white`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold">{type.name}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                            {type.description}
                            </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Période d'abonnement */}
          <div className="p-6 mb-8 border rounded-lg bg-card">
            <h2 className="mb-4 text-2xl font-semibold">Période d'abonnement</h2>
            <p className="mb-6 text-muted-foreground">
              Plus la période est longue, plus l'économie est importante
            </p>
            
            <RadioGroup
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
              className="grid grid-cols-2 gap-4 md:grid-cols-4"
            >
              {subscriptionPeriods.map((period) => (
                <div key={period.id} className="relative">
                  <RadioGroupItem
                    value={period.id}
                    id={period.id}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={period.id}
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${selectedPeriod === period.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                  >
                    <span className="font-semibold">{period.name}</span>
                    {period.discount > 0 && (
                      <Badge className="mt-2" variant="secondary">
                        -{period.discount}%
                      </Badge>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Plans d'abonnement */}
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Plans disponibles</h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              {currentPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className={`h-full transition-all duration-300 ${selectedPlan === plan.id ? 'ring-2 ring-primary shadow-lg' : ''} ${plan.popular ? 'border-primary/50 relative' : ''}`}>
                    {plan.popular && (
                      <div className="absolute top-0 transform -translate-x-1/2 -translate-y-1/2 left-1/2">
                        <Badge className="px-3 py-1">
                          <Star className="w-3 h-3 mr-1" />
                          Plus populaire
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {plan.name}
                        {plan.popular && <Sparkles className="w-5 h-5 text-yellow-500" />}
                      </CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold">
                            {plan.price === 0 ? 'Gratuit' : `${calculatePrice(plan.price).toLocaleString()} XOF`}
                          </span>
                          {plan.price > 0 && (
                            <span className="ml-2 text-sm text-muted-foreground">
                              /{selectedPeriod === 'annuel' ? 'an' : selectedPeriod === 'mensuel' ? 'mois' : selectedPeriod.replace('mois', 'mois')}
                            </span>
                          )}
                        </div>
                        {plan.price > 0 && selectedPeriod !== 'mensuel' && (
                          <p className="text-sm text-muted-foreground">
                            <s>{plan.price.toLocaleString()} XOF/mois</s> • Économisez {subscriptionPeriods.find(p => p.id === selectedPeriod).discount}%
                          </p>
                        )}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-3">
                            {feature.included ? (
                              <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="flex-shrink-0 w-5 h-5 text-gray-300" />
                            )}
                            <span className={`text-sm ${!feature.included ? 'text-gray-400' : ''}`}>
                              {feature.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant={selectedPlan === plan.id ? "default" : "outline"}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {selectedPlan === plan.id ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Sélectionné
                          </>
                        ) : (
                          "Sélectionner ce plan"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Fonctionnalités spécifiques au profil */}
          <div className="p-6 mb-8 border rounded-lg bg-card">
            <h2 className="mb-6 text-2xl font-semibold">
              Fonctionnalités {selectedProfile === 'particulier' ? 'Premium' : 'Spécifiques'}
            </h2>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {(profileFeatures[selectedProfile] || profileFeatures.particulier).map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold">{feature.text}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedProfile === 'candidat' && "Améliorez vos chances d'embauche"}
                      {selectedProfile === 'professionnel' && "Optimisez votre gestion quotidienne"}
                      {selectedProfile === 'entreprise' && "Simplifiez la restauration d'entreprise"}
                      {selectedProfile === 'particulier' && "Profitez d'avantages exclusifs"}
                      {selectedProfile === 'stagiaire' && "Bénéficiez de tarifs préférentiels"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Récapitulatif et paiement */}
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="mb-6 text-2xl font-semibold">Récapitulatif de commande</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="mb-3 font-semibold">Détails de l'abonnement</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profil:</span>
                      <span className="font-medium">
                        {accountTypes.find(t => t.id === selectedProfile)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan:</span>
                      <span className="font-medium">
                        {currentPlans.find(p => p.id === selectedPlan)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Période:</span>
                      <span className="font-medium">
                        {subscriptionPeriods.find(p => p.id === selectedPeriod)?.name}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prix mensuel:</span>
                      <span className="font-medium">
                        {currentPlans.find(p => p.id === selectedPlan)?.price === 0 
                          ? 'Gratuit' 
                          : `${currentPlans.find(p => p.id === selectedPlan)?.price.toLocaleString()} XOF/mois`
                        }
                      </span>
                    </div>
                    {currentPlans.find(p => p.id === selectedPlan)?.price > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Remise période:</span>
                        <span className="font-medium">
                          -{subscriptionPeriods.find(p => p.id === selectedPeriod)?.discount}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conditions */}
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    J'accepte les conditions générales d'utilisation et la politique de confidentialité
                  </Label>
                </div>
              </div>

              {/* Total et paiement */}
              <div className="p-4 border rounded-lg">
                <h3 className="mb-3 font-semibold">Total à payer</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span>Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      {currentPlans.find(p => p.id === selectedPlan)?.price === 0 
                        ? 'Gratuit' 
                        : `${calculatePrice(currentPlans.find(p => p.id === selectedPlan)?.price || 0).toLocaleString()} XOF`
                      }
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {selectedPeriod === 'annuel' ? 'Facturation annuelle' : 
                     selectedPeriod === 'mensuel' ? 'Facturation mensuelle' : 
                     `Facturation tous les ${selectedPeriod}`}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Moyens de paiement acceptés</h4>
                    <div className="flex gap-2">
                      <div className="p-2 border rounded">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div className="p-2 border rounded">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div className="p-2 border rounded">
                        <Globe className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full gap-2 mt-4" 
                    size="lg"
                    disabled={!acceptTerms}
                  >
                    <CreditCard className="w-4 h-4" />
                    {currentPlans.find(p => p.id === selectedPlan)?.price === 0 
                      ? "Activer l'abonnement gratuit" 
                      : "Procéder au paiement"
                    }
                  </Button>
                  
                  <p className="text-sm text-center text-muted-foreground">
                    Paiement sécurisé • Sans engagement • Annulation à tout moment
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          {/* <div className="p-6 mt-12 border rounded-lg">
            <h2 className="mb-6 text-2xl font-semibold">Questions fréquentes</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Puis-je changer de plan ultérieurement ?</h3>
                <p className="mt-2 text-muted-foreground">
                  Oui, vous pouvez changer de plan à tout moment. La différence de prix sera ajustée 
                  au prorata de votre période d'abonnement en cours.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Y a-t-il des frais de résiliation ?</h3>
                <p className="mt-2 text-muted-foreground">
                  Non, vous pouvez résilier votre abonnement à tout moment sans frais. 
                  Vous conservez l'accès aux fonctionnalités jusqu'à la fin de la période payée.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Les abonnements sont-ils renouvelés automatiquement ?</h3>
                <p className="mt-2 text-muted-foreground">
                  Oui, par défaut les abonnements sont renouvelés automatiquement. 
                  Vous pouvez désactiver le renouvellement automatique à tout moment depuis votre tableau de bord.
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;