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
} from "lucide-react";

const InvoicePage = () => {
  const navigate = useNavigate();

  // Génération du numéro de facture
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const random = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");
    // return `INV-${year}${month}-${random}`;
    return `FAC-0001`;
  };

  // État du formulaire
  const [formData, setFormData] = useState({
    // Informations de la facture
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    purchaseOrder: "",
    
    // Informations de l'émetteur (votre entreprise)
    companyName: "",
    companyAddress: "",
    companyCity: "",
    companyPostalCode: "",
    companyPhone: "",
    companyEmail: "",
    companyTaxId: "",
    companyLogo: "",

    // Informations du client
    clientName: "",
    clientCompany: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    clientCity: "",
    clientPostalCode: "",
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
      description: "",
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 18,
      total: 0,
    },
  ]);

  // Options de méthodes de paiement
  const paymentMethods = [
    { value: "bank_transfer", label: "Virement Bancaire", icon: "🏦" },
    { value: "mobile_money", label: "Mobile Money", icon: "📱" },
    { value: "cash", label: "Espèces", icon: "💵" },
    { value: "check", label: "Chèque", icon: "📝" },
    { value: "card", label: "Carte Bancaire", icon: "💳" },
  ];

  // État du statut de la facture
  const [invoiceStatus, setInvoiceStatus] = useState("draft"); // draft, sent, paid, overdue

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
    const itemSubtotal = item.quantity * item.unitPrice;
    return sum + itemSubtotal;
  }, 0);

  const totalDiscount = invoiceItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const discountAmount = itemSubtotal * (item.discount / 100);
    return sum + discountAmount;
  }, 0);

  const subtotalAfterDiscount = subtotal - totalDiscount;

  const totalTax = invoiceItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const discountAmount = itemSubtotal * (item.discount / 100);
    const subtotalAfterDiscount = itemSubtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (item.taxRate / 100);
    return sum + taxAmount;
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
      (item) => item.description.trim() !== "" && item.unitPrice > 0,
    );
    return hasRequiredFields && hasValidItems;
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      console.log("Facture générée:", {
        formData,
        invoiceItems,
        financials: { subtotal, totalDiscount, totalTax, total },
        status: invoiceStatus,
      });
      alert("Facture générée avec succès !");
    }
  };

  // Actions sur la facture
  const saveAsDraft = () => {
    setInvoiceStatus("draft");
    alert("Facture enregistrée comme brouillon");
  };

  const markAsSent = () => {
    setInvoiceStatus("sent");
    alert("Facture marquée comme envoyée");
  };

  const markAsPaid = () => {
    setInvoiceStatus("paid");
    alert("Facture marquée comme payée");
  };

  const printInvoice = () => {
    alert("Impression de la facture...");
    window.print();
  };

  const downloadInvoice = () => {
    alert("Fonctionnalité de téléchargement en cours de développement");
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
                {/* Section 1: Informations de la facture */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        Informations de la Facture
                      </h2>
                      <p className="text-sm text-gray-500">
                        Détails et références
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Numéro de Facture <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="invoiceNumber"
                          value={formData.invoiceNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 font-mono transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                        <Hash className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Bon de Commande
                      </label>
                      <input
                        type="text"
                        name="purchaseOrder"
                        value={formData.purchaseOrder}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="PO-2026-001"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Date de Facture <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="invoiceDate"
                          value={formData.invoiceDate}
                          onChange={handleInvoiceDateChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                        <Calendar className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Date d'Échéance
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <Clock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Conditions de Paiement
                      </label>
                      <select
                        name="paymentTerms"
                        value={formData.paymentTerms}
                        onChange={handlePaymentTermsChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Méthode de Paiement <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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

                {/* Section 2: Informations de l'émetteur */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Building2 className="w-5 h-5 text-primary" />
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
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        name="companyPostalCode"
                        value={formData.companyPostalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="contact@votreentreprise.com"
                        />
                        <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
                      </div>
                    </div>

                    {/* <div className="md:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Numéro d'Identification Fiscale
                      </label>
                      <input
                        type="text"
                        name="companyTaxId"
                        value={formData.companyTaxId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="FR12345678901"
                      />
                    </div> */}
                  </div>
                </div>

                {/* Section 3: Informations du client */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Facturer À</h2>
                      <p className="text-sm text-gray-500">
                        Informations du client
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
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="AAAA"
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
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                          className="w-full px-4 py-2 pr-10 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="FR98765432101"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Lignes de facturation */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          Lignes de Facturation
                        </h2>
                        <p className="text-sm text-gray-500">
                          Produits et services facturés
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={addInvoiceItem}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {invoiceItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 transition-colors border border-gray-200 rounded-lg hover:border-primary/30"
                      >
                        <div className="flex items-start justify-between mb-3">
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
                              <Plus className="w-4 h-4" />
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
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Description <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) =>
                                updateInvoiceItem(
                                  item.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 text-sm transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Ex: Développement application web"
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
                                  updateInvoiceItem(
                                    item.id,
                                    "quantity",
                                    Math.max(1, parseFloat(e.target.value) || 1),
                                  )
                                }
                                className="w-full px-3 py-2 text-sm text-center transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                                  updateInvoiceItem(
                                    item.id,
                                    "unitPrice",
                                    Math.max(0, parseFloat(e.target.value) || 0),
                                  )
                                }
                                className="w-full px-3 py-2 text-sm transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                                    updateInvoiceItem(
                                      item.id,
                                      "discount",
                                      Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)),
                                    )
                                  }
                                  className="w-full px-3 py-2 pr-6 text-sm transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                                  updateInvoiceItem(
                                    item.id,
                                    "taxRate",
                                    Math.max(0, parseFloat(e.target.value) || 0),
                                  )
                                }
                                className="w-full px-3 py-2 text-sm transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="18"
                                min="0"
                                step="0.01"
                              />
                            </div>

                            <div>
                              <label className="block mb-2 text-sm font-medium text-gray-700">
                                Total
                              </label>
                              <div className="flex items-center h-10 px-3 py-2 text-sm font-semibold rounded-lg bg-gray-50 text-primary">
                                {item.total.toLocaleString()} XOF
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Section 5: Informations bancaires et notes */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Informations bancaires */}
                  {/* <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          Coordonnées Bancaires
                        </h2>
                        <p className="text-sm text-gray-500">
                          Pour le paiement
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Nom de la Banque
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Banque Atlantique"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Numéro de Compte / IBAN
                        </label>
                        <input
                          type="text"
                          name="bankAccount"
                          value={formData.bankAccount}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 font-mono text-sm transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="CM12 3456 7890 1234 5678 9012"
                        />
                      </div>
                    </div>
                  </div> */}

                  {/* Notes */}
                  <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <FileCheck className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Notes</h2>
                        <p className="text-sm text-gray-500">
                          Informations additionnelles
                        </p>
                      </div>
                    </div>

                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 text-sm transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Merci pour votre confiance..."
                    />
                  </div>
                </div>

                {/* Section 6: Conditions générales */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        Conditions Générales
                      </h2>
                      <p className="text-sm text-gray-500">
                        Termes et conditions
                      </p>
                    </div>
                  </div>

                  <textarea
                    name="termsAndConditions"
                    value={formData.termsAndConditions}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 text-sm transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Paiement à réception de facture. Toute facture impayée après la date d'échéance entraînera des pénalités de retard..."
                  />
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
                      className="w-full gap-2"
                      size="lg"
                      disabled={!isFormValid()}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Générer la Facture
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        onClick={printInvoice}
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
                        onClick={downloadInvoice}
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
                        Statut de la facture
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          type="button"
                          onClick={saveAsDraft}
                          variant={invoiceStatus === "draft" ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                        >
                          Brouillon
                        </Button>
                        <Button
                          type="button"
                          onClick={markAsSent}
                          variant={invoiceStatus === "sent" ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                        >
                          Envoyée
                        </Button>
                        <Button
                          type="button"
                          onClick={markAsPaid}
                          variant={invoiceStatus === "paid" ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Récapitulatif Financier */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold">
                    <Receipt className="w-5 h-5 text-primary" />
                    Récapitulatif
                  </h3>

                  <div className="space-y-4">
                    {/* Liste condensée des lignes */}
                    <div className="p-3 space-y-2 rounded-lg bg-gray-50">
                      <p className="text-xs font-medium text-gray-500">
                        {invoiceItems.length} ligne
                        {invoiceItems.length > 1 ? "s" : ""}
                      </p>
                      {invoiceItems.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-xs"
                        >
                          <span className="text-gray-600 truncate">
                            {item.description || "Sans nom"} (×{item.quantity})
                          </span>
                          <span className="ml-2 font-medium shrink-0">
                            {item.total.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {invoiceItems.length > 3 && (
                        <p className="text-xs text-center text-gray-400">
                          +{invoiceItems.length - 3} autre
                          {invoiceItems.length - 3 > 1 ? "s" : ""}
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

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total TTC</span>
                        <span className="text-primary">
                          {total.toLocaleString()} XOF
                        </span>
                      </div>
                    </div>

                    {/* Validation */}
                    {!isFormValid() && (
                      <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-yellow-700">
                            Complétez tous les champs requis pour générer la
                            facture
                          </p>
                        </div>
                      </div>
                    )}

                    {isFormValid() && (
                      <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-green-700">
                            Facture prête à être générée
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Avantages */}
                <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                  <h4 className="mb-4 text-lg font-bold">
                    Gestion Professionnelle
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full shrink-0">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold">
                          Factures professionnelles
                        </h5>
                        <p className="text-xs text-gray-600">
                          Format conforme et personnalisable
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full shrink-0">
                        <Shield className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold">
                          Sécurité garantie
                        </h5>
                        <p className="text-xs text-gray-600">
                          Données protégées et sauvegardées
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full shrink-0">
                        <DollarSign className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold">
                          Suivi des paiements
                        </h5>
                        <p className="text-xs text-gray-600">
                          Gestion simplifiée de vos finances
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations légales */}
                <div className="p-4 text-xs text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="mb-2 font-medium">ℹ️ Mentions légales :</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Pénalités de retard : 3 fois le taux d'intérêt légal</li>
                    <li>Indemnité forfaitaire de recouvrement : 40 €</li>
                    <li>
                      Escompte pour paiement anticipé : selon conditions
                    </li>
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

export default InvoicePage;