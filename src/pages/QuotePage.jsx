// QuotePage.jsx - Page de génération de devis
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Package,
  Plus,
  Minus,
  Trash2,
  Send,
  Download,
  CheckCircle,
  AlertCircle,
  Briefcase,
  CreditCard,
  Users,
  FileCheck,
  Sparkles,
  Shield,
  Receipt,
  Hash,
  DamIcon,
} from "lucide-react";
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";

const QuotePage = () => {
  const navigate = useNavigate();

  // État du formulaire
  const [formData, setFormData] = useState({
    // Informations client
    quoteNumber: "DE 0001",
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    quoteType: "",

    // Informations du projet
    projectName: "",
    projectDescription: "",
    startDate: "",
    deadline: "",
    budget: "",
    category: "",

    // Notes additionnelles
    additionalNotes: "",
  });

  // État des articles du devis
  const [quoteItems, setQuoteItems] = useState([
    {
      id: 1,
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    },
  ]);

  const [quoteStatus, setQuoteStatus] = useState("draft");

  // Options de catégories
  const categories = [
    { value: "development", label: "Développement Web", icon: "💻" },
    { value: "design", label: "Design Graphique", icon: "🎨" },
    { value: "marketing", label: "Marketing Digital", icon: "📱" },
    { value: "consulting", label: "Conseil & Formation", icon: "📊" },
    { value: "delivery", label: "Livraison de Services", icon: "🚚" },
    { value: "other", label: "Autre", icon: "📦" },
  ];

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusBadge = () => {
    const statusConfig = {
      draft: { label: "Brouillon", variant: "secondary", color: "gray" },
      sent: { label: "Envoyée", variant: "default", color: "blue" },
      paid: { label: "Payée", variant: "default", color: "green" },
      overdue: { label: "En retard", variant: "destructive", color: "red" },
    };

    const config = statusConfig[quoteStatus] || statusConfig.draft;

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  // Gestion des articles
  const addQuoteItem = () => {
    const newId = Math.max(...quoteItems.map((item) => item.id), 0) + 1;
    setQuoteItems([
      ...quoteItems,
      {
        id: newId,
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const updateQuoteItem = (id, field, value) => {
    setQuoteItems(
      quoteItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total =
              (field === "quantity" ? value : updatedItem.quantity) *
              (field === "unitPrice" ? value : updatedItem.unitPrice);
          }
          return updatedItem;
        }
        return item;
      }),
    );
  };

  const removeQuoteItem = (id) => {
    if (quoteItems.length > 1) {
      setQuoteItems(quoteItems.filter((item) => item.id !== id));
    }
  };

  // Calculs
  const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 0.1925; // 19.25% TVA
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  // Validation du formulaire
  const isFormValid = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "projectName",
    ];
    const hasRequiredFields = requiredFields.every(
      (field) => formData[field].trim() !== "",
    );
    const hasValidItems = quoteItems.every(
      (item) => item.description.trim() !== "" && item.unitPrice > 0,
    );
    return hasRequiredFields && hasValidItems;
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      console.log("Devis généré:", {
        formData,
        quoteItems,
        financials: { subtotal, taxAmount, total },
      });
      // Ici, vous pouvez envoyer les données à votre API
      alert("Devis généré avec succès !");
    }
  };

  // Télécharger le devis (placeholder)
  const downloadQuote = () => {
    alert("Fonctionnalité de téléchargement en cours de développement");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-white">
        <div className="container px-4 py-12 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="mb-4 text-4xl font-bold">Générer un Devis</h1>
            <p className="text-lg text-gray-600">
              Remplissez le formulaire ci-dessous pour créer un devis
              professionnel personnalisé
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <span className="font-mono text-sm text-gray-700">
                  {formData.quoteNumber}
                </span>
              </div>
              {getStatusBadge()}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Formulaire Principal */}
      <div className="container px-4 py-12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Colonne principale - Formulaire */}
              <div className="space-y-6 lg:col-span-2">
                {/* Section 1: Informations Client */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Informations Client</h2>
                      <p className="text-sm text-gray-500">
                        Vos coordonnées pour le devis
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="AAA"
                          required
                        />
                        <User className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="BBBB"
                          required
                        />
                        <User className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="contact@email.com"
                          required
                        />
                        <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="+237 6XX XX XX XX"
                          required
                        />
                        <Phone className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Entreprise
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Nom de votre entreprise"
                        />
                        <Building2 className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Type de devis
                      </label>
                      <div className="relative">
                        <select
                          name="quoteType"
                          value={formData.quoteType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Sélectionnez un type</option>
                          <option value="0">Travaux Pose seule</option>
                          <option value="1">Travaux Fourniture et Pose</option>
                          <option value="2">Rénovation</option>
                          <option value="3">Construction</option>
                          <option value="4">Aménagement</option>
                          <option value="5">Poseur & Monteur</option>
                          <option value="6">Études et Réalisation Plans</option>
                          <option value="7">Calcul Dimensionnement</option>
                          <option value="8">Calcul de Vérification</option>
                          <option value="9">Assistance Technique</option>
                          <option value="10">Autre</option>
                        </select>
                        {/* <DamIcon className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" /> */}
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Adresse
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="123 Rue de la République"
                        />
                        <MapPin className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Ville
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Douala"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Code Postal
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="00237"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Informations Projet */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Détails du Projet</h2>
                      <p className="text-sm text-gray-500">
                        Informations sur votre projet
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Nom du Projet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ex: Développement site e-commerce"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Catégorie du Projet
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Sélectionnez une catégorie</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Description du Projet
                      </label>
                      <textarea
                        name="projectDescription"
                        value={formData.projectDescription}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Décrivez votre projet en détail..."
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Date de début
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <Calendar className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Date limite
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <Clock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Budget Estimé (XOF)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="100000"
                        />
                        <CreditCard className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Articles du Devis */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex flex-wrap items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          Articles du Devis
                        </h2>
                        <p className="text-sm text-gray-500">
                          Ajoutez les éléments à facturer
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={addQuoteItem}
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 mt-2 md:mt-0 md:w-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {quoteItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 transition-colors border border-gray-200 rounded-lg hover:border-primary/30"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="text-xs">
                            Article {index + 1}
                          </Badge>
                          {quoteItems.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeQuoteItem(item.id)}
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Description <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                updateQuoteItem(
                                  item.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 text-sm transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Ex: Développement page d'accueil"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Quantité
                              </label>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  onClick={() =>
                                    updateQuoteItem(
                                      item.id,
                                      "quantity",
                                      Math.max(1, item.quantity - 1),
                                    )
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="w-8 h-8 p-0"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuoteItem(
                                      item.id,
                                      "quantity",
                                      Math.max(1, parseInt(e.target.value) || 1),
                                    )
                                  }
                                  className="w-full px-2 py-1 text-sm text-center transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                  min="1"
                                />
                                <Button
                                  type="button"
                                  onClick={() =>
                                    updateQuoteItem(
                                      item.id,
                                      "quantity",
                                      item.quantity + 1,
                                    )
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="w-8 h-8 p-0"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Prix Unitaire
                              </label>
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  updateQuoteItem(
                                    item.id,
                                    "unitPrice",
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                className="w-full px-3 py-1 text-sm transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="0"
                                min="0"
                              />
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Total
                              </label>
                              <div className="flex items-center h-8 px-3 py-1 text-sm font-semibold rounded-lg bg-gray-50 text-primary">
                                {item.total.toLocaleString()} XOF
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Notes additionnelles */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <FileCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Notes Additionnelles</h2>
                      <p className="text-sm text-gray-500">
                        Informations complémentaires
                      </p>
                    </div>
                  </div>

                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ajoutez des notes, conditions particulières, ou informations importantes..."
                  />
                </div>
              </div>

              {/* Colonne latérale - Récapitulatif */}
              <div className="space-y-6">
                {/* Récapitulatif Financier */}
                {/* <div className="sticky p-6 bg-white border border-gray-200 shadow-sm top-6 rounded-xl"> */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm top-6 rounded-xl">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold">
                    <Receipt className="w-5 h-5 text-primary" />
                    Récapitulatif
                  </h3>

                  <div className="space-y-4">
                    {/* Liste des articles */}
                    <div className="space-y-2">
                      {quoteItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {item.description || "Article sans nom"} (×
                            {item.quantity})
                          </span>
                          <span className="font-medium">
                            {item.total.toLocaleString()} XOF
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Totaux */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sous-total</span>
                        <span className="font-medium">
                          {subtotal.toLocaleString()} XOF
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">TVA (19.25%)</span>
                        <span className="font-medium">
                          {taxAmount.toLocaleString()} XOF
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total TTC</span>
                        <span className="text-primary">
                          {total.toLocaleString()} XOF
                        </span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2 text-md">
                      Mention : <strong className="text-green-700">Bon Pour accord</strong>
                    </div>

                    {/* Validation */}
                    {!isFormValid() && (
                      <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-yellow-700">
                            Veuillez remplir tous les champs requis et ajouter
                            au moins un article valide
                          </p>
                        </div>
                      </div>
                    )}

                    {isFormValid() && (
                      <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-green-700">
                            Le devis est prêt à être généré
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="space-y-2">
                      <Button
                        type="submit"
                        className="w-full gap-2"
                        size="lg"
                        disabled={!isFormValid()}
                      >
                        <Send className="w-4 h-4" />
                        Générer le Devis
                      </Button>

                      <Button
                        type="button"
                        onClick={downloadQuote}
                        variant="outline"
                        className="w-full gap-2"
                        disabled={!isFormValid()}
                      >
                        <Download className="w-4 h-4" />
                        Télécharger PDF
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Avantages */}
                {/* <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <h4 className="mb-4 text-lg font-bold">
                    Pourquoi choisir nos services ?
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full shrink-0">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold">
                          Service Premium
                        </h5>
                        <p className="text-xs text-gray-600">
                          Qualité professionnelle garantie
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full shrink-0">
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold">
                          Paiement sécurisé
                        </h5>
                        <p className="text-xs text-gray-600">
                          Transactions 100% protégées
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full shrink-0">
                        <Users className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold">
                          Support dédié
                        </h5>
                        <p className="text-xs text-gray-600">
                          Assistance 24/7 disponible
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Informations légales */}
                {/* <div className="p-4 text-xs text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="mb-2">
                    ℹ️ Ce devis est valable 30 jours à compter de sa date
                    d'émission.
                  </p>
                  <p>
                    Les prix sont exprimés en Francs CFA (XOF) et incluent la
                    TVA à 19.25%.
                  </p>
                </div> */}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default QuotePage;