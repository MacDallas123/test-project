import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Eye, FileText, User, Mail, Phone, MapPin,
  Building2, Calendar, Clock, Package, Plus, Trash2,
  Send, CheckCircle, AlertCircle, CreditCard, FileCheck,
  Receipt, Hash, Percent, Printer, Save, Loader2, Copy,
  RefreshCw, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Info, BookOpen, Edit2, Check, DollarSign,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
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
import { useCurrency } from "@/context/CurrencyContext";
import InvoiceHistoryDialog from "@/components/dialog/InvoiceHistoryDialog";
import QuoteSelectionDialog from "@/components/dialog/QuoteSelectionDialog";
import { useAppMainContext } from "@/context/AppProvider";
import { useAuth } from "@/hooks/useAuth";

// ─────────────────────────────────────────────
// ÉTAPES DU WIZARD
// ─────────────────────────────────────────────
const STEPS = [
  { id: "invoice",  label: "Facture",    icon: FileText   },
  { id: "company",  label: "Émetteur",   icon: Building2  },
  { id: "client",   label: "Client",     icon: User       },
  { id: "items",    label: "Articles",   icon: Package    },
  { id: "payment",  label: "Paiement",   icon: CreditCard },
  { id: "notes",    label: "Notes",      icon: FileCheck  },
  { id: "preview",  label: "Aperçu",     icon: Eye        },
];

