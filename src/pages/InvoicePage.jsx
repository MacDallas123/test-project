import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit2 } from "lucide-react";
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
  Trash2,
  Send,
  Download,
  CheckCircle,
  AlertCircle,
  CreditCard,
  FileCheck,
  Sparkles,
  Shield,
  Receipt,
  Hash,
  Percent,
  DollarSign,
  Printer,
  Save,
  Eye,
  Check,
  X,
  Loader2,
  Copy,
  RefreshCw,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import {
  selectCurrentInvoice,
  selectInvoiceLoading,
  selectInvoiceError,
  selectGeneratedPDF,
  createInvoice,
  updateInvoiceById,
  generateInvoicePDF,
  sendInvoiceByEmail,
  clearInvoice,
  clearError,
  fetchInvoiceById,
} from "@/redux/slices/invoiceSlice";
import { Input } from "@/components/ui/input";

const InvoicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pour l'édition d'une facture existante
  const invoiceRef = useRef();
  const dispatch = useDispatch();

  // États Redux
  const currentInvoice = useSelector(selectCurrentInvoice);
  const loading = useSelector(selectInvoiceLoading);
  const error = useSelector(selectInvoiceError);
  const generatedPDF = useSelector(selectGeneratedPDF);

  // États locaux
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeSection, setActiveSection] = useState("invoice");

  // Génération du numéro de facture
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");
    return `INV-${year}${month}-${random}`;
  };

  // État du formulaire
  const [formData, setFormData] = useState({
    // Informations de la facture
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    purchaseOrder: "",
    
    // Informations de l'émetteur (votre entreprise)
    companyName: "fibem",
    companyAddress: "fibem address",
    companyCity: "vernand",
    companyPostalCode: "xxx - unknow",
    companyPhone: "+33 xx xx xx x",
    companyEmail: "email@gmail.com",
    companyTaxId: "",
    companyLogo: "",

    // Informations du client
    clientName: "Client",
    clientCompany: "companie client",
    clientEmail: "client@gmail.com",
    clientPhone: "+237 xxx xxx xxx",
    clientAddress: "Adresse",
    clientCity: "Yaounde",
    clientPostalCode: "BP xxx - Yaounde",
    clientTaxId: "",

    // Conditions de paiement
    paymentTerms: "30",
    paymentMethod: "",
    bankName: "",
    bankAccount: "",
    
    // Notes
    notes: "",
    termsAndConditions: "",
  });

  // État des lignes de facturation
  const [invoiceItems, setInvoiceItems] = useState([
    {
      id: 1,
      description: "Développement application web",
      quantity: 1,
      unitPrice: 100000,
      discount: 10,
      taxRate: 18,
      total: 0,
    },
    {
      id: 2,
      description: "Maintenance",
      quantity: 2,
      unitPrice: 50000,
      discount: 0,
      taxRate: 18,
      total: 0,
    },
    {
      id: 3,
      description: "Hébergement annuel",
      quantity: 1,
      unitPrice: 20000,
      discount: 0,
      taxRate: 18,
      total: 0,
    },
  ]);

  // État du statut de la facture
  const [invoiceStatus, setInvoiceStatus] = useState("draft"); // draft, sent, paid, overdue

  // Charger les données si édition
  useEffect(() => {
    if (id) {
      dispatch(fetchInvoiceById(id));
    }
  }, [id, dispatch]);

  // Mettre à jour le formulaire quand currentInvoice change
  useEffect(() => {
    if (currentInvoice) {
      // Remplir le formulaire avec les données existantes
      setFormData({
        invoiceNumber: currentInvoice.invoiceNumber || generateInvoiceNumber(),
        invoiceDate: currentInvoice.invoiceDate || new Date().toISOString().split("T")[0],
        dueDate: currentInvoice.dueDate || "",
        purchaseOrder: currentInvoice.purchaseOrder || "",
        companyName: currentInvoice.companyName || "",
        companyAddress: currentInvoice.companyAddress || "",
        companyCity: currentInvoice.companyCity || "",
        companyPostalCode: currentInvoice.companyPostalCode || "",
        companyPhone: currentInvoice.companyPhone || "",
        companyEmail: currentInvoice.companyEmail || "",
        companyTaxId: currentInvoice.companyTaxId || "",
        companyLogo: currentInvoice.companyLogo || "",
        clientName: currentInvoice.clientName || "",
        clientCompany: currentInvoice.clientCompany || "",
        clientEmail: currentInvoice.clientEmail || "",
        clientPhone: currentInvoice.clientPhone || "",
        clientAddress: currentInvoice.clientAddress || "",
        clientCity: currentInvoice.clientCity || "",
        clientPostalCode: currentInvoice.clientPostalCode || "",
        clientTaxId: currentInvoice.clientTaxId || "",
        paymentTerms: currentInvoice.paymentTerms || "30",
        paymentMethod: currentInvoice.paymentMethod || "",
        bankName: currentInvoice.bankName || "",
        bankAccount: currentInvoice.bankAccount || "",
        notes: currentInvoice.notes || "",
        termsAndConditions: currentInvoice.termsAndConditions || "",
      });

      if (currentInvoice.invoiceItems) {
        setInvoiceItems(currentInvoice.invoiceItems);
      }

      if (currentInvoice.invoiceStatus) {
        setInvoiceStatus(currentInvoice.invoiceStatus);
      }
    }
  }, [currentInvoice]);

  // Effacer les erreurs
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Options de méthodes de paiement
  const paymentMethods = [
    { value: "bank_transfer", label: "Virement Bancaire", icon: "🏦" },
    { value: "mobile_money", label: "Mobile Money", icon: "📱" },
    { value: "cash", label: "Espèces", icon: "💵" },
    { value: "check", label: "Chèque", icon: "📝" },
    { value: "card", label: "Carte Bancaire", icon: "💳" },
  ];

  // Sections du formulaire
  const sections = [
    { id: "invoice", name: "Informations facture", icon: FileText },
    { id: "company", name: "Votre entreprise", icon: Building2 },
    { id: "client", name: "Client", icon: User },
    { id: "items", name: "Articles", icon: Package },
    { id: "payment", name: "Paiement", icon: CreditCard },
    { id: "notes", name: "Notes", icon: FileCheck },
  ];

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculer la date d'échéance automatiquement
  const handleInvoiceDateChange = (e) => {
    const invoiceDate = e.target.value;
    const paymentTerms = parseInt(formData.paymentTerms) || 30;
    
    const date = new Date(invoiceDate);
    date.setDate(date.getDate() + paymentTerms);
    const dueDate = date.toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      invoiceDate,
      dueDate,
    }));
  };

  const handlePaymentTermsChange = (e) => {
    const paymentTerms = e.target.value;
    
    if (formData.invoiceDate) {
      const date = new Date(formData.invoiceDate);
      date.setDate(date.getDate() + parseInt(paymentTerms));
      const dueDate = date.toISOString().split("T")[0];

      setFormData((prev) => ({
        ...prev,
        paymentTerms,
        dueDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        paymentTerms,
      }));
    }
  };

  // Gestion des lignes de facturation
  const addInvoiceItem = () => {
    const newId = Math.max(...invoiceItems.map((item) => item.id), 0) + 1;
    setInvoiceItems([
      ...invoiceItems,
      {
        id: newId,
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        taxRate: 18,
        total: 0,
      },
    ]);
  };

  const updateInvoiceItem = (id, field, value) => {
    setInvoiceItems(
      invoiceItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Calcul du total de la ligne
          const quantity = field === "quantity" ? parseFloat(value) || 0 : updatedItem.quantity;
          const unitPrice = field === "unitPrice" ? parseFloat(value) || 0 : updatedItem.unitPrice;
          const discount = field === "discount" ? parseFloat(value) || 0 : updatedItem.discount;
          const taxRate = field === "taxRate" ? parseFloat(value) || 0 : updatedItem.taxRate;
          
          const subtotal = quantity * unitPrice;
          const discountAmount = subtotal * (discount / 100);
          const subtotalAfterDiscount = subtotal - discountAmount;
          const taxAmount = subtotalAfterDiscount * (taxRate / 100);
          const total = subtotalAfterDiscount + taxAmount;
          
          updatedItem.total = total;
          
          return updatedItem;
        }
        return item;
      }),
    );
  };

  const removeInvoiceItem = (id) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
    }
  };

  const duplicateInvoiceItem = (id) => {
    const itemToDuplicate = invoiceItems.find((item) => item.id === id);
    if (itemToDuplicate) {
      const newId = Math.max(...invoiceItems.map((item) => item.id), 0) + 1;
      setInvoiceItems([
        ...invoiceItems,
        { ...itemToDuplicate, id: newId },
      ]);
    }
  };

  // Calculs financiers
  const subtotal = invoiceItems.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);

  const totalDiscount = invoiceItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    return sum + (itemSubtotal * (item.discount / 100));
  }, 0);

  const subtotalAfterDiscount = subtotal - totalDiscount;

  const totalTax = invoiceItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const discountAmount = itemSubtotal * (item.discount / 100);
    const subtotalAfterDiscount = itemSubtotal - discountAmount;
    return sum + (subtotalAfterDiscount * (item.taxRate / 100));
  }, 0);

  const total = invoiceItems.reduce((sum, item) => sum + item.total, 0);

  // Validation du formulaire
  const isFormValid = () => {
    const requiredFields = [
      "invoiceNumber",
      "invoiceDate",
      "companyName",
      "clientName",
      "paymentMethod",
    ];
    const hasRequiredFields = requiredFields.every(
      (field) => formData[field]?.toString().trim() !== "",
    );
    const hasValidItems = invoiceItems.every(
      (item) => item.description?.trim() !== "" && item.unitPrice > 0,
    );
    return hasRequiredFields && hasValidItems;
  };

  // Génération de la facture
  const handleGenerateInvoice = async () => {
    setIsGenerating(true);
    
    try {
      // 1. Préparer les données de la facture
      const invoicePayload = {
        ...formData,
        invoiceItems: invoiceItems.map(({ id, ...item }) => item), // Enlever l'id local
        invoiceStatus: invoiceStatus,
        total: total,
      };

      let invoiceId;

      if (currentInvoice?.id) {
        // Mettre à jour la facture existante
        // console.log("DATAS :", invoicePayload);
        const updateResponse = await dispatch(updateInvoiceById({ 
          id: currentInvoice.id, 
          data: invoicePayload 
        })).unwrap();
        invoiceId = currentInvoice.id;
        console.log("Facture mise à jour:", updateResponse);
      } else {
        // Créer une nouvelle facture
        const createResponse = await dispatch(createInvoice(invoicePayload)).unwrap();
        invoiceId = createResponse.content.id;
        console.log("Facture créée:", createResponse);
      }

      if (!invoiceId) {
        throw new Error("Impossible de récupérer l'ID de la facture");
      }

      // 2. Générer le PDF
      const generateResponse = await dispatch(generateInvoicePDF({ 
        id: invoiceId, 
        format: 'pdf' 
      })).unwrap();

      console.log("Facture générée:", generateResponse);

      // 3. Ouvrir la facture générée dans un nouvel onglet
      if (generateResponse.content?.url) {
        window.open(generateResponse.content.url, '_blank');
      }

      setPreviewMode(true);

    } catch (error) {
      console.error("Erreur lors de la génération de la facture:", error);
      
      if (error.message) {
        alert(`Erreur: ${error.message}`);
      } else {
        alert("Une erreur est survenue lors de la génération de la facture");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Télécharger le PDF
  const handleDownloadPDF = async () => {
    if (currentInvoice?.id) {
      setIsGenerating(true);
      try {
        const generateResponse = await dispatch(generateInvoicePDF({ 
          id: currentInvoice.id, 
          format: 'pdf' 
        })).unwrap();
        
        if (generateResponse.content?.url) {
          const link = document.createElement('a');
          link.href = generateResponse.content.url;
          link.download = `Facture_${formData.invoiceNumber}.pdf`;
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
      await handleGenerateInvoice();
    }
  };

  // Envoyer la facture par email
  const handleSendEmail = async () => {
    if (!currentInvoice?.id) {
      alert("Veuillez d'abord générer la facture");
      return;
    }

    if (!formData.clientEmail) {
      alert("Veuillez renseigner l'email du client");
      return;
    }

    setIsSending(true);
    try {
      const response = await dispatch(sendInvoiceByEmail({
        id: currentInvoice.id,
        email: formData.clientEmail,
        message: `Veuillez trouver ci-joint la facture ${formData.invoiceNumber}`,
      })).unwrap();

      alert("Facture envoyée avec succès");
      setInvoiceStatus("sent");
      
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      alert("Erreur lors de l'envoi de la facture");
    } finally {
      setIsSending(false);
    }
  };

  // Impression
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Facture_${formData.invoiceNumber}`,
  });

  // Sauvegarder comme brouillon
  const saveAsDraft = () => {
    setInvoiceStatus("draft");
    if (currentInvoice?.id) {
      handleGenerateInvoice();
    } else {
      alert("Facture enregistrée comme brouillon");
    }
  };

  // Marquer comme envoyée
  const markAsSent = () => {
    setInvoiceStatus("sent");
    if (currentInvoice?.id) {
      handleGenerateInvoice();
    }
  };

  // Marquer comme payée
  const markAsPaid = () => {
    setInvoiceStatus("paid");
    if (currentInvoice?.id) {
      handleGenerateInvoice();
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    dispatch(clearInvoice());
    setFormData({
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      purchaseOrder: "",
      companyName: "",
      companyAddress: "",
      companyCity: "",
      companyPostalCode: "",
      companyPhone: "",
      companyEmail: "",
      companyTaxId: "",
      companyLogo: "",
      clientName: "",
      clientCompany: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      clientCity: "",
      clientPostalCode: "",
      clientTaxId: "",
      paymentTerms: "30",
      paymentMethod: "",
      bankName: "",
      bankAccount: "",
      notes: "",
      termsAndConditions: "",
    });
    setInvoiceItems([{
      id: 1,
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      total: 0,
    }]);
    setInvoiceStatus("draft");
    setPreviewMode(false);
  };

  // Récupérer le badge de statut
  const getStatusBadge = () => {
    const statusConfig = {
      draft: { label: "Brouillon", variant: "secondary", color: "gray" },
      sent: { label: "Envoyée", variant: "default", color: "blue" },
      paid: { label: "Payée", variant: "default", color: "green" },
      overdue: { label: "En retard", variant: "destructive", color: "red" },
    };

    const config = statusConfig[invoiceStatus] || statusConfig.draft;

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  // Rendu de la section active
  const renderActiveSection = () => {
    switch (activeSection) {
      case "invoice":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Informations de la facture</h3>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Numéro de facture *</Label>
                <div className="relative">
                  <Input
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleInputChange}
                    className="pr-10 font-mono"
                    required
                  />
                  <Hash className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="purchaseOrder">Bon de commande</Label>
                <Input
                  id="purchaseOrder"
                  name="purchaseOrder"
                  value={formData.purchaseOrder}
                  onChange={handleInputChange}
                  placeholder="PO-2026-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Date de facture *</Label>
                <div className="relative">
                  <Input
                    id="invoiceDate"
                    name="invoiceDate"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={handleInvoiceDateChange}
                    required
                  />
                  <Calendar className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d'échéance</Label>
                <div className="relative">
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                  />
                  <Clock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Conditions de paiement</Label>
                <select
                  id="paymentTerms"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handlePaymentTermsChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="0">Immédiat</option>
                  <option value="7">7 jours</option>
                  <option value="15">15 jours</option>
                  <option value="30">30 jours</option>
                  <option value="45">45 jours</option>
                  <option value="60">60 jours</option>
                  <option value="90">90 jours</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Méthode de paiement *</Label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Sélectionnez</option>
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.icon} {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case "company":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Votre entreprise</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Votre Entreprise SARL"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyAddress">Adresse</Label>
                <Input
                  id="companyAddress"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleInputChange}
                  placeholder="123 Avenue de la République"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyCity">Ville</Label>
                <Input
                  id="companyCity"
                  name="companyCity"
                  value={formData.companyCity}
                  onChange={handleInputChange}
                  placeholder="Douala"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyPostalCode">Code postal</Label>
                <Input
                  id="companyPostalCode"
                  name="companyPostalCode"
                  value={formData.companyPostalCode}
                  onChange={handleInputChange}
                  placeholder="00237"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyPhone">Téléphone</Label>
                <div className="relative">
                  <Input
                    id="companyPhone"
                    name="companyPhone"
                    value={formData.companyPhone}
                    onChange={handleInputChange}
                    placeholder="+237 6XX XX XX XX"
                  />
                  <Phone className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email</Label>
                <div className="relative">
                  <Input
                    id="companyEmail"
                    name="companyEmail"
                    type="email"
                    value={formData.companyEmail}
                    onChange={handleInputChange}
                    placeholder="contact@votreentreprise.com"
                  />
                  <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyTaxId">N° Identification Fiscale</Label>
                <Input
                  id="companyTaxId"
                  name="companyTaxId"
                  value={formData.companyTaxId}
                  onChange={handleInputChange}
                  placeholder="FR12345678901"
                />
              </div>
            </div>
          </div>
        );

      case "client":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Informations du client</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientName">Nom du client *</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="AAAA"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientCompany">Entreprise du client</Label>
                <Input
                  id="clientCompany"
                  name="clientCompany"
                  value={formData.clientCompany}
                  onChange={handleInputChange}
                  placeholder="Client Entreprise SA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email</Label>
                <div className="relative">
                  <Input
                    id="clientEmail"
                    name="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    placeholder="client@email.com"
                  />
                  <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">Téléphone</Label>
                <div className="relative">
                  <Input
                    id="clientPhone"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                    placeholder="+237 6XX XX XX XX"
                  />
                  <Phone className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientAddress">Adresse</Label>
                <Input
                  id="clientAddress"
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleInputChange}
                  placeholder="456 Boulevard Principal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientCity">Ville</Label>
                <Input
                  id="clientCity"
                  name="clientCity"
                  value={formData.clientCity}
                  onChange={handleInputChange}
                  placeholder="Yaoundé"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPostalCode">Code postal</Label>
                <Input
                  id="clientPostalCode"
                  name="clientPostalCode"
                  value={formData.clientPostalCode}
                  onChange={handleInputChange}
                  placeholder="00237"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientTaxId">N° Identification Fiscale</Label>
                <Input
                  id="clientTaxId"
                  name="clientTaxId"
                  value={formData.clientTaxId}
                  onChange={handleInputChange}
                  placeholder="FR98765432101"
                />
              </div>
            </div>
          </div>
        );

      case "items":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Lignes de facturation</h3>
              <Badge variant="outline">{invoiceItems.length} article(s)</Badge>
            </div>

            <div className="space-y-4">
              {invoiceItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 space-y-3 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Ligne {index + 1}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        onClick={() => duplicateInvoiceItem(item.id)}
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        title="Dupliquer"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      {invoiceItems.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeInvoiceItem(item.id)}
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
                          updateInvoiceItem(item.id, "description", e.target.value)
                        }
                        placeholder="Ex: Développement application web"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                      <div className="space-y-2">
                        <Label>Qté</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateInvoiceItem(
                              item.id,
                              "quantity",
                              Math.max(1, parseFloat(e.target.value) || 1)
                            )
                          }
                          min="1"
                          step="0.01"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Prix U.</Label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateInvoiceItem(
                              item.id,
                              "unitPrice",
                              Math.max(0, parseFloat(e.target.value) || 0)
                            )
                          }
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Remise %</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) =>
                              updateInvoiceItem(
                                item.id,
                                "discount",
                                Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))
                              )
                            }
                            placeholder="0"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                          <Percent className="absolute w-3 h-3 text-gray-400 transform -translate-y-1/2 pointer-events-none right-2 top-1/2" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>TVA %</Label>
                        <Input
                          type="number"
                          value={item.taxRate}
                          onChange={(e) =>
                            updateInvoiceItem(
                              item.id,
                              "taxRate",
                              Math.max(0, parseFloat(e.target.value) || 0)
                            )
                          }
                          placeholder="18"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Total</Label>
                        <div className="flex items-center h-10 px-3 py-2 text-sm font-semibold rounded-lg bg-gray-50 text-primary">
                          {item.total.toLocaleString()} XOF
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button
              type="button"
              onClick={addInvoiceItem}
              variant="outline"
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter une ligne
            </Button>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Informations de paiement</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Nom de la banque</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="Banque Atlantique"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccount">Numéro de compte / IBAN</Label>
                <Input
                  id="bankAccount"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleInputChange}
                  placeholder="CM12 3456 7890 1234 5678 9012"
                />
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
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Merci pour votre confiance..."
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
                  placeholder="Paiement à réception de facture. Toute facture impayée après la date d'échéance entraînera des pénalités de retard..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Aperçu de la facture
  const renderInvoicePreview = () => {
    return (
      <div ref={invoiceRef} className="max-w-4xl p-8 mx-auto bg-white border shadow-sm">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">FACTURE</h1>
              <p className="text-sm text-gray-500">N° {formData.invoiceNumber}</p>
            </div>
            <div className="text-right">
              {formData.companyLogo ? (
                <img src={formData.companyLogo} alt="Logo" className="h-16" />
              ) : (
                <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            {/* Émetteur */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-600">ÉMETTEUR</h3>
              <p className="font-bold">{formData.companyName || "Votre entreprise"}</p>
              <p className="text-sm text-gray-600">{formData.companyAddress}</p>
              <p className="text-sm text-gray-600">
                {formData.companyPostalCode} {formData.companyCity}
              </p>
              {formData.companyPhone && (
                <p className="text-sm text-gray-600">Tél: {formData.companyPhone}</p>
              )}
              {formData.companyEmail && (
                <p className="text-sm text-gray-600">{formData.companyEmail}</p>
              )}
              {formData.companyTaxId && (
                <p className="text-sm text-gray-600">NIF: {formData.companyTaxId}</p>
              )}
            </div>

            {/* Client */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-600">CLIENT</h3>
              {formData.clientCompany && (
                <p className="font-bold">{formData.clientCompany}</p>
              )}
              <p className="font-medium">{formData.clientName || "Client"}</p>
              <p className="text-sm text-gray-600">{formData.clientAddress}</p>
              <p className="text-sm text-gray-600">
                {formData.clientPostalCode} {formData.clientCity}
              </p>
              {formData.clientPhone && (
                <p className="text-sm text-gray-600">Tél: {formData.clientPhone}</p>
              )}
              {formData.clientEmail && (
                <p className="text-sm text-gray-600">{formData.clientEmail}</p>
              )}
              {formData.clientTaxId && (
                <p className="text-sm text-gray-600">NIF: {formData.clientTaxId}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-500">Date de facture</p>
              <p className="font-medium">
                {new Date(formData.invoiceDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date d'échéance</p>
              <p className="font-medium">
                {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString('fr-FR') : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bon de commande</p>
              <p className="font-medium">{formData.purchaseOrder || '-'}</p>
            </div>
          </div>
        </div>

        {/* Tableau des articles */}
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-sm font-semibold text-left">Description</th>
              <th className="p-3 text-sm font-semibold text-right">Qté</th>
              <th className="p-3 text-sm font-semibold text-right">Prix unit.</th>
              <th className="p-3 text-sm font-semibold text-right">Remise</th>
              <th className="p-3 text-sm font-semibold text-right">TVA</th>
              <th className="p-3 text-sm font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3 text-sm">{item.description || '-'}</td>
                <td className="p-3 text-sm text-right">{item.quantity}</td>
                <td className="p-3 text-sm text-right">{item.unitPrice.toLocaleString()} XOF</td>
                <td className="p-3 text-sm text-right">{item.discount > 0 ? `${item.discount}%` : '-'}</td>
                <td className="p-3 text-sm text-right">{item.taxRate > 0 ? `${item.taxRate}%` : '-'}</td>
                <td className="p-3 text-sm font-medium text-right">{item.total.toLocaleString()} XOF</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totaux */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total HT</span>
              <span className="font-medium">{subtotal.toLocaleString()} XOF</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remise totale</span>
                <span className="font-medium text-green-600">-{totalDiscount.toLocaleString()} XOF</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total HT</span>
              <span className="font-medium">{subtotalAfterDiscount.toLocaleString()} XOF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">TVA</span>
              <span className="font-medium">{totalTax.toLocaleString()} XOF</span>
            </div>
            <div className="pt-2 mt-2 border-t-2 border-primary">
              <div className="flex justify-between">
                <span className="font-bold">TOTAL TTC</span>
                <span className="font-bold text-primary">{total.toLocaleString()} XOF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes et conditions */}
        {formData.notes && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold">Notes :</h4>
            <p className="text-sm text-gray-600">{formData.notes}</p>
          </div>
        )}

        {formData.termsAndConditions && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">Conditions générales :</h4>
            <p className="text-xs text-gray-500">{formData.termsAndConditions}</p>
          </div>
        )}

        {/* Informations bancaires */}
        {(formData.bankName || formData.bankAccount) && (
          <div className="p-3 mt-6 rounded-lg bg-gray-50">
            <h4 className="mb-2 text-sm font-semibold">Coordonnées bancaires :</h4>
            {formData.bankName && <p className="text-xs text-gray-600">Banque : {formData.bankName}</p>}
            {formData.bankAccount && <p className="text-xs text-gray-600">IBAN : {formData.bankAccount}</p>}
          </div>
        )}

        {/* Pied de page */}
        <div className="pt-4 mt-8 text-xs text-center text-gray-400 border-t">
          <p>Facture générée le {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    );
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
              <Receipt className="w-8 h-8 text-primary" />
            </div>
            <h1 className="mb-4 text-4xl font-bold">Générer une Facture</h1>
            <p className="text-lg text-gray-600">
              Créez des factures professionnelles en quelques clics
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <span className="font-mono text-sm text-gray-700">
                  {formData.invoiceNumber}
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
                      ? invoiceItems.length > 0 && invoiceItems.every(i => i.description && i.unitPrice > 0)
                      : formData[section.id === "invoice" ? "invoiceNumber" : 
                               section.id === "company" ? "companyName" :
                               section.id === "client" ? "clientName" :
                               section.id === "payment" ? "paymentMethod" : 
                               section.id === "notes" ? "notes" : ""] || 
                               (section.id === "items" && invoiceItems.length > 0);

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? "bg-primary text-primary-foreground"
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
                      ? invoiceItems.length > 0 && invoiceItems.every(i => i.description && i.unitPrice > 0)
                      : formData[section.id === "invoice" ? "invoiceNumber" : 
                               section.id === "company" ? "companyName" :
                               section.id === "client" ? "clientName" :
                               section.id === "payment" ? "paymentMethod" : 
                               section.id === "notes" ? "notes" : ""] || 
                               (section.id === "items" && invoiceItems.length > 0);

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
                    Nouvelle facture
                  </Button>

                  <Button
                    type="button"
                    variant="default"
                    className="justify-start w-full gap-2"
                    onClick={handleGenerateInvoice}
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
                        Générer la facture
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className={`${previewMode ? "lg:col-span-3" : "lg:col-span-3"}`}>
              {previewMode ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Aperçu de la facture</h2>
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
                        className="gap-2"
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
                        disabled={isSending || !formData.clientEmail}
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

                  <div className="overflow-hidden border rounded-lg">
                    {renderInvoicePreview()}
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg">
                  <div className="p-6">
                    {renderActiveSection()}
                  </div>

                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      {activeSection === "invoice" && "Informations de base de la facture"}
                      {activeSection === "company" && "Informations sur votre entreprise"}
                      {activeSection === "client" && "Informations sur le client"}
                      {activeSection === "items" && "Articles et services facturés"}
                      {activeSection === "payment" && "Coordonnées bancaires"}
                      {activeSection === "notes" && "Notes et conditions"}
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
                <span>{subtotal.toLocaleString()} XOF</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remise</span>
                  <span className="text-green-600">-{totalDiscount.toLocaleString()} XOF</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TVA</span>
                <span>{totalTax.toLocaleString()} XOF</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total TTC</span>
                <span className="text-primary">{total.toLocaleString()} XOF</span>
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
                onClick={handleGenerateInvoice}
                disabled={isGenerating}
                className="w-full gap-2 mt-3"
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

export default InvoicePage;