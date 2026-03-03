// QuotePage.jsx - Page de génération de devis
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  FileCheck,
  Sparkles,
  Shield,
  Receipt,
  Hash,
  Edit2,
  Eye,
  Printer,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  RefreshCw,
  Check,
  X,
  Save,
  DollarSign,
} from "lucide-react";
import {
  selectCurrentQuote,
  selectQuoteLoading,
  selectQuoteError,
  selectGeneratedQuotePDF,
  createQuote,
  updateQuoteById,
  generateQuotePDF,
  sendQuoteByEmail,
  clearQuote,
  clearError,
  fetchQuoteById,
  updateQuoteStatus,
} from "@/redux/slices/quoteSlice";

const QuotePage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pour l'édition d'un devis existant
  const quoteRef = useRef();
  const dispatch = useDispatch();

  // États Redux
  const currentQuote = useSelector(selectCurrentQuote);
  const loading = useSelector(selectQuoteLoading);
  const error = useSelector(selectQuoteError);
  const generatedPDF = useSelector(selectGeneratedQuotePDF);

  // États locaux
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeSection, setActiveSection] = useState("client");

  // Génération du numéro de devis
  const generateQuoteNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");
    return `DEV-${year}${month}-${random}`;
  };

  // État du formulaire
  const [formData, setFormData] = useState({
    // Informations devis
    quoteNumber: generateQuoteNumber(),
    
    // Informations client
    firstName: "Samuel",
    lastName: "Bikoko",
    company: "Bikoko Génie Civil SARL",
    email: "s.bikoko@bgc-cm.com",
    phone: "+237 6 71 23 45 67",
    address: "123 Rue Paul Biya",
    city: "Douala",
    postalCode: "CM-237",
    quoteType: "1", // Travaux Fourniture et Pose

    // Informations du projet
    projectName: "Construction Résidence Makepe",
    projectDescription: "Projet de construction d’une résidence moderne à Makepe, Douala.",
    startDate: new Date().toISOString().split('T')[0],
    deadline: "",
    budget: "9500000",
    category: "construction",

    // Paramètres financiers
    taxRate: 0.1925, //19.25, // TVA officielle au Cameroun
    discountRate: 5,
    deposit: 25,
    depositType: "percentage", // percentage or fixed
    validUntil: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return d.toISOString().split('T')[0];
    })(),

    // Notes additionnelles
    additionalNotes: "Pour tout renseignement, contactez notre agence à Akwa, Douala.",
    termsAndConditions: "Ce devis est valable 30 jours. Le paiement est exigible à la livraison.",
  });

  // État des articles du devis
  const [quoteItems, setQuoteItems] = useState([
    // Default quote items
    {
      id: 1,
      description: "Fourniture et pose de fondations en béton armé",
      quantity: 10,
      unitPrice: 750000,
      discount: 0,
      total: 7500000,
    },
    {
      id: 2,
      description: "Élévation des murs (parpaing de 20)",
      quantity: 120,
      unitPrice: 11000,
      discount: 2,
      total: 1293600,
    },
    {
      id: 3,
      description: "Charpente métallique et couverture bac acier",
      quantity: 1,
      unitPrice: 3200000,
      discount: 0,
      total: 3200000,
    },
  ]);

  // État du statut du devis
  const [quoteStatus, setQuoteStatus] = useState("draft"); // draft, sent, accepted, rejected, expired

  // Options de catégories
  const categories = [
    { value: "development", label: "Développement Web", icon: "💻" },
    { value: "design", label: "Design Graphique", icon: "🎨" },
    { value: "marketing", label: "Marketing Digital", icon: "📱" },
    { value: "consulting", label: "Conseil & Formation", icon: "📊" },
    { value: "delivery", label: "Livraison de Services", icon: "🚚" },
    { value: "construction", label: "Construction", icon: "🏗️" },
    { value: "renovation", label: "Rénovation", icon: "🔨" },
    { value: "other", label: "Autre", icon: "📦" },
  ];

  // Options de types de devis
  const quoteTypes = [
    { value: "0", label: "Travaux Pose seule" },
    { value: "1", label: "Travaux Fourniture et Pose" },
    { value: "2", label: "Rénovation" },
    { value: "3", label: "Construction" },
    { value: "4", label: "Aménagement" },
    { value: "5", label: "Poseur & Monteur" },
    { value: "6", label: "Études et Réalisation Plans" },
    { value: "7", label: "Calcul Dimensionnement" },
    { value: "8", label: "Calcul de Vérification" },
    { value: "9", label: "Assistance Technique" },
    { value: "10", label: "Autre" },
  ];

  // Sections du formulaire
  const sections = [
    { id: "client", name: "Informations client", icon: User },
    { id: "project", name: "Détails du projet", icon: Briefcase },
    { id: "items", name: "Articles", icon: Package },
    { id: "payment", name: "Paiement", icon: CreditCard },
    { id: "notes", name: "Notes", icon: FileCheck },
  ];

  // Charger les données si édition
  useEffect(() => {
    if (id) {
      dispatch(fetchQuoteById(id));
    }
  }, [id, dispatch]);

  // Mettre à jour le formulaire quand currentQuote change
  useEffect(() => {
    if (currentQuote) {
      setFormData({
        quoteNumber: currentQuote.quoteNumber || generateQuoteNumber(),
        firstName: currentQuote.firstName || "",
        lastName: currentQuote.lastName || "",
        company: currentQuote.company || "",
        email: currentQuote.email || "",
        phone: currentQuote.phone || "",
        address: currentQuote.address || "",
        city: currentQuote.city || "",
        postalCode: currentQuote.postalCode || "",
        quoteType: currentQuote.quoteType || "",
        projectName: currentQuote.projectName || "",
        projectDescription: currentQuote.projectDescription || "",
        startDate: currentQuote.startDate || "",
        deadline: currentQuote.deadline || "",
        budget: currentQuote.budget || "",
        category: currentQuote.category || "",
        taxRate: currentQuote.taxRate || 0.1925, // 19.25
        discountRate: currentQuote.discountRate || 0,
        deposit: currentQuote.deposit || 0,
        depositType: currentQuote.depositType || "percentage",
        validUntil: currentQuote.validUntil || "",
        additionalNotes: currentQuote.additionalNotes || "",
        termsAndConditions: currentQuote.termsAndConditions || "",
      });

      if (currentQuote.quoteItems) {
        setQuoteItems(currentQuote.quoteItems);
      }

      if (currentQuote.quoteStatus) {
        setQuoteStatus(currentQuote.quoteStatus);
      }
    }
  }, [currentQuote]);

  // Effacer les erreurs
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        discount: 0,
        total: 0,
      },
    ]);
  };

  const updateQuoteItem = (id, field, value) => {
    setQuoteItems(
      quoteItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Recalculer le total
          const quantity = field === "quantity" ? parseFloat(value) || 0 : updatedItem.quantity;
          const unitPrice = field === "unitPrice" ? parseFloat(value) || 0 : updatedItem.unitPrice;
          const discount = field === "discount" ? parseFloat(value) || 0 : updatedItem.discount;
          
          const subtotal = quantity * unitPrice;
          const discountAmount = subtotal * (discount / 100);
          updatedItem.total = subtotal - discountAmount;
          
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

  const duplicateQuoteItem = (id) => {
    const itemToDuplicate = quoteItems.find((item) => item.id === id);
    if (itemToDuplicate) {
      const newId = Math.max(...quoteItems.map((item) => item.id), 0) + 1;
      setQuoteItems([
        ...quoteItems,
        { ...itemToDuplicate, id: newId },
      ]);
    }
  };

  const moveItem = (index, direction) => {
    const items = [...quoteItems];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < items.length) {
      [items[index], items[newIndex]] = [items[newIndex], items[index]];
      setQuoteItems(items);
    }
  };

  // Calculs financiers
  const subtotal = quoteItems.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = subtotal * ((formData.discountRate || 0) / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = subtotalAfterDiscount * ((formData.taxRate || 0) / 100);
  const total = subtotalAfterDiscount + taxAmount;

  const depositAmount = formData.depositType === "percentage"
    ? total * ((formData.deposit || 0) / 100)
    : formData.deposit || 0;

  const remainingAmount = total - depositAmount;

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
      (field) => formData[field]?.toString().trim() !== "",
    );
    const hasValidItems = quoteItems.every(
      (item) => item.description?.trim() !== "" && item.unitPrice > 0,
    );
    return hasRequiredFields && hasValidItems;
  };

  // Génération du devis
  const handleGenerateQuote = async () => {
    setIsGenerating(true);
    
    try {
      // 1. Préparer les données du devis
      const quotePayload = {
        ...formData,
        quoteItems: quoteItems.map(({ id, ...item }) => item), // Enlever l'id local
        quoteStatus: quoteStatus,
        subtotal: subtotal,
        taxAmount: taxAmount,
        discountAmount: discountAmount,
        total: total,
        depositAmount: depositAmount,
        remainingAmount: remainingAmount,
      };

      let quoteId;

      if (currentQuote?.id) {
        // Mettre à jour le devis existant
        const updateResponse = await dispatch(updateQuoteById({ 
          id: currentQuote.id, 
          data: quotePayload 
        })).unwrap();
        quoteId = currentQuote.id;
        console.log("Devis mis à jour:", updateResponse);
      } else {
        // Créer un nouveau devis
        const createResponse = await dispatch(createQuote(quotePayload)).unwrap();
        quoteId = createResponse.content.id;
        console.log("Devis créé:", createResponse);
      }

      if (!quoteId) {
        throw new Error("Impossible de récupérer l'ID du devis");
      }

      // 2. Générer le PDF
      const generateResponse = await dispatch(generateQuotePDF({ 
        id: quoteId, 
        format: 'pdf' 
      })).unwrap();

      console.log("Devis généré:", generateResponse);

      // 3. Ouvrir le devis généré dans un nouvel onglet
      if (generateResponse.content?.url) {
        window.open(generateResponse.content.url, '_blank');
      }

      setPreviewMode(true);

    } catch (error) {
      console.error("Erreur lors de la génération du devis:", error);
      
      if (error.message) {
        alert(`Erreur: ${error.message}`);
      } else {
        alert("Une erreur est survenue lors de la génération du devis");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Télécharger le PDF
  const handleDownloadPDF = async () => {
    if (currentQuote?.id) {
      setIsGenerating(true);
      try {
        const generateResponse = await dispatch(generateQuotePDF({ 
          id: currentQuote.id, 
          format: 'pdf' 
        })).unwrap();
        
        if (generateResponse.content?.url) {
          const link = document.createElement('a');
          link.href = generateResponse.content.url;
          link.download = `Devis_${formData.quoteNumber}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error("Erreur de téléchargement:", error);
      } finally {
        setIsGenerating(false);
      }
    } else {
      await handleGenerateQuote();
    }
  };

  // Envoyer le devis par email
  const handleSendEmail = async () => {
    if (!currentQuote?.id) {
      alert("Veuillez d'abord générer le devis");
      return;
    }

    if (!formData.email) {
      alert("Veuillez renseigner l'email du client");
      return;
    }

    setIsSending(true);
    try {
      const response = await dispatch(sendQuoteByEmail({
        id: currentQuote.id,
        email: formData.email,
        message: `Bonjour,\n\nVeuillez trouver ci-joint le devis ${formData.quoteNumber} pour votre projet "${formData.projectName}".\n\nCordialement,`,
      })).unwrap();

      alert("Devis envoyé avec succès");
      setQuoteStatus("sent");
      
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      alert("Erreur lors de l'envoi du devis");
    } finally {
      setIsSending(false);
    }
  };

  // Mettre à jour le statut
  const handleStatusUpdate = async (status) => {
    if (!currentQuote?.id) {
      setQuoteStatus(status);
      return;
    }

    try {
      await dispatch(updateQuoteStatus({
        id: currentQuote.id,
        status: status
      })).unwrap();
      setQuoteStatus(status);
    } catch (error) {
      console.error("Erreur de mise à jour du statut:", error);
    }
  };

  // Impression
  const handlePrint = useReactToPrint({
    content: () => quoteRef.current,
    documentTitle: `Devis_${formData.quoteNumber}`,
  });

  // Réinitialiser le formulaire
  const resetForm = () => {
    dispatch(clearQuote());
    setFormData({
      quoteNumber: generateQuoteNumber(),
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      quoteType: "",
      projectName: "",
      projectDescription: "",
      startDate: "",
      deadline: "",
      budget: "",
      category: "",
      taxRate: 0.1925, //19.25,
      discountRate: 0,
      deposit: 0,
      depositType: "percentage",
      validUntil: "",
      additionalNotes: "",
      termsAndConditions: "Ce devis est valable 30 jours. Le paiement est dû à réception de la facture.",
    });
    setQuoteItems([{
      id: 1,
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0,
    }]);
    setQuoteStatus("draft");
    setPreviewMode(false);
  };

  // Récupérer le badge de statut
  const getStatusBadge = () => {
    const statusConfig = {
      draft: { label: "Brouillon", variant: "secondary", color: "gray" },
      sent: { label: "Envoyé", variant: "default", color: "blue" },
      accepted: { label: "Accepté", variant: "default", color: "green" },
      rejected: { label: "Refusé", variant: "destructive", color: "red" },
      expired: { label: "Expiré", variant: "outline", color: "orange" },
    };

    const config = statusConfig[quoteStatus] || statusConfig.draft;

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  // Rendu de la section active
  const renderActiveSection = () => {
    switch (activeSection) {
      case "client":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Informations client</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <div className="relative">
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="AAA"
                    required
                  />
                  <User className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <div className="relative">
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="BBBB"
                    required
                  />
                  <User className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@email.com"
                    required
                  />
                  <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+237 6XX XX XX XX"
                    required
                  />
                  <Phone className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="company">Entreprise</Label>
                <div className="relative">
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Nom de votre entreprise"
                  />
                  <Building2 className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="quoteType">Type de devis</Label>
                <select
                  id="quoteType"
                  name="quoteType"
                  value={formData.quoteType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Sélectionnez un type</option>
                  {quoteTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <div className="relative">
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Rue de la République"
                  />
                  <MapPin className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Douala"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="00237"
                />
              </div>
            </div>
          </div>
        );

      case "project":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Détails du projet</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Nom du projet *</Label>
                <Input
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="Ex: Rénovation salle de bain"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Description du projet</Label>
                <Textarea
                  id="projectDescription"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Décrivez votre projet en détail..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début prévue</Label>
                  <div className="relative">
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                    <Calendar className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Date limite / Validité</Label>
                  <div className="relative">
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleInputChange}
                    />
                    <Clock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget estimé (F CFA)</Label>
                <div className="relative">
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="500000"
                  />
                  <DollarSign className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">Devis valable jusqu'au</Label>
                <div className="relative">
                  <Input
                    id="validUntil"
                    name="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                  />
                  <Calendar className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>
            </div>
          </div>
        );

      case "items":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Articles du devis</h3>
              <Badge variant="outline">{quoteItems.length} article(s)</Badge>
            </div>

            <div className="space-y-4">
              {quoteItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 space-y-3 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Article {index + 1}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        onClick={() => moveItem(index, "up")}
                        disabled={index === 0}
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => moveItem(index, "down")}
                        disabled={index === quoteItems.length - 1}
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => duplicateQuoteItem(item.id)}
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        title="Dupliquer"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      {quoteItems.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeQuoteItem(item.id)}
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Description *</Label>
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateQuoteItem(item.id, "description", e.target.value)
                        }
                        placeholder="Ex: Fourniture et pose de carrelage"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Quantité</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            onClick={() =>
                              updateQuoteItem(
                                item.id,
                                "quantity",
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            variant="outline"
                            size="sm"
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuoteItem(
                                item.id,
                                "quantity",
                                Math.max(1, parseFloat(e.target.value) || 1)
                              )
                            }
                            className="text-center"
                            min="1"
                            step="0.01"
                          />
                          <Button
                            type="button"
                            onClick={() =>
                              updateQuoteItem(
                                item.id,
                                "quantity",
                                item.quantity + 1
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

                      <div className="space-y-2">
                        <Label>Prix unitaire</Label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateQuoteItem(
                              item.id,
                              "unitPrice",
                              Math.max(0, parseFloat(e.target.value) || 0)
                            )
                          }
                          placeholder="0"
                          min="0"
                          step="100"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Remise %</Label>
                        <Input
                          type="number"
                          value={item.discount}
                          onChange={(e) =>
                            updateQuoteItem(
                              item.id,
                              "discount",
                              Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))
                            )
                          }
                          placeholder="0"
                          min="0"
                          max="100"
                          step="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Total</Label>
                        <div className="flex items-center h-10 px-3 py-2 text-sm font-semibold rounded-lg bg-gray-50 text-primary">
                          {item.total.toLocaleString()} F
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              type="button"
              onClick={addQuoteItem}
              variant="outline"
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter un article
            </Button>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Paramètres de paiement</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taxRate">TVA (%)</Label>
                <Input
                  id="taxRate"
                  name="taxRate"
                  type="number"
                  value={formData.taxRate}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountRate">Remise globale (%)</Label>
                <Input
                  id="discountRate"
                  name="discountRate"
                  type="number"
                  value={formData.discountRate}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  step="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit">Acompte</Label>
                <div className="flex gap-2">
                  <Input
                    id="deposit"
                    name="deposit"
                    type="number"
                    value={formData.deposit}
                    onChange={handleInputChange}
                    min="0"
                    step={formData.depositType === "percentage" ? "1" : "1000"}
                    className="flex-1"
                  />
                  <select
                    name="depositType"
                    value={formData.depositType}
                    onChange={handleInputChange}
                    className="w-24 px-3 py-2 border rounded-md"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">F CFA</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Montant calculé</Label>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-sm">
                    <span className="text-gray-600">Total TTC: </span>
                    <span className="font-bold text-primary">{total.toLocaleString()} F</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Acompte: </span>
                    <span className="font-medium">{depositAmount.toLocaleString()} F</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Reste à payer: </span>
                    <span className="font-medium">{remainingAmount.toLocaleString()} F</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "notes":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Notes et conditions</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Notes additionnelles</Label>
                <Textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Ajoutez des notes, délais de livraison, garanties, etc..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Conditions générales</Label>
                <Textarea
                  id="termsAndConditions"
                  name="termsAndConditions"
                  value={formData.termsAndConditions}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Conditions de paiement, validité, pénalités..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Aperçu du devis
  const renderQuotePreview = () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    return (
      <div ref={quoteRef} className="max-w-4xl p-8 mx-auto bg-white border shadow-sm">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-emerald-600">DEVIS</h1>
              <p className="text-sm text-gray-500">N° {formData.quoteNumber}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-emerald-100">
                <FileText className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            {/* Client */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-600">CLIENT</h3>
              <p className="font-bold">{fullName || "Client"}</p>
              {formData.company && <p className="text-sm">{formData.company}</p>}
              <p className="text-sm text-gray-600">{formData.address}</p>
              <p className="text-sm text-gray-600">
                {formData.postalCode} {formData.city}
              </p>
              <p className="text-sm text-gray-600">Tél: {formData.phone}</p>
              <p className="text-sm text-gray-600">{formData.email}</p>
            </div>

            {/* Dates */}
            <div className="text-right">
              <p className="text-sm">
                <span className="text-gray-500">Date d'émission: </span>
                <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
              </p>
              {formData.deadline && (
                <p className="text-sm">
                  <span className="text-gray-500">Valable jusqu'au: </span>
                  <span className="font-medium">{new Date(formData.deadline).toLocaleDateString('fr-FR')}</span>
                </p>
              )}
              {formData.startDate && (
                <p className="text-sm">
                  <span className="text-gray-500">Début prévu: </span>
                  <span className="font-medium">{new Date(formData.startDate).toLocaleDateString('fr-FR')}</span>
                </p>
              )}
            </div>
          </div>

          {/* Projet */}
          {formData.projectName && (
            <div className="p-4 mt-6 rounded-lg bg-gray-50">
              <h3 className="mb-2 font-semibold">Projet: {formData.projectName}</h3>
              {formData.projectDescription && (
                <p className="text-sm text-gray-600">{formData.projectDescription}</p>
              )}
            </div>
          )}
        </div>

        {/* Tableau des articles */}
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-sm font-semibold text-left">Description</th>
              <th className="p-3 text-sm font-semibold text-right">Qté</th>
              <th className="p-3 text-sm font-semibold text-right">Prix unit.</th>
              <th className="p-3 text-sm font-semibold text-right">Remise</th>
              <th className="p-3 text-sm font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {quoteItems.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3 text-sm">{item.description || '-'}</td>
                <td className="p-3 text-sm text-right">{item.quantity}</td>
                <td className="p-3 text-sm text-right">{item.unitPrice.toLocaleString()} F</td>
                <td className="p-3 text-sm text-right">{item.discount > 0 ? `${item.discount}%` : '-'}</td>
                <td className="p-3 text-sm font-medium text-right">{item.total.toLocaleString()} F</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totaux */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total HT</span>
              <span className="font-medium">{subtotal.toLocaleString()} F</span>
            </div>
            {formData.discountRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remise ({formData.discountRate}%)</span>
                <span className="font-medium text-green-600">-{discountAmount.toLocaleString()} F</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total HT</span>
              <span className="font-medium">{subtotalAfterDiscount.toLocaleString()} F</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">TVA ({formData.taxRate}%)</span>
              <span className="font-medium">{taxAmount.toLocaleString()} F</span>
            </div>
            <div className="pt-2 mt-2 border-t-2 border-emerald-600">
              <div className="flex justify-between">
                <span className="font-bold">TOTAL TTC</span>
                <span className="font-bold text-emerald-600">{total.toLocaleString()} F</span>
              </div>
            </div>
            
            {depositAmount > 0 && (
              <div className="pt-2 mt-2 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Acompte</span>
                  <span className="font-medium">{depositAmount.toLocaleString()} F</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reste à payer</span>
                  <span className="font-medium">{remainingAmount.toLocaleString()} F</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes et conditions */}
        {formData.additionalNotes && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold">Notes :</h4>
            <p className="text-sm text-gray-600">{formData.additionalNotes}</p>
          </div>
        )}

        {formData.termsAndConditions && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">Conditions :</h4>
            <p className="text-xs text-gray-500">{formData.termsAndConditions}</p>
          </div>
        )}

        {/* Pied de page */}
        <div className="pt-4 mt-8 text-xs text-center text-gray-400 border-t">
          <p>Devis généré le {new Date().toLocaleDateString('fr-FR')} - Valable jusqu'au {formData.validUntil ? new Date(formData.validUntil).toLocaleDateString('fr-FR') : '30 jours'}</p>
        </div>

        {/* Statut */}
        {quoteStatus !== 'draft' && (
          <div className="absolute top-8 right-8">
            <Badge className={`
              ${quoteStatus === 'accepted' ? 'bg-green-100 text-green-800' : ''}
              ${quoteStatus === 'rejected' ? 'bg-red-100 text-red-800' : ''}
              ${quoteStatus === 'sent' ? 'bg-blue-100 text-blue-800' : ''}
              ${quoteStatus === 'expired' ? 'bg-orange-100 text-orange-800' : ''}
            `}>
              {quoteStatus === 'accepted' && '✓ ACCEPTÉ'}
              {quoteStatus === 'rejected' && '✗ REFUSÉ'}
              {quoteStatus === 'sent' && '📧 ENVOYÉ'}
              {quoteStatus === 'expired' && '⏰ EXPIRÉ'}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-white">
        <div className="container px-4 py-12 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-emerald-500/10">
              <FileText className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="mb-4 text-4xl font-bold">Générer un Devis</h1>
            <p className="text-lg text-gray-600">
              Créez des devis professionnels personnalisés en quelques minutes
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

      {/* Messages d'erreur */}
      {error && (
        <div className="container px-4 mx-auto mt-4">
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="container px-4 py-12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Colonne latérale - Navigation */}
            <div className="space-y-4 lg:col-span-1">
              {/* Navigation des sections */}
              <div className="border rounded-lg">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Sections</h3>
                </div>
                <div className="p-2 space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isComplete = section.id === "items" 
                      ? quoteItems.length > 0 && quoteItems.every(i => i.description && i.unitPrice > 0)
                      : formData[section.id === "client" ? "firstName" : 
                               section.id === "project" ? "projectName" : 
                               section.id === "payment" ? "taxRate" : 
                               "additionalNotes"] || 
                               (section.id === "items" && quoteItems.length > 0);

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? "bg-emerald-600 text-white"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{section.name}</span>
                        </div>
                        {isComplete && (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progression */}
              <div className="p-4 border rounded-lg">
                <h3 className="mb-3 font-semibold">Progression</h3>
                <div className="space-y-3">
                  {sections.map((section) => {
                    const isComplete = section.id === "items" 
                      ? quoteItems.length > 0 && quoteItems.every(i => i.description && i.unitPrice > 0)
                      : formData[section.id === "client" ? "firstName" : 
                               section.id === "project" ? "projectName" : 
                               section.id === "payment" ? "taxRate" : 
                               "additionalNotes"] || 
                               (section.id === "items" && quoteItems.length > 0);

                    return (
                      <div key={section.id} className="flex items-center gap-3">
                        {isComplete ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 border border-gray-300 rounded-full" />
                        )}
                        <span className="text-sm">{section.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="p-4 border rounded-lg">
                <h3 className="mb-3 font-semibold">Actions</h3>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start w-full gap-2"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    <Eye className="w-4 h-4" />
                    {previewMode ? "Masquer l'aperçu" : "Aperçu"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start w-full gap-2"
                    onClick={resetForm}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Nouveau devis
                  </Button>

                  <Button
                    type="button"
                    variant="default"
                    className="justify-start w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleGenerateQuote}
                    disabled={isGenerating || !isFormValid()}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Générer le devis
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Gestion du statut */}
              {currentQuote?.id && (
                <div className="p-4 border rounded-lg">
                  <h3 className="mb-3 font-semibold">Statut</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant={quoteStatus === "draft" ? "default" : "outline"}
                      onClick={() => handleStatusUpdate("draft")}
                      className="text-xs"
                    >
                      Brouillon
                    </Button>
                    <Button
                      size="sm"
                      variant={quoteStatus === "sent" ? "default" : "outline"}
                      onClick={() => handleStatusUpdate("sent")}
                      className="text-xs"
                    >
                      Envoyé
                    </Button>
                    <Button
                      size="sm"
                      variant={quoteStatus === "accepted" ? "default" : "outline"}
                      onClick={() => handleStatusUpdate("accepted")}
                      className="text-xs bg-green-600 hover:bg-green-700"
                    >
                      Accepté
                    </Button>
                    <Button
                      size="sm"
                      variant={quoteStatus === "rejected" ? "default" : "outline"}
                      onClick={() => handleStatusUpdate("rejected")}
                      className="text-xs bg-red-600 hover:bg-red-700"
                    >
                      Refusé
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Contenu principal */}
            <div className={`${previewMode ? "lg:col-span-3" : "lg:col-span-3"}`}>
              {previewMode ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Aperçu du devis</h2>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewMode(false)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleDownloadPDF}
                        disabled={isGenerating}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isGenerating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        Télécharger PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSendEmail}
                        disabled={isSending || !formData.email}
                        className="gap-2"
                      >
                        {isSending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Envoyer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Imprimer
                      </Button>
                    </div>
                  </div>

                  <div className="relative overflow-hidden border rounded-lg">
                    {renderQuotePreview()}
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg">
                  <div className="p-6">
                    {renderActiveSection()}
                  </div>

                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {activeSection === "client" && "Informations de base du client"}
                      {activeSection === "project" && "Détails et description du projet"}
                      {activeSection === "items" && "Articles et services à facturer"}
                      {activeSection === "payment" && "Paramètres financiers et TVA"}
                      {activeSection === "notes" && "Notes et conditions générales"}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const currentIndex = sections.findIndex(s => s.id === activeSection);
                          if (currentIndex > 0) {
                            setActiveSection(sections[currentIndex - 1].id);
                          }
                        }}
                        disabled={sections.findIndex(s => s.id === activeSection) === 0}
                      >
                        Précédent
                      </Button>
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => {
                          const currentIndex = sections.findIndex(s => s.id === activeSection);
                          if (currentIndex < sections.length - 1) {
                            setActiveSection(sections[currentIndex + 1].id);
                          }
                        }}
                        disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Récapitulatif flottant */}
      {!previewMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 w-80"
        >
          <div className="p-4 bg-white border shadow-lg rounded-xl">
            <h4 className="mb-3 font-semibold">Récapitulatif</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total HT</span>
                <span>{subtotal.toLocaleString()} F</span>
              </div>
              {formData.discountRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remise</span>
                  <span className="text-green-600">-{discountAmount.toLocaleString()} F</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TVA ({formData.taxRate}%)</span>
                <span>{taxAmount.toLocaleString()} F</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total TTC</span>
                <span className="text-emerald-600">{total.toLocaleString()} F</span>
              </div>
            </div>

            {!isFormValid() && (
              <div className="p-2 mt-3 text-xs text-yellow-700 rounded bg-yellow-50">
                <AlertCircle className="inline w-3 h-3 mr-1" />
                Champs requis incomplets
              </div>
            )}

            {isFormValid() && (
              <Button
                type="button"
                onClick={handleGenerateQuote}
                disabled={isGenerating}
                className="w-full gap-2 mt-3 bg-emerald-600 hover:bg-emerald-700"
                size="sm"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Générer
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Composant Input manquant (si non importé)
const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${className}`}
    {...props}
  />
);

export default QuotePage;