// ─────────────────────────────────────────────
// NOTICE D'AIDE
// ─────────────────────────────────────────────
const HelpNotice = ({ tips, title = "Conseils", variant = "info" }) => {
  const [open, setOpen] = useState(false);
  const colors = {
    info:    { bg: "bg-blue-50 border-blue-200",   icon: "text-blue-500",  title: "text-blue-700"  },
    success: { bg: "bg-green-50 border-green-200", icon: "text-green-500", title: "text-green-700" },
    warning: { bg: "bg-amber-50 border-amber-200", icon: "text-amber-500", title: "text-amber-700" },
  };
  const c = colors[variant] || colors.info;
  return (
    <div className={`border rounded-lg ${c.bg} overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full p-3 text-sm font-medium ${c.title}`}
      >
        <div className="flex items-center gap-2">
          <Info className={`w-4 h-4 ${c.icon}`} />
          {title}
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-3 space-y-1 overflow-hidden text-sm text-gray-700"
          >
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.icon.replace("text-", "bg-")}`} />
                {tip}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────
// BARRE DE PROGRESSION
// ─────────────────────────────────────────────
const ProgressBar = ({ steps, currentStep, onNavigate }) => {
  const pct = Math.round((currentStep / (steps.length - 1)) * 100);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          Étape {currentStep + 1} / {steps.length} — <span className="text-primary">{steps[currentStep]?.label}</span>
        </span>
        <span className="font-semibold text-primary">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const done   = i < currentStep;
          const active = i === currentStep;
          const Icon   = step.icon;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onNavigate(i)}
              title={step.label}
              className="flex flex-col items-center gap-1 transition-opacity group"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                ${active ? "border-primary bg-primary text-white scale-110 shadow-md shadow-primary/30"
                  : done  ? "border-green-500 bg-green-50 text-green-600"
                  : "border-gray-300 bg-white text-gray-400 group-hover:border-primary/50"}`}>
                {done ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className={`hidden sm:block text-[10px] font-medium leading-tight text-center
                ${active ? "text-primary" : done ? "text-green-600" : "text-gray-400"}`}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────
const InvoicePage = () => {
  const navigate   = useNavigate();
  const { id }     = useParams();
  const invoiceRef = useRef();
  const dispatch   = useDispatch();

  // Redux
  const currentInvoice = useSelector(selectCurrentInvoice);
  const loading        = useSelector(selectInvoiceLoading);
  const error          = useSelector(selectInvoiceError);
  const generatedPDF   = useSelector(selectGeneratedPDF);

  // États locaux
  const [currentStep,          setCurrentStep]         = useState(0);
  const [isGenerating,         setIsGenerating]        = useState(false);
  const [isSending,            setIsSending]           = useState(false);
  const [isInvoiceHistoryOpen, setIsInvoiceHistoryOpen] = useState(false);
  const [invoiceStatus,        setInvoiceStatus]       = useState("DRAFT");

  const { symbol } = useCurrency();

  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const { setIsViewLocked } = useAppMainContext();
  const { isLoggedIn } = useAuth();


  useEffect(() => {
    if(!isLoggedIn()) setIsViewLocked(true);
  }, []);

  const quotes = [
    {
      id: "1",
      numero: "DEV-202603-001",
      date: "15/03/2026",
      bis: 1,
      clientName: "Entreprise ABC",
      montant: 150000,
      estTransforme: false,
    },
    {
      id: "2", 
      numero: "DEV-202603-001-v2",
      date: "18/03/2026",
      bis: 2,
      clientName: "Entreprise ABC",
      montant: 175000,
      estTransforme: true,
    },
  ];

  // ── Formulaire ──────────────────────────────
  const [formData, setFormData] = useState({
    invoiceNumber:      "",
    quoteNumber:        "",
    invoiceDate:        new Date().toISOString().split("T")[0],
    dueDate:            "",
    purchaseOrder:      "",
    companyName:        "fibem",
    companyAddress:     "fibem address",
    companyCity:        "Vernon",
    companyPostalCode:  "xxx - unknow",
    companyPhone:       "+33 xx xx xx x",
    companyEmail:       "email@gmail.com",
    companyTaxId:       "",
    companyLogo:        "",
    clientName:         "Client",
    clientCompany:      "companie client",
    clientEmail:        "client@gmail.com",
    clientPhone:        "+237 xxx xxx xxx",
    clientAddress:      "Adresse",
    clientCity:         "Yaounde",
    clientPostalCode:   "BP xxx - Yaounde",
    clientTaxId:        "",
    paymentTerms:       "30",
    paymentMethod:      "OTHER",
    bankName:           "",
    bankAccount:        "",
    notes:              "",
    termsAndConditions: "",
  });

  // ── Articles ────────────────────────────────
  const [invoiceItems, setInvoiceItems] = useState([
    { id: 1, description: "Développement application web", quantity: 1,  unitPrice: 10, discount: 10, taxRate: 18, total: 0 },
    { id: 2, description: "Maintenance",                   quantity: 2,  unitPrice: 50, discount: 0,  taxRate: 18, total: 0 },
    { id: 3, description: "Hébergement annuel",            quantity: 1,  unitPrice: 20, discount: 0,  taxRate: 18, total: 0 },
  ]);

  const [logoPreview, setLogoPreview] = useState("");

  // ── Chargement si édition ───────────────────
  useEffect(() => {
    if (id) dispatch(fetchInvoiceById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (currentInvoice) {
      setFormData({
        invoiceNumber:      currentInvoice.invoiceNumber      || generateInvoiceNumber(),
        invoiceDate:        currentInvoice.invoiceDate        || new Date().toISOString().split("T")[0],
        dueDate:            currentInvoice.dueDate            || "",
        purchaseOrder:      currentInvoice.purchaseOrder      || "",
        companyName:        currentInvoice.companyName        || "",
        companyAddress:     currentInvoice.companyAddress     || "",
        companyCity:        currentInvoice.companyCity        || "",
        companyPostalCode:  currentInvoice.companyPostalCode  || "",
        companyPhone:       currentInvoice.companyPhone       || "",
        companyEmail:       currentInvoice.companyEmail       || "",
        companyTaxId:       currentInvoice.companyTaxId       || "",
        companyLogo:        currentInvoice.companyLogo        || "",
        clientName:         currentInvoice.clientName         || "",
        clientCompany:      currentInvoice.clientCompany      || "",
        clientEmail:        currentInvoice.clientEmail        || "",
        clientPhone:        currentInvoice.clientPhone        || "",
        clientAddress:      currentInvoice.clientAddress      || "",
        clientCity:         currentInvoice.clientCity         || "",
        clientPostalCode:   currentInvoice.clientPostalCode   || "",
        clientTaxId:        currentInvoice.clientTaxId        || "",
        paymentTerms:       currentInvoice.paymentTerms       || "30",
        paymentMethod:      currentInvoice.paymentMethod      || "OTHER",
        bankName:           currentInvoice.bankName           || "",
        bankAccount:        currentInvoice.bankAccount        || "",
        notes:              currentInvoice.notes              || "",
        termsAndConditions: currentInvoice.termsAndConditions || "",
      });
      if (currentInvoice.invoiceItems) setInvoiceItems(currentInvoice.invoiceItems);
      if (currentInvoice.invoiceStatus) setInvoiceStatus(currentInvoice.invoiceStatus);
    }
  }, [currentInvoice]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(t);
    }
  }, [error, dispatch]);

  // ── Options paiement ────────────────────────
  const paymentMethods = [
    { value: "BANK_TRANSFER", label: "Virement Bancaire", icon: "🏦" },
    { value: "CREDIT_CARD",   label: "Carte Bancaire",    icon: "💳" },
    { value: "CASH",          label: "Espèces",           icon: "💵" },
    { value: "PAYPAL",        label: "PayPal",            icon: "🅿️" },
    { value: "CHECK",         label: "Chèque",            icon: "📝" },
    { value: "STRIPE",        label: "Stripe",            icon: "💠" },
    { value: "DIRECT_DEBIT",  label: "Prélèvement",       icon: "🏛️" },
    { value: "BITCOIN",       label: "Bitcoin",           icon: "₿" },
    { value: "APPLE_PAY",     label: "Apple Pay",         icon: "🍏" },
    { value: "GOOGLE_PAY",    label: "Google Pay",        icon: "🅶" },
    { value: "WIRE_TRANSFER", label: "Virement International", icon: "💱" },
    { value: "OTHER",         label: "Autre",             icon: "❓" },
  ];

  // ── Formulaire handlers ─────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInvoiceDateChange = (e) => {
    const invoiceDate  = e.target.value;
    const paymentTerms = parseInt(formData.paymentTerms) || 30;
    const date = new Date(invoiceDate);
    date.setDate(date.getDate() + paymentTerms);
    setFormData(prev => ({ ...prev, invoiceDate, dueDate: date.toISOString().split("T")[0] }));
  };

  const handlePaymentTermsChange = (e) => {
    const paymentTerms = e.target.value;
    if (formData.invoiceDate) {
      const date = new Date(formData.invoiceDate);
      date.setDate(date.getDate() + parseInt(paymentTerms));
      setFormData(prev => ({ ...prev, paymentTerms, dueDate: date.toISOString().split("T")[0] }));
    } else {
      setFormData(prev => ({ ...prev, paymentTerms }));
    }
  };

  // ── Articles handlers ───────────────────────
  const addInvoiceItem = () => {
    const newId = Math.max(...invoiceItems.map(i => i.id), 0) + 1;
    setInvoiceItems([...invoiceItems, { id: newId, description: "", quantity: 1, unitPrice: 0, discount: 0, taxRate: 18, total: 0 }]);
  };

  const updateInvoiceItem = (id, field, value) => {
    setInvoiceItems(invoiceItems.map(item => {
      if (item.id !== id) return item;
      const u = { ...item, [field]: value };
      const qty      = parseFloat(field === "quantity"  ? value : u.quantity)  || 0;
      const price    = parseFloat(field === "unitPrice" ? value : u.unitPrice) || 0;
      const disc     = parseFloat(field === "discount"  ? value : u.discount)  || 0;
      const tax      = parseFloat(field === "taxRate"   ? value : u.taxRate)   || 0;
      const base     = qty * price;
      const afterDisc = base - base * (disc / 100);
      u.total = afterDisc + afterDisc * (tax / 100);
      return u;
    }));
  };

  const removeInvoiceItem    = (id) => { if (invoiceItems.length > 1) setInvoiceItems(invoiceItems.filter(i => i.id !== id)); };
  const duplicateInvoiceItem = (id) => {
    const item  = invoiceItems.find(i => i.id === id);
    if (!item) return;
    const newId = Math.max(...invoiceItems.map(i => i.id), 0) + 1;
    setInvoiceItems([...invoiceItems, { ...item, id: newId }]);
  };

  // ── Calculs ─────────────────────────────────
  const subtotal             = invoiceItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const totalDiscount        = invoiceItems.reduce((s, i) => s + i.quantity * i.unitPrice * (i.discount / 100), 0);
  const subtotalAfterDiscount = subtotal - totalDiscount;
  const totalTax             = invoiceItems.reduce((s, i) => {
    const base = i.quantity * i.unitPrice * (1 - i.discount / 100);
    return s + base * (i.taxRate / 100);
  }, 0);
  const total = invoiceItems.reduce((s, i) => s + i.total, 0);

  // ── Validation ──────────────────────────────
  const isFormValid = () => {
    const ok = ["invoiceDate", "companyName", "clientName"]
      .every(f => formData[f]?.toString().trim() !== "");
    const itemsOk = invoiceItems.every(i => i.description?.trim() && i.unitPrice > 0);
    return ok && itemsOk;
  };

  // ── Validation par étape ────────────────────
  const canGoNext = () => {
    switch (STEPS[currentStep].id) {
      case "invoice":  return formData.invoiceNumber && formData.invoiceDate;
      case "company":  return formData.companyName?.trim() !== "";
      case "client":   return formData.clientName?.trim() !== "";
      case "items":    return invoiceItems.length > 0 && invoiceItems.every(i => i.description?.trim() && i.unitPrice > 0);
      case "payment":  return true;
      case "notes":    return true;
      case "preview":  return true;
      default:         return true;
    }
  };

  // ── Navigation ──────────────────────────────
  const goNext = () => { if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1); };
  const goPrev = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };
  const goTo   = (i) => setCurrentStep(i);

  // ── Actions ─────────────────────────────────
  const handleGenerateInvoice = async () => {
    setIsGenerating(true);
    try {6
      const payload = { ...formData, invoiceItems: invoiceItems.map(({ id, ...i }) => i), invoiceStatus, total };
      let invoiceId;
      if (currentInvoice?.id) {
        await dispatch(updateInvoiceById({ id: currentInvoice.id, data: payload })).unwrap();
        invoiceId = currentInvoice.id;
      } else {
        const res = await dispatch(createInvoice(payload)).unwrap();
        invoiceId = res.content.id;
      }
      if (!invoiceId) throw new Error("ID de facture introuvable");
      const genRes = await dispatch(generateInvoicePDF({ id: invoiceId, format: "pdf" })).unwrap();
      if (genRes.content?.url) window.open(genRes.content.url, "_blank");
      setCurrentStep(STEPS.length - 1);
    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur lors de la génération de la facture");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (currentInvoice?.id) {
      setIsGenerating(true);
      try {
        const res = await dispatch(generateInvoicePDF({ id: currentInvoice.id, format: "pdf" })).unwrap();
        if (res.content?.url) {
          const a = document.createElement("a");
          a.href = res.content.url;
          a.download = `Facture_${formData.invoiceNumber}.pdf`;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
        }
      } finally { setIsGenerating(false); }
    } else { await handleGenerateInvoice(); }
  };

  const handleSendEmail = async () => {
    if (!currentInvoice?.id) { alert("Veuillez d'abord générer la facture"); return; }
    if (!formData.clientEmail) { alert("Veuillez renseigner l'email du client"); return; }
    setIsSending(true);
    try {
      await dispatch(sendInvoiceByEmail({ id: currentInvoice.id, email: formData.clientEmail, message: `Veuillez trouver ci-joint la facture ${formData.invoiceNumber}` })).unwrap();
      alert("Facture envoyée avec succès");
      setInvoiceStatus("SENT");
    } catch (err) { alert("Erreur lors de l'envoi de la facture"); }
    finally { setIsSending(false); }
  };

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Facture_${formData.invoiceNumber}`,
  });

  const resetForm = () => {
    dispatch(clearInvoice());
    setFormData({
      invoiceNumber: "FA-XXXX", invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "", purchaseOrder: "", companyName: "", companyAddress: "", companyCity: "",
      companyPostalCode: "", companyPhone: "", companyEmail: "", companyTaxId: "", companyLogo: "",
      clientName: "", clientCompany: "", clientEmail: "", clientPhone: "", clientAddress: "",
      clientCity: "", clientPostalCode: "", clientTaxId: "", paymentTerms: "30", paymentMethod: "OTHER",
      bankName: "", bankAccount: "", notes: "", termsAndConditions: "",
    });
    setInvoiceItems([{ id: 1, description: "", quantity: 1, unitPrice: 0, discount: 0, taxRate: 18, total: 0 }]);
    setInvoiceStatus("DRAFT");
    setCurrentStep(0);
  };

  // ── Badge statut ────────────────────────────
  const getStatusBadge = () => {
    const cfg = {
      DRAFT:   { label: "Brouillon", className: "bg-gray-100 text-gray-700" },
      SENT:    { label: "Envoyée",   className: "bg-blue-100 text-blue-700" },
      PAID:    { label: "Payée",     className: "bg-green-100 text-green-700" },
      OVERDUE: { label: "En retard", className: "bg-red-100 text-red-700" },
    };
    const c = cfg[invoiceStatus] || cfg.draft;
    return <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.className}`}>{c.label}</span>;
  };

  // ════════════════════════════════════════════
  // RENDU DES ÉTAPES
  // ════════════════════════════════════════════
  const renderStep = () => {
    switch (STEPS[currentStep].id) {

      // ── Étape 1 : Informations facture ───────
      case "invoice":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Informations de la facture</h2>
              <p className="mt-1 text-sm text-gray-500">Renseignez les informations de base de votre facture.</p>
            </div>
            <HelpNotice variant="info" title="À savoir" tips={[
              "Le numéro de facture est généré automatiquement, vous pouvez le modifier.",
              "La date d'échéance se calcule automatiquement selon les conditions de paiement.",
              "Le bon de commande (PO) est facultatif mais recommandé pour les entreprises.",
            ]} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Numéro de facture *</Label>
                <div className="relative">
                  <Input id="invoiceNumber" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleInputChange} className="pr-10 font-mono" required />
                  <Hash className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="quoteNumber">Choix du devis *</Label>
                <div className="relative">
                  <Button onClick={() => setIsQuoteDialogOpen(true)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Choisir un devis
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseOrder">Bon de commande</Label>
                <Input id="purchaseOrder" name="purchaseOrder" value={formData.purchaseOrder} onChange={handleInputChange} placeholder="PO-2026-001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Date de facture *</Label>
                <div className="relative">
                  <Input id="invoiceDate" name="invoiceDate" type="date" value={formData.invoiceDate} onChange={handleInvoiceDateChange} required />
                  <Calendar className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d'échéance</Label>
                <div className="relative">
                  <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleInputChange} />
                  <Clock className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Conditions de paiement</Label>
                <select id="paymentTerms" name="paymentTerms" value={formData.paymentTerms} onChange={handlePaymentTermsChange}
                  className="w-full px-3 py-2 text-sm border rounded-md">
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
                <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border rounded-md">
                  <option value="">Sélectionnez</option>
                  {paymentMethods.map(m => <option key={m.value} value={m.value}>{m.icon} {m.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        );

      // ── Étape 2 : Émetteur ───────────────────
      case "company":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Votre entreprise</h2>
              <p className="mt-1 text-sm text-gray-500">Ces informations apparaîtront en tant qu'émetteur sur la facture.</p>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "Le nom de l'entreprise est obligatoire.",
              "Ajoutez votre N° d'identification fiscale si vous êtes assujetti à la TVA.",
            ]} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Votre Entreprise SARL" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyAddress">Adresse</Label>
                <Input id="companyAddress" name="companyAddress" value={formData.companyAddress} onChange={handleInputChange} placeholder="123 Avenue de la République" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyCity">Ville</Label>
                <Input id="companyCity" name="companyCity" value={formData.companyCity} onChange={handleInputChange} placeholder="Douala" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPostalCode">Code postal / BP</Label>
                <Input id="companyPostalCode" name="companyPostalCode" value={formData.companyPostalCode} onChange={handleInputChange} placeholder="BP 1234" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Téléphone</Label>
                <div className="relative">
                  <Input id="companyPhone" name="companyPhone" value={formData.companyPhone} onChange={handleInputChange} placeholder="+237 6XX XX XX XX" />
                  <Phone className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email</Label>
                <div className="relative">
                  <Input id="companyEmail" name="companyEmail" type="email" value={formData.companyEmail} onChange={handleInputChange} placeholder="contact@votreentreprise.com" />
                  <Mail className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyTaxId">N° Identification Fiscale</Label>
                <Input id="companyTaxId" name="companyTaxId" value={formData.companyTaxId} onChange={handleInputChange} placeholder="CM12345678901" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyLogo">Logo de l'entreprise</Label>
                <Input
                  id="companyLogo"
                  name="companyLogo"
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      // Optionally, convert to base64 or keep File, adapt reducer as needed
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        // setFormData(f => ({ ...f, companyLogo: ev.target.result }));
                        setFormData(f => ({ ...f, companyLogo: file }));
                        setLogoPreview(ev.target.result);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setFormData(f => ({ ...f, companyLogo: "" }));
                      setLogoPreview("");
                    }
                  }}
                />
                <div className="mt-1">
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo de l'entreprise"
                      className="border rounded max-h-16"
                      style={{ objectFit: "contain", background: "#f9f9f9", padding: 2 }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      // ── Étape 3 : Client ─────────────────────
      case "client":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Informations du client</h2>
              <p className="mt-1 text-sm text-gray-500">Ces informations apparaîtront en tant que destinataire sur la facture.</p>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "Le nom du client est obligatoire.",
              "Renseignez l'email pour pouvoir envoyer la facture directement depuis l'application.",
            ]} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientName">Nom du client *</Label>
                <Input id="clientName" name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="Jean Dupont" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientCompany">Entreprise du client</Label>
                <Input id="clientCompany" name="clientCompany" value={formData.clientCompany} onChange={handleInputChange} placeholder="Client Entreprise SA" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email</Label>
                <div className="relative">
                  <Input id="clientEmail" name="clientEmail" type="email" value={formData.clientEmail} onChange={handleInputChange} placeholder="client@email.com" />
                  <Mail className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Téléphone</Label>
                <div className="relative">
                  <Input id="clientPhone" name="clientPhone" value={formData.clientPhone} onChange={handleInputChange} placeholder="+237 6XX XX XX XX" />
                  <Phone className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientAddress">Adresse</Label>
                <Input id="clientAddress" name="clientAddress" value={formData.clientAddress} onChange={handleInputChange} placeholder="456 Boulevard Principal" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCity">Ville</Label>
                <Input id="clientCity" name="clientCity" value={formData.clientCity} onChange={handleInputChange} placeholder="Yaoundé" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPostalCode">Code postal / BP</Label>
                <Input id="clientPostalCode" name="clientPostalCode" value={formData.clientPostalCode} onChange={handleInputChange} placeholder="BP 456" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientTaxId">N° Identification Fiscale</Label>
                <Input id="clientTaxId" name="clientTaxId" value={formData.clientTaxId} onChange={handleInputChange} placeholder="CM98765432101" />
              </div>
            </div>
          </div>
        );

      // ── Étape 4 : Articles ───────────────────
      case "items":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Lignes de facturation</h2>
                <p className="mt-1 text-sm text-gray-500">Ajoutez les produits ou services à facturer.</p>
              </div>
              <Badge variant="outline">{invoiceItems.length} article(s)</Badge>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "Chaque ligne doit avoir une description et un prix unitaire supérieur à 0.",
              "La remise est en pourcentage (ex : 10 pour 10%).",
              "Le total de chaque ligne est calculé automatiquement.",
            ]} />
            <div className="space-y-4">
              {invoiceItems.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }} className="p-4 space-y-3 border rounded-xl bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">Ligne {index + 1}</Badge>
                    <div className="flex gap-1">
                      <Button type="button" onClick={() => duplicateInvoiceItem(item.id)} variant="ghost" size="sm"
                        className="w-8 h-8 p-0 text-blue-500 hover:bg-blue-50" title="Dupliquer">
                        <Copy className="w-4 h-4" />
                      </Button>
                      {invoiceItems.length > 1 && (
                        <Button type="button" onClick={() => removeInvoiceItem(item.id)} variant="ghost" size="sm"
                          className="w-8 h-8 p-0 text-red-500 hover:bg-red-50" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Input value={item.description} onChange={e => updateInvoiceItem(item.id, "description", e.target.value)}
                      placeholder="Ex: Développement application web" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    <div className="space-y-2">
                      <Label>Qté</Label>
                      <Input type="number" value={item.quantity} min="1" step="0.01"
                        onChange={e => updateInvoiceItem(item.id, "quantity", Math.max(1, parseFloat(e.target.value) || 1))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Prix U. ({symbol})</Label>
                      <Input type="number" value={item.unitPrice} min="0" step="0.01"
                        onChange={e => updateInvoiceItem(item.id, "unitPrice", Math.max(0, parseFloat(e.target.value) || 0))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Remise %</Label>
                      <div className="relative">
                        <Input type="number" value={item.discount} min="0" max="100" step="0.01"
                          onChange={e => updateInvoiceItem(item.id, "discount", Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))} />
                        <Percent className="absolute w-3 h-3 text-gray-400 -translate-y-1/2 pointer-events-none right-2 top-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>TVA %</Label>
                      <Input type="number" value={item.taxRate} min="0" step="0.01"
                        onChange={e => updateInvoiceItem(item.id, "taxRate", Math.max(0, parseFloat(e.target.value) || 0))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <div className="flex items-center h-10 px-3 py-2 text-sm font-semibold bg-white border rounded-lg text-primary">
                        {item.total.toLocaleString()} {symbol}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button type="button" onClick={addInvoiceItem} variant="outline" className="w-full gap-2">
              <Plus className="w-4 h-4" /> Ajouter une ligne
            </Button>

            {/* Mini récap */}
            <div className="p-4 space-y-2 border rounded-xl bg-primary/5">
              <h4 className="text-sm font-semibold text-primary">Récapitulatif</h4>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Sous-total HT</span><span>{subtotal.toLocaleString()} {symbol}</span></div>
              {totalDiscount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Remise</span><span className="text-green-600">-{totalDiscount.toLocaleString()} {symbol}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-gray-600">TVA</span><span>{totalTax.toLocaleString()} {symbol}</span></div>
              <Separator />
              <div className="flex justify-between font-bold"><span>Total TTC</span><span className="text-primary">{total.toLocaleString()} {symbol}</span></div>
            </div>
          </div>
        );

      // ── Étape 5 : Paiement ───────────────────
      case "payment":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Coordonnées bancaires</h2>
              <p className="mt-1 text-sm text-gray-500">Ces informations faciliteront le règlement par votre client.</p>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "Les coordonnées bancaires sont facultatives mais recommandées pour les virements.",
              "Pour le Cameroun, précisez votre numéro de compte BEAC ou votre RIB.",
            ]} />
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Nom de la banque</Label>
                <Input id="bankName" name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="Banque Atlantique, SCB Cameroun…" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Numéro de compte / IBAN</Label>
                <Input id="bankAccount" name="bankAccount" value={formData.bankAccount} onChange={handleInputChange} placeholder="CM21 1000 1234 5678 9012 3456 789" />
              </div>
            </div>
          </div>
        );

      // ── Étape 6 : Notes ──────────────────────
      case "notes":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Notes et conditions</h2>
              <p className="mt-1 text-sm text-gray-500">Ajoutez un message personnalisé ou vos conditions générales de vente.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Message / Notes</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={3}
                  placeholder="Merci pour votre confiance. N'hésitez pas à nous contacter pour toute question." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Conditions générales</Label>
                <Textarea id="termsAndConditions" name="termsAndConditions" value={formData.termsAndConditions} onChange={handleInputChange} rows={4}
                  placeholder="Paiement à réception de facture. Toute facture impayée après la date d'échéance entraînera des pénalités de retard de 1,5% par mois." />
              </div>
            </div>
          </div>
        );

      // ── Étape 7 : Aperçu ─────────────────────
      case "preview":
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Aperçu de la facture</h2>
                <p className="mt-1 text-sm text-gray-500">Vérifiez votre facture avant de la générer.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setCurrentStep(0)} className="gap-2">
                  <Edit2 className="w-4 h-4" /> Modifier
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                  <Printer className="w-4 h-4" /> Imprimer
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleSendEmail} disabled={isSending || !formData.clientEmail} className="gap-2">
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Envoyer
                </Button>
                <Button type="button" size="sm" onClick={handleDownloadPDF} disabled={isGenerating} className="gap-2">
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Télécharger PDF
                </Button>
              </div>
            </div>

            {/* Document preview */}
            {/* <div className="overflow-hidden border shadow-sm rounded-xl">
              <div ref={invoiceRef} className="max-w-4xl p-8 mx-auto bg-white">
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-primary">FACTURE</h1>
                      <p className="text-sm text-gray-500">N° {formData.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      {formData.companyLogo
                        ? <img src={formData.companyLogo} alt="Logo" className="h-16" />
                        : <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10"><Building2 className="w-8 h-8 text-primary" /></div>
                      }
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 mt-8">
                    <div>
                      <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Émetteur</h3>
                      <p className="font-bold">{formData.companyName || "Votre entreprise"}</p>
                      {formData.companyAddress && <p className="text-sm text-gray-600">{formData.companyAddress}</p>}
                      {(formData.companyPostalCode || formData.companyCity) && <p className="text-sm text-gray-600">{formData.companyPostalCode} {formData.companyCity}</p>}
                      {formData.companyPhone && <p className="text-sm text-gray-600">Tél : {formData.companyPhone}</p>}
                      {formData.companyEmail && <p className="text-sm text-gray-600">{formData.companyEmail}</p>}
                      {formData.companyTaxId && <p className="text-sm text-gray-600">NIF : {formData.companyTaxId}</p>}
                    </div>
                    <div>
                      <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Client</h3>
                      {formData.clientCompany && <p className="font-bold">{formData.clientCompany}</p>}
                      <p className="font-medium">{formData.clientName || "Client"}</p>
                      {formData.clientAddress && <p className="text-sm text-gray-600">{formData.clientAddress}</p>}
                      {(formData.clientPostalCode || formData.clientCity) && <p className="text-sm text-gray-600">{formData.clientPostalCode} {formData.clientCity}</p>}
                      {formData.clientPhone && <p className="text-sm text-gray-600">Tél : {formData.clientPhone}</p>}
                      {formData.clientEmail && <p className="text-sm text-gray-600">{formData.clientEmail}</p>}
                      {formData.clientTaxId && <p className="text-sm text-gray-600">NIF : {formData.clientTaxId}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-3 mt-6 rounded-lg bg-gray-50">
                    <div>
                      <p className="text-xs text-gray-500">Date de facture</p>
                      <p className="text-sm font-medium">{formData.invoiceDate ? new Date(formData.invoiceDate).toLocaleDateString("fr-FR") : "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date d'échéance</p>
                      <p className="text-sm font-medium">{formData.dueDate ? new Date(formData.dueDate).toLocaleDateString("fr-FR") : "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Bon de commande</p>
                      <p className="text-sm font-medium">{formData.purchaseOrder || "-"}</p>
                    </div>
                  </div>
                </div>

                <table className="w-full mb-8 text-sm">
                  <thead>
                    <tr className="bg-primary/5">
                      <th className="p-3 font-semibold text-left">Description</th>
                      <th className="p-3 font-semibold text-right">Qté</th>
                      <th className="p-3 font-semibold text-right">Prix U. ({symbol})</th>
                      <th className="p-3 font-semibold text-right">Remise</th>
                      <th className="p-3 font-semibold text-right">TVA</th>
                      <th className="p-3 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-3">{item.description || "-"}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">{item.unitPrice.toLocaleString()} {symbol}</td>
                        <td className="p-3 text-right">{item.discount > 0 ? `${item.discount}%` : "-"}</td>
                        <td className="p-3 text-right">{item.taxRate > 0 ? `${item.taxRate}%` : "-"}</td>
                        <td className="p-3 font-medium text-right">{item.total.toLocaleString()} {symbol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end mb-8">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Sous-total HT</span><span className="font-medium">{subtotal.toLocaleString()} {symbol}</span></div>
                    {totalDiscount > 0 && <div className="flex justify-between"><span className="text-gray-600">Remise totale</span><span className="font-medium text-green-600">-{totalDiscount.toLocaleString()} {symbol}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-600">Total HT</span><span className="font-medium">{subtotalAfterDiscount.toLocaleString()} {symbol}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">TVA</span><span className="font-medium">{totalTax.toLocaleString()} {symbol}</span></div>
                    <div className="pt-2 mt-2 border-t-2 border-primary">
                      <div className="flex justify-between text-base font-bold"><span>TOTAL TTC</span><span className="text-primary">{total.toLocaleString()} {symbol}</span></div>
                    </div>
                  </div>
                </div>

                {formData.notes && <div className="mb-4"><h4 className="mb-1 text-sm font-semibold">Notes :</h4><p className="text-sm text-gray-600">{formData.notes}</p></div>}
                {formData.termsAndConditions && <div><h4 className="mb-1 text-sm font-semibold">Conditions générales :</h4><p className="text-xs text-gray-500">{formData.termsAndConditions}</p></div>}

                {(formData.bankName || formData.bankAccount) && (
                  <div className="p-3 mt-6 rounded-lg bg-gray-50">
                    <h4 className="mb-1 text-sm font-semibold">Coordonnées bancaires :</h4>
                    {formData.bankName && <p className="text-xs text-gray-600">Banque : {formData.bankName}</p>}
                    {formData.bankAccount && <p className="text-xs text-gray-600">Compte : {formData.bankAccount}</p>}
                  </div>
                )}

                <div className="pt-4 mt-8 text-xs text-center text-gray-400 border-t">
                  Facture générée le {new Date().toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div> */}
          </div>
        );

      default:
        return null;
    }
  };

  // ════════════════════════════════════════════
  // RENDU PRINCIPAL
  // ════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-linear-to-r from-primary/10 via-primary/5 to-white">
        <div className="container px-4 py-4 mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-4 rounded-full w-14 h-14 bg-primary/10">
              <Receipt className="w-7 h-7 text-primary" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Générateur de Facture</h1>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="font-mono text-sm text-gray-500">{formData.invoiceNumber}</span>
              {getStatusBadge()}
            </div>
            <p className="mt-1 text-sm text-gray-500">Créez une facture professionnelle en quelques étapes guidées</p>
          </motion.div>
        </div>
      </div>

      {/* Erreur Redux */}
      {error && (
        <div className="container max-w-5xl px-4 mx-auto mt-4">
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
            <AlertCircle className="flex-shrink-0 w-4 h-4" /> {error}
          </div>
        </div>
      )}

      <div className="container max-w-5xl px-4 py-8 mx-auto">
        {/* Barre de progression */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 mb-8 bg-white border shadow-sm rounded-2xl">
          <ProgressBar steps={STEPS} currentStep={currentStep} onNavigate={goTo} />
        </motion.div>

        {/* Navigation */}
        {/* <div className="flex flex-wrap items-center justify-between gap-3 mb-6"> */}
        <div className="flex flex-row items-center justify-between gap-3 mb-6">
          <div className="flex flex-col flex-1 gap-2 md:flex-none">
            {/* Bouton Historique des factures */}
            <Button type="button" variant="outline" onClick={() => setIsInvoiceHistoryOpen(true)} className="gap-2 text-wrap">
              <BookOpen className="w-4 h-4" /> Historique des <br />factures
            </Button>
            <Button type="button" variant="outline" onClick={goPrev} disabled={currentStep === 0} className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Précédent
            </Button>
          </div>

          <div className="hidden text-xs text-muted-foreground sm:block">
            {currentStep + 1} / {STEPS.length}
          </div>

          <div className="flex flex-col flex-1 gap-2 md:flex-none">
            <Button type="button" onClick={handleGenerateInvoice} disabled={isGenerating || !isFormValid()} className="gap-2">
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Génération…</>
                : <><Download className="w-4 h-4" /> Générer la facture</>}
            </Button>
            {currentStep < STEPS.length - 1 && (
              <Button type="button" variant="outline" onClick={goNext} disabled={!canGoNext()} className="gap-2">
                Suivant <ChevronRight className="w-4 h-4" />
              </Button>
            )}
            
          </div>
        </div>

        {/* Contenu de l'étape */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-white border rounded-2xl shadow-sm p-6 md:p-8 min-h-[400px]"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Conseils généraux (sauf aperçu) */}
        {STEPS[currentStep]?.id !== "preview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 mt-8 border rounded-xl bg-muted/30">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="mb-2 text-sm font-semibold">Conseils pour une facture efficace</h4>
                <ul className="grid grid-cols-1 gap-1 text-xs text-muted-foreground md:grid-cols-2">
                  <li>• Vérifiez le numéro de facture pour éviter les doublons</li>
                  <li>• Précisez clairement les délais de paiement</li>
                  <li>• Incluez vos coordonnées bancaires pour faciliter le règlement</li>
                  <li>• Ajoutez un message de remerciement dans les notes</li>
                  <li>• Relisez les montants avant de générer le PDF</li>
                  <li>• Conservez une copie de chaque facture envoyée</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bouton Nouvelle facture */}
        {STEPS[currentStep]?.id === "preview" && (
          <div className="flex justify-center mt-6">
            <Button type="button" variant="outline" onClick={resetForm} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Nouvelle facture
            </Button>
          </div>
        )}
      </div>

      {/* Dialog Historique */}
      <InvoiceHistoryDialog
        isOpen={isInvoiceHistoryOpen}
        onClose={() => setIsInvoiceHistoryOpen(false)}
        invoiceHistory={[
          {
            id: "1",
            invoiceNumber: "INV-202603-0042",
            clientName: "Client SA",
            total: 185000,
            statut: "genere",    // "genere" | "envoye" | "paye" | "en_retard"
            dateCreation: "12/03/2026",
            dateEcheance: "11/04/2026",
            url: "https://...",
          },
        ]}
        onPreviewInvoice={(inv) => window.open(inv.url, "_blank")}
        onDownloadInvoice={(inv) => { /* download logic */ }}
        onDeleteInvoice={(inv)   => { /* delete logic  */ }}
        onDuplicateInvoice={(inv) => { /* duplicate logic */ }}
      />

      {/** Dialog selection de devis */}
      <QuoteSelectionDialog
         isOpen={isQuoteDialogOpen}
         onClose={() => setIsQuoteDialogOpen(false)}
         onConfirm={(quote) => {
           setSelectedQuote(quote);
           // Transformer en facture...
         }}
         quotes={quotes}
         title="Sélectionner un devis à facturer"
         description="Choisissez la version du devis que vous souhaitez transformer en facture"
         allowVersionSelection={true}
        />
    </div>
  );
};

export default InvoicePage;