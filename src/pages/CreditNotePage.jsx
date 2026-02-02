// CreditNotePage.jsx - Page de génération d'avoirs
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
  Percent,
  DollarSign,
  Printer,
  Save,
  Eye,
  Check,
  X,
  RotateCcw,
  AlertTriangle,
  FileX,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const CreditNotePage = () => {
  const navigate = useNavigate();

  // Génération du numéro d'avoir
  const generateCreditNoteNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");
    // return `AV-${year}${month}-${random}`;
    return `AV 0001`;
  };

  // État du formulaire
  const [formData, setFormData] = useState({
    // Informations de l'avoir
    creditNoteNumber: generateCreditNoteNumber(),
    creditNoteDate: new Date().toISOString().split("T")[0],
    originalInvoiceNumber: "",
    originalInvoiceDate: "",
    creditReason: "",
    
    // Informations de l'émetteur (votre entreprise)
    companyName: "",
    companyAddress: "",
    companyCity: "",
    companyPostalCode: "",
    companyPhone: "",
    companyEmail: "",
    companyTaxId: "",

    // Informations du client
    clientName: "",
    clientCompany: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    clientCity: "",
    clientPostalCode: "",
    clientTaxId: "",

    // Modalité de remboursement
    refundMethod: "",
    
    // Notes
    notes: "",
    internalNotes: "",
  });

  // Options de raisons d'avoir
  const creditReasons = [
    { value: "product_return", label: "Retour de marchandise", icon: "📦" },
    { value: "defective_product", label: "Produit défectueux", icon: "⚠️" },
    { value: "billing_error", label: "Erreur de facturation", icon: "❌" },
    { value: "discount", label: "Remise commerciale", icon: "💰" },
    { value: "price_adjustment", label: "Ajustement de prix", icon: "💵" },
    { value: "cancelled_order", label: "Annulation de commande", icon: "🚫" },
    { value: "goodwill", label: "Geste commercial", icon: "🤝" },
    { value: "other", label: "Autre", icon: "📝" },
  ];

  // Options de méthodes de remboursement
  const refundMethods = [
    { value: "bank_transfer", label: "Virement Bancaire", icon: "🏦" },
    { value: "original_payment", label: "Méthode de paiement d'origine", icon: "🔄" },
    { value: "store_credit", label: "Avoir en magasin", icon: "🎫" },
    { value: "cash", label: "Espèces", icon: "💵" },
    { value: "check", label: "Chèque", icon: "📝" },
  ];

  // État des lignes de l'avoir
  const [creditNoteItems, setCreditNoteItems] = useState([
    {
      id: 1,
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      total: 0,
      originalAmount: 0, // Montant d'origine pour référence
    },
  ]);

  // État du statut de l'avoir
  const [creditNoteStatus, setCreditNoteStatus] = useState("draft"); // draft, issued, processed, cancelled

  // Gestion du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gestion des lignes de l'avoir
  const addCreditNoteItem = () => {
    const newId = Math.max(...creditNoteItems.map((item) => item.id), 0) + 1;
    setCreditNoteItems([
      ...creditNoteItems,
      {
        id: newId,
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        taxRate: 18,
        total: 0,
        originalAmount: 0,
      },
    ]);
  };

  const updateCreditNoteItem = (id, field, value) => {
    setCreditNoteItems(
      creditNoteItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Calcul du total de la ligne
          const quantity = field === "quantity" ? value : updatedItem.quantity;
          const unitPrice = field === "unitPrice" ? value : updatedItem.unitPrice;
          const discount = field === "discount" ? value : updatedItem.discount;
          const taxRate = field === "taxRate" ? value : updatedItem.taxRate;
          
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

  const removeCreditNoteItem = (id) => {
    if (creditNoteItems.length > 1) {
      setCreditNoteItems(creditNoteItems.filter((item) => item.id !== id));
    }
  };

  const duplicateCreditNoteItem = (id) => {
    const itemToDuplicate = creditNoteItems.find((item) => item.id === id);
    if (itemToDuplicate) {
      const newId = Math.max(...creditNoteItems.map((item) => item.id), 0) + 1;
      setCreditNoteItems([
        ...creditNoteItems,
        { ...itemToDuplicate, id: newId },
      ]);
    }
  };

  // Importer les lignes depuis une facture (simulation)
  const importFromInvoice = () => {
    if (!formData.originalInvoiceNumber) {
      alert("Veuillez entrer le numéro de facture d'origine");
      return;
    }
    
    // Simulation - Dans une vraie app, vous chargeriez les données depuis votre API
    const simulatedInvoiceItems = [
      {
        id: Date.now() + 1,
        description: "Service de développement web",
        quantity: 1,
        unitPrice: 50000,
        discount: 0,
        taxRate: 18,
        total: 59000,
        originalAmount: 59000,
      },
      {
        id: Date.now() + 2,
        description: "Hébergement annuel",
        quantity: 1,
        unitPrice: 15000,
        discount: 10,
        taxRate: 18,
        total: 15930,
        originalAmount: 15930,
      },
    ];
    
    setCreditNoteItems(simulatedInvoiceItems);
    alert("Lignes importées depuis la facture");
  };

  // Calculs financiers
  const subtotal = creditNoteItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    return sum + itemSubtotal;
  }, 0);

  const totalDiscount = creditNoteItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const discountAmount = itemSubtotal * (item.discount / 100);
    return sum + discountAmount;
  }, 0);

  const subtotalAfterDiscount = subtotal - totalDiscount;

  const totalTax = creditNoteItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const discountAmount = itemSubtotal * (item.discount / 100);
    const subtotalAfterDiscount = itemSubtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (item.taxRate / 100);
    return sum + taxAmount;
  }, 0);

  const total = creditNoteItems.reduce((sum, item) => sum + item.total, 0);

  // Validation du formulaire
  const isFormValid = () => {
    const requiredFields = [
      "creditNoteNumber",
      "creditNoteDate",
      "companyName",
      "clientName",
      "creditReason",
      "refundMethod",
    ];
    const hasRequiredFields = requiredFields.every(
      (field) => formData[field]?.toString().trim() !== "",
    );
    const hasValidItems = creditNoteItems.every(
      (item) => item.description.trim() !== "" && item.unitPrice > 0,
    );
    return hasRequiredFields && hasValidItems;
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      console.log("Avoir généré:", {
        formData,
        creditNoteItems,
        financials: { subtotal, totalDiscount, totalTax, total },
        status: creditNoteStatus,
      });
      alert("Avoir généré avec succès !");
    }
  };

  // Actions sur l'avoir
  const saveAsDraft = () => {
    setCreditNoteStatus("draft");
    alert("Avoir enregistré comme brouillon");
  };

  const markAsIssued = () => {
    setCreditNoteStatus("issued");
    alert("Avoir marqué comme émis");
  };

  const markAsProcessed = () => {
    setCreditNoteStatus("processed");
    alert("Avoir marqué comme traité");
  };

  const cancelCreditNote = () => {
    if (confirm("Êtes-vous sûr de vouloir annuler cet avoir ?")) {
      setCreditNoteStatus("cancelled");
      alert("Avoir annulé");
    }
  };

  const printCreditNote = () => {
    alert("Impression de l'avoir...");
    window.print();
  };

  const downloadCreditNote = () => {
    alert("Fonctionnalité de téléchargement en cours de développement");
  };

  // Récupérer le badge de statut
  const getStatusBadge = () => {
    const statusConfig = {
      draft: { label: "Brouillon", variant: "secondary", color: "gray", icon: FileText },
      issued: { label: "Émis", variant: "default", color: "blue", icon: Send },
      processed: { label: "Traité", variant: "default", color: "green", icon: Check },
      cancelled: { label: "Annulé", variant: "destructive", color: "red", icon: X },
    };

    const config = statusConfig[creditNoteStatus] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1 text-xs">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
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
              <RotateCcw className="w-8 h-8 text-primary" />
            </div>
            <h1 className="mb-4 text-4xl font-bold">Générer un Avoir</h1>
            <p className="text-lg text-gray-600">
              Créez des avoirs professionnels pour remboursements et corrections
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <span className="font-mono text-sm text-gray-700">
                  {formData.creditNoteNumber}
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
                {/* Alerte d'information */}
                <div className="flex items-start gap-3 p-4 border border-primary rounded-xl bg-primary/10">
                  <AlertTriangle className="w-5 h-5 text-primary/70 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-primary">
                      À propos des avoirs
                    </h3>
                    <p className="mt-1 text-sm text-primary/70">
                      Un avoir est un document qui annule tout ou partie d'une facture.
                      Il permet de rembourser un client, corriger une erreur de facturation,
                      ou accorder une remise après-vente.
                    </p>
                  </div>
                </div>

                {/* Section 1: Informations de l'avoir */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        Informations de l'Avoir
                      </h2>
                      <p className="text-sm text-gray-500">
                        Détails et références
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Numéro d'Avoir <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="creditNoteNumber"
                          value={formData.creditNoteNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 font-mono transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                        <Hash className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div> */}

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Date d'Avoir <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="creditNoteDate"
                          value={formData.creditNoteDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                        <Calendar className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Facture d'Origine
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          name="originalInvoiceNumber"
                          value={formData.originalInvoiceNumber}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-2 font-mono transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                          placeholder="INV-202602-0001"
                        />
                        <Button
                          type="button"
                          onClick={importFromInvoice}
                          variant="outline"
                          size="sm"
                          className="gap-2 shrink-0"
                          title="Importer les lignes de la facture"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Date Facture d'Origine
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="originalInvoiceDate"
                          value={formData.originalInvoiceDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        />
                        <Calendar className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Raison de l'Avoir <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="creditReason"
                        value={formData.creditReason}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        required
                      >
                        <option value="">Sélectionnez</option>
                        {creditReasons.map((reason) => (
                          <option key={reason.value} value={reason.value}>
                            {reason.icon} {reason.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Méthode de Remboursement <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="refundMethod"
                        value={formData.refundMethod}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        required
                      >
                        <option value="">Sélectionnez</option>
                        {refundMethods.map((method) => (
                          <option key={method.value} value={method.value}>
                            {method.icon} {method.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Informations de l'émetteur */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Building2 className="w-5 h-5 text-primary/90" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Votre Entreprise</h2>
                      <p className="text-sm text-gray-500">
                        Informations de l'émetteur
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Nom de l'Entreprise <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        placeholder="Votre Entreprise SARL"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="companyAddress"
                        value={formData.companyAddress}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        placeholder="123 Avenue de la République"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Ville
                      </label>
                      <input
                        type="text"
                        name="companyCity"
                        value={formData.companyCity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        placeholder="Douala"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Code Postal
                      </label>
                      <input
                        type="text"
                        name="companyPostalCode"
                        value={formData.companyPostalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        placeholder="00237"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Téléphone
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="companyPhone"
                          value={formData.companyPhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                          placeholder="+237 6XX XX XX XX"
                        />
                        <Phone className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="companyEmail"
                          value={formData.companyEmail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                          placeholder="contact@votreentreprise.com"
                        />
                        <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Numéro d'Identification Fiscale
                      </label>
                      <input
                        type="text"
                        name="companyTaxId"
                        value={formData.companyTaxId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        placeholder="FR12345678901"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Informations du client */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <User className="w-5 h-5 text-primary/90" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Client</h2>
                      <p className="text-sm text-gray-500">
                        Bénéficiaire de l'avoir
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Nom du Client <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        placeholder="AAA"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Entreprise du Client
                      </label>
                      <input
                        type="text"
                        name="clientCompany"
                        value={formData.clientCompany}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        placeholder="Client Entreprise SA"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="clientEmail"
                          value={formData.clientEmail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                          placeholder="client@email.com"
                        />
                        <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Téléphone
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="clientPhone"
                          value={formData.clientPhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                          placeholder="+237 6XX XX XX XX"
                        />
                        <Phone className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="clientAddress"
                        value={formData.clientAddress}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        placeholder="456 Boulevard Principal"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Ville
                      </label>
                      <input
                        type="text"
                        name="clientCity"
                        value={formData.clientCity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        placeholder="Yaoundé"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Code Postal
                      </label>
                      <input
                        type="text"
                        name="clientPostalCode"
                        value={formData.clientPostalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        placeholder="00237"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Numéro d'Identification Fiscale
                      </label>
                      <input
                        type="text"
                        name="clientTaxId"
                        value={formData.clientTaxId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                        placeholder="FR98765432101"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Lignes de l'avoir */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Package className="w-5 h-5 text-primary/90" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          Lignes de l'Avoir
                        </h2>
                        <p className="text-sm text-gray-500">
                          Montants à rembourser ou annuler
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={addCreditNoteItem}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {creditNoteItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 transition-colors border-2 rounded-lg border-primary/10 hover:border-primary/30 bg-orange-50/30"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="text-xs bg-white">
                            Ligne {index + 1}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              onClick={() => duplicateCreditNoteItem(item.id)}
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0 text-primary/80 hover:text-primary/90 hover:bg-primary/10"
                              title="Dupliquer"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            {creditNoteItems.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeCreditNoteItem(item.id)}
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
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Description <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                updateCreditNoteItem(
                                  item.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 text-sm transition-colors bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                              placeholder="Ex: Remboursement produit défectueux"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Qté
                              </label>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateCreditNoteItem(
                                    item.id,
                                    "quantity",
                                    Math.max(1, parseFloat(e.target.value) || 1),
                                  )
                                }
                                className="w-full px-3 py-2 text-sm text-center transition-colors bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                                min="1"
                                step="0.01"
                              />
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Prix U.
                              </label>
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  updateCreditNoteItem(
                                    item.id,
                                    "unitPrice",
                                    Math.max(0, parseFloat(e.target.value) || 0),
                                  )
                                }
                                className="w-full px-3 py-2 text-sm transition-colors bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                                placeholder="0"
                                min="0"
                                step="0.01"
                              />
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Remise %
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={item.discount}
                                  onChange={(e) =>
                                    updateCreditNoteItem(
                                      item.id,
                                      "discount",
                                      Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)),
                                    )
                                  }
                                  className="w-full px-3 py-2 pr-6 text-sm transition-colors bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                                  placeholder="0"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                />
                                <Percent className="absolute w-3 h-3 text-gray-400 transform -translate-y-1/2 pointer-events-none right-2 top-1/2" />
                              </div>
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                TVA %
                              </label>
                              <input
                                type="number"
                                value={item.taxRate}
                                onChange={(e) =>
                                  updateCreditNoteItem(
                                    item.id,
                                    "taxRate",
                                    Math.max(0, parseFloat(e.target.value) || 0),
                                  )
                                }
                                className="w-full px-3 py-2 text-sm transition-colors bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                                placeholder="18"
                                min="0"
                                step="0.01"
                              />
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Total
                              </label>
                              <div className="flex items-center h-10 px-3 py-2 text-sm font-semibold bg-white border rounded-lg text-primary/90 border-primary/20">
                                {item.total.toLocaleString()} XOF
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Section 5: Notes */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Notes client */}
                  <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <FileCheck className="w-5 h-5 text-primary/90" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Notes Client</h2>
                        <p className="text-sm text-gray-500">
                          Visibles sur l'avoir
                        </p>
                      </div>
                    </div>

                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 text-sm transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                      placeholder="Notes visibles par le client..."
                    />
                  </div>

                  {/* Notes internes */}
                  <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Eye className="w-5 h-5 text-primary/90" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Notes Internes</h2>
                        <p className="text-sm text-gray-500">
                          Usage interne uniquement
                        </p>
                      </div>
                    </div>

                    <textarea
                      name="internalNotes"
                      value={formData.internalNotes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 text-sm transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/80 focus:border-transparent"
                      placeholder="Notes internes (non visibles sur l'avoir)..."
                    />
                  </div>
                </div>
              </div>

              {/* Colonne latérale - Récapitulatif et Actions */}
              <div className="space-y-6">
                {/* Actions rapides */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm top-6 rounded-xl">
                  <h3 className="mb-4 text-lg font-bold">Actions</h3>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full gap-2 bg-primary/90 hover:bg-primary"
                      size="lg"
                      disabled={!isFormValid()}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Générer l'Avoir
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        onClick={printCreditNote}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        disabled={!isFormValid()}
                      >
                        <Printer className="w-4 h-4" />
                        Imprimer
                      </Button>

                      <Button
                        type="button"
                        onClick={downloadCreditNote}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        disabled={!isFormValid()}
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500">
                        Statut de l'avoir
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          onClick={saveAsDraft}
                          variant={creditNoteStatus === "draft" ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                        >
                          Brouillon
                        </Button>
                        <Button
                          type="button"
                          onClick={markAsIssued}
                          variant={creditNoteStatus === "issued" ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                        >
                          Émis
                        </Button>
                        <Button
                          type="button"
                          onClick={markAsProcessed}
                          variant={creditNoteStatus === "processed" ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Traité
                        </Button>
                        <Button
                          type="button"
                          onClick={cancelCreditNote}
                          variant={creditNoteStatus === "cancelled" ? "destructive" : "outline"}
                          size="sm"
                          className="text-xs"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Récapitulatif Financier */}
                <div className="p-6 bg-white border-2 shadow-sm border-primary/20 rounded-xl bg-gradient-to-br from-orange-50/50 to-white">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold">
                    <RotateCcw className="w-5 h-5 text-primary/90" />
                    Montant à Rembourser
                  </h3>

                  <div className="space-y-4">
                    {/* Liste condensée des lignes */}
                    <div className="p-3 space-y-2 bg-white border rounded-lg border-primary/10">
                      <p className="text-xs font-medium text-gray-500">
                        {creditNoteItems.length} ligne
                        {creditNoteItems.length > 1 ? "s" : ""}
                      </p>
                      {creditNoteItems.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-xs"
                        >
                          <span className="text-gray-600 truncate">
                            {item.description || "Sans nom"} (×{item.quantity})
                          </span>
                          <span className="ml-2 font-medium text-primary/90 shrink-0">
                            {item.total.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {creditNoteItems.length > 3 && (
                        <p className="text-xs text-center text-gray-400">
                          +{creditNoteItems.length - 3} autre
                          {creditNoteItems.length - 3 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>

                    <Separator />

                    {/* Totaux détaillés */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sous-total HT</span>
                        <span className="font-medium">
                          {subtotal.toLocaleString()} XOF
                        </span>
                      </div>

                      {totalDiscount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Remise totale
                          </span>
                          <span className="font-medium text-green-600">
                            -{totalDiscount.toLocaleString()} XOF
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total HT</span>
                        <span className="font-medium">
                          {subtotalAfterDiscount.toLocaleString()} XOF
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">TVA</span>
                        <span className="font-medium">
                          {totalTax.toLocaleString()} XOF
                        </span>
                      </div>

                      <Separator />

                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-red-100">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total TTC</span>
                          <span className="text-primary/90">
                            {total.toLocaleString()} XOF
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-center text-primary">
                          Montant à rembourser au client
                        </p>
                      </div>
                    </div>

                    {/* Validation */}
                    {!isFormValid() && (
                      <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-yellow-700">
                            Complétez tous les champs requis pour générer l'avoir
                          </p>
                        </div>
                      </div>
                    )}

                    {isFormValid() && (
                      <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-green-700">
                            Avoir prêt à être généré
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations importantes */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <h4 className="mb-4 text-lg font-bold">
                    À Savoir
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full shrink-0">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold">
                          Document officiel
                        </h5>
                        <p className="text-xs text-gray-600">
                          L'avoir est un document comptable officiel
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full shrink-0">
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold">
                          Traçabilité
                        </h5>
                        <p className="text-xs text-gray-600">
                          Référence à la facture d'origine obligatoire
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0">
                        <DollarSign className="w-4 h-4 text-primary/90" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold">
                          Impact comptable
                        </h5>
                        <p className="text-xs text-gray-600">
                          Annule ou réduit la facture d'origine
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations légales */}
                <div className="p-4 text-xs text-gray-500 border rounded-lg border-primary/20 bg-orange-50">
                  <p className="mb-2 font-medium">⚠️ Mentions légales :</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>L'avoir doit faire référence à la facture d'origine</li>
                    <li>Le montant ne peut excéder celui de la facture</li>
                    <li>Conservation obligatoire pendant 10 ans</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreditNotePage;