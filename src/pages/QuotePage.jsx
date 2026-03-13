// QuotePage.jsx — Générateur de devis par étapes
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText, User, Mail, Phone, Building2, MapPin,
  Calendar, Clock, Package, Plus, Minus, Trash2,
  Send, Download, CheckCircle, AlertCircle, Briefcase,
  CreditCard, FileCheck, Receipt, Hash, Edit2, Eye,
  Printer, Loader2, ChevronDown, ChevronUp, ChevronLeft,
  ChevronRight, Copy, RefreshCw, DollarSign, Info, BookOpen,
  Percent,
} from "lucide-react";
import {
  selectCurrentQuote, selectQuoteLoading, selectQuoteError,
  selectGeneratedQuotePDF, createQuote, updateQuoteById,
  generateQuotePDF, sendQuoteByEmail, clearQuote, clearError,
  fetchQuoteById,
} from "@/redux/slices/quoteSlice";
import { useCurrency } from "@/context/CurrencyContext";
import QuoteHistoryDialog from "@/components/dialog/quoteHistoryDialog";

// ─────────────────────────────────────────────
// ÉTAPES DU WIZARD
// ─────────────────────────────────────────────
const STEPS = [
  { id: "client",  label: "Client",   icon: User       },
  { id: "project", label: "Projet",   icon: Briefcase  },
  { id: "items",   label: "Articles", icon: Package    },
  { id: "payment", label: "Paiement", icon: CreditCard },
  { id: "notes",   label: "Notes",    icon: FileCheck  },
  { id: "preview", label: "Aperçu",   icon: Eye        },
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
          Étape {currentStep + 1} / {steps.length} — <span className="text-emerald-600">{steps[currentStep]?.label}</span>
        </span>
        <span className="font-semibold text-emerald-600">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
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
                ${active ? "border-emerald-500 bg-emerald-500 text-white scale-110 shadow-md shadow-emerald-200"
                  : done  ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                  : "border-gray-300 bg-white text-gray-400 group-hover:border-emerald-300"}`}>
                {done ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className={`hidden sm:block text-[10px] font-medium leading-tight text-center
                ${active ? "text-emerald-600" : done ? "text-emerald-500" : "text-gray-400"}`}>
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
const QuotePage = () => {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const quoteRef  = useRef();
  const dispatch  = useDispatch();

  // Redux
  const currentQuote = useSelector(selectCurrentQuote);
  const loading      = useSelector(selectQuoteLoading);
  const error        = useSelector(selectQuoteError);

  // États locaux
  const [currentStep,         setCurrentStep]        = useState(0);
  const [isGenerating,        setIsGenerating]       = useState(false);
  const [isSending,           setIsSending]          = useState(false);
  const [isQuoteHistoryOpen,  setIsQuoteHistoryOpen] = useState(false);
  const [quoteStatus,         setQuoteStatus]        = useState("draft");

  const { symbol } = useCurrency();

  // ── Numéro de devis ─────────────────────────
  const generateQuoteNumber = () => {
    const d   = new Date();
    const yr  = d.getFullYear();
    const mo  = String(d.getMonth() + 1).padStart(2, "0");
    const rnd = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
    return `DEV-${yr}${mo}-${rnd}`;
  };

  // ── Formulaire ──────────────────────────────
  const [formData, setFormData] = useState({
    quoteNumber:        generateQuoteNumber(),
    firstName:          "Samuel",
    lastName:           "Bikoko",
    company:            "Bikoko Génie Civil SARL",
    email:              "s.bikoko@bgc-cm.com",
    phone:              "+237 6 71 23 45 67",
    address:            "123 Rue Paul Biya",
    city:               "Douala",
    postalCode:         "CM-237",
    quoteType:          "1",
    projectName:        "Construction Résidence Makepe",
    projectDescription: "Projet de construction d'une résidence moderne à Makepe, Douala.",
    startDate:          new Date().toISOString().split("T")[0],
    deadline:           "",
    budget:             "9500000",
    category:           "construction",
    taxRate:            19.25,
    discountRate:       5,
    deposit:            25,
    depositType:        "percentage",
    validUntil:         (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split("T")[0]; })(),
    additionalNotes:    "Pour tout renseignement, contactez notre agence à Akwa, Douala.",
    termsAndConditions: "Ce devis est valable 30 jours. Le paiement est exigible à la livraison.",
  });

  // ── Articles ────────────────────────────────
  const [quoteItems, setQuoteItems] = useState([
    { id: 1, description: "Fourniture et pose de fondations en béton armé", quantity: 10,  unitPrice: 75000, discount: 0, total: 750000 },
    { id: 2, description: "Élévation des murs (parpaing de 20)",            quantity: 120, unitPrice: 10000, discount: 2, total: 1176000 },
    { id: 3, description: "Charpente métallique et couverture bac acier",   quantity: 1,   unitPrice: 320000, discount: 0, total: 320000 },
  ]);

  // ── Options ─────────────────────────────────
  const categories = [
    { value: "development",  label: "Développement Web",       icon: "💻" },
    { value: "design",       label: "Design Graphique",        icon: "🎨" },
    { value: "marketing",    label: "Marketing Digital",       icon: "📱" },
    { value: "consulting",   label: "Conseil & Formation",     icon: "📊" },
    { value: "delivery",     label: "Livraison de Services",   icon: "🚚" },
    { value: "construction", label: "Construction",            icon: "🏗️" },
    { value: "renovation",   label: "Rénovation",              icon: "🔨" },
    { value: "other",        label: "Autre",                   icon: "📦" },
  ];

  const quoteTypes = [
    { value: "0",  label: "Travaux Pose seule"          },
    { value: "1",  label: "Travaux Fourniture et Pose"  },
    { value: "2",  label: "Rénovation"                  },
    { value: "3",  label: "Construction"                },
    { value: "4",  label: "Aménagement"                 },
    { value: "5",  label: "Poseur & Monteur"            },
    { value: "6",  label: "Études et Réalisation Plans" },
    { value: "7",  label: "Calcul Dimensionnement"      },
    { value: "8",  label: "Calcul de Vérification"      },
    { value: "9",  label: "Assistance Technique"        },
    { value: "10", label: "Autre"                       },
  ];

  // ── Chargement édition ──────────────────────
  useEffect(() => {
    if (id) dispatch(fetchQuoteById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (currentQuote) {
      setFormData({
        quoteNumber:        currentQuote.quoteNumber        || generateQuoteNumber(),
        firstName:          currentQuote.firstName          || "",
        lastName:           currentQuote.lastName           || "",
        company:            currentQuote.company            || "",
        email:              currentQuote.email              || "",
        phone:              currentQuote.phone              || "",
        address:            currentQuote.address            || "",
        city:               currentQuote.city               || "",
        postalCode:         currentQuote.postalCode         || "",
        quoteType:          currentQuote.quoteType          || "",
        projectName:        currentQuote.projectName        || "",
        projectDescription: currentQuote.projectDescription || "",
        startDate:          currentQuote.startDate          || "",
        deadline:           currentQuote.deadline           || "",
        budget:             currentQuote.budget             || "",
        category:           currentQuote.category           || "",
        taxRate:            currentQuote.taxRate            || 19.25,
        discountRate:       currentQuote.discountRate       || 0,
        deposit:            currentQuote.deposit            || 0,
        depositType:        currentQuote.depositType        || "percentage",
        validUntil:         currentQuote.validUntil         || "",
        additionalNotes:    currentQuote.additionalNotes    || "",
        termsAndConditions: currentQuote.termsAndConditions || "",
      });
      if (currentQuote.quoteItems) setQuoteItems(currentQuote.quoteItems);
      if (currentQuote.quoteStatus) setQuoteStatus(currentQuote.quoteStatus);
    }
  }, [currentQuote]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(t);
    }
  }, [error, dispatch]);

  // ── Formulaire handler ──────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Articles handlers ───────────────────────
  const addQuoteItem = () => {
    const newId = Math.max(...quoteItems.map(i => i.id), 0) + 1;
    setQuoteItems([...quoteItems, { id: newId, description: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 }]);
  };

  const updateQuoteItem = (id, field, value) => {
    setQuoteItems(quoteItems.map(item => {
      if (item.id !== id) return item;
      const u        = { ...item, [field]: value };
      const qty      = parseFloat(field === "quantity"  ? value : u.quantity)  || 0;
      const price    = parseFloat(field === "unitPrice" ? value : u.unitPrice) || 0;
      const disc     = parseFloat(field === "discount"  ? value : u.discount)  || 0;
      const base     = qty * price;
      u.total = base - base * (disc / 100);
      return u;
    }));
  };

  const removeQuoteItem    = (id) => { if (quoteItems.length > 1) setQuoteItems(quoteItems.filter(i => i.id !== id)); };
  const duplicateQuoteItem = (id) => {
    const item = quoteItems.find(i => i.id === id);
    if (!item) return;
    const newId = Math.max(...quoteItems.map(i => i.id), 0) + 1;
    setQuoteItems([...quoteItems, { ...item, id: newId }]);
  };
  const moveItem = (index, dir) => {
    const items    = [...quoteItems];
    const newIndex = dir === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < items.length) {
      [items[index], items[newIndex]] = [items[newIndex], items[index]];
      setQuoteItems(items);
    }
  };

  // ── Calculs ─────────────────────────────────
  const subtotal              = quoteItems.reduce((s, i) => s + i.total, 0);
  const discountAmount        = subtotal * ((parseFloat(formData.discountRate) || 0) / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount             = subtotalAfterDiscount * ((parseFloat(formData.taxRate) || 0) / 100);
  const total                 = subtotalAfterDiscount + taxAmount;
  const depositAmount         = formData.depositType === "percentage"
    ? total * ((parseFloat(formData.deposit) || 0) / 100)
    : parseFloat(formData.deposit) || 0;
  const remainingAmount = total - depositAmount;

  // ── Validation ──────────────────────────────
  const isFormValid = () => {
    const ok = ["firstName", "lastName", "email", "phone", "projectName"]
      .every(f => formData[f]?.toString().trim() !== "");
    const itemsOk = quoteItems.every(i => i.description?.trim() && i.unitPrice > 0);
    return ok && itemsOk;
  };

  // ── Validation par étape ────────────────────
  const canGoNext = () => {
    switch (STEPS[currentStep].id) {
      case "client":  return formData.firstName && formData.lastName && formData.email && formData.phone;
      case "project": return formData.projectName?.trim() !== "";
      case "items":   return quoteItems.length > 0 && quoteItems.every(i => i.description?.trim() && i.unitPrice > 0);
      case "payment": return true;
      case "notes":   return true;
      case "preview": return true;
      default:        return true;
    }
  };

  // ── Navigation ──────────────────────────────
  const goNext = () => { if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1); };
  const goPrev = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };
  const goTo   = (i) => setCurrentStep(i);

  // ── Actions ─────────────────────────────────
  const handleGenerateQuote = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        ...formData,
        quoteItems: quoteItems.map(({ id, ...i }) => i),
        quoteStatus, subtotal, taxAmount, discountAmount, total, depositAmount, remainingAmount,
      };
      let quoteId;
      if (currentQuote?.id) {
        await dispatch(updateQuoteById({ id: currentQuote.id, data: payload })).unwrap();
        quoteId = currentQuote.id;
      } else {
        const res = await dispatch(createQuote(payload)).unwrap();
        quoteId   = res.content.id;
      }
      if (!quoteId) throw new Error("ID du devis introuvable");
      const genRes = await dispatch(generateQuotePDF({ id: quoteId, format: "pdf" })).unwrap();
      if (genRes.content?.url) window.open(genRes.content.url, "_blank");
      setCurrentStep(STEPS.length - 1);
    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur lors de la génération du devis");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (currentQuote?.id) {
      setIsGenerating(true);
      try {
        const res = await dispatch(generateQuotePDF({ id: currentQuote.id, format: "pdf" })).unwrap();
        if (res.content?.url) {
          const a = document.createElement("a");
          a.href = res.content.url;
          a.download = `Devis_${formData.quoteNumber}.pdf`;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
        }
      } finally { setIsGenerating(false); }
    } else { await handleGenerateQuote(); }
  };

  const handleSendEmail = async () => {
    if (!currentQuote?.id) { alert("Veuillez d'abord générer le devis"); return; }
    if (!formData.email)   { alert("Veuillez renseigner l'email du client"); return; }
    setIsSending(true);
    try {
      await dispatch(sendQuoteByEmail({ id: currentQuote.id, email: formData.email, message: `Veuillez trouver ci-joint le devis ${formData.quoteNumber}` })).unwrap();
      alert("Devis envoyé avec succès");
      setQuoteStatus("sent");
    } catch { alert("Erreur lors de l'envoi du devis"); }
    finally { setIsSending(false); }
  };

  const handlePrint = useReactToPrint({
    content: () => quoteRef.current,
    documentTitle: `Devis_${formData.quoteNumber}`,
  });

  const resetForm = () => {
    dispatch(clearQuote());
    setFormData({
      quoteNumber: generateQuoteNumber(), firstName: "", lastName: "", company: "",
      email: "", phone: "", address: "", city: "", postalCode: "", quoteType: "",
      projectName: "", projectDescription: "", startDate: new Date().toISOString().split("T")[0],
      deadline: "", budget: "", category: "", taxRate: 19.25, discountRate: 0,
      deposit: 0, depositType: "percentage",
      validUntil: (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split("T")[0]; })(),
      additionalNotes: "", termsAndConditions: "",
    });
    setQuoteItems([{ id: 1, description: "", quantity: 1, unitPrice: 0, discount: 0, total: 0 }]);
    setQuoteStatus("draft");
    setCurrentStep(0);
  };

  // ── Badge statut ────────────────────────────
  const getStatusBadge = () => {
    const cfg = {
      draft:    { label: "Brouillon", className: "bg-gray-100 text-gray-700"     },
      sent:     { label: "Envoyé",    className: "bg-blue-100 text-blue-700"     },
      accepted: { label: "Accepté",   className: "bg-emerald-100 text-emerald-700" },
      rejected: { label: "Refusé",    className: "bg-red-100 text-red-700"       },
      expired:  { label: "Expiré",    className: "bg-orange-100 text-orange-700" },
    };
    const c = cfg[quoteStatus] || cfg.draft;
    return <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.className}`}>{c.label}</span>;
  };

  // ════════════════════════════════════════════
  // RENDU DES ÉTAPES
  // ════════════════════════════════════════════
  const renderStep = () => {
    switch (STEPS[currentStep].id) {

      // ── Étape 1 : Client ─────────────────────
      case "client":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Informations client</h2>
              <p className="mt-1 text-sm text-gray-500">Renseignez les coordonnées du client destinataire du devis.</p>
            </div>
            <HelpNotice variant="info" title="À savoir" tips={[
              "Le prénom, le nom, l'email et le téléphone sont obligatoires.",
              "L'entreprise est facultative mais recommandée pour les devis B2B.",
              "Le type de devis permet de catégoriser la nature des travaux.",
            ]} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <div className="relative">
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Samuel" required />
                  <User className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <div className="relative">
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Dupont" required />
                  <User className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="contact@email.com" required />
                  <Mail className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <div className="relative">
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+237 6XX XX XX XX" required />
                  <Phone className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="company">Entreprise</Label>
                <div className="relative">
                  <Input id="company" name="company" value={formData.company} onChange={handleInputChange} placeholder="Nom de l'entreprise" />
                  <Building2 className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="quoteType">Type de devis</Label>
                <select id="quoteType" name="quoteType" value={formData.quoteType} onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border rounded-md">
                  <option value="">Sélectionnez un type</option>
                  {quoteTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <div className="relative">
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Rue de la République" />
                  <MapPin className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Douala" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal / BP</Label>
                <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="BP 456" />
              </div>
            </div>
          </div>
        );

      // ── Étape 2 : Projet ─────────────────────
      case "project":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Détails du projet</h2>
              <p className="mt-1 text-sm text-gray-500">Décrivez le projet à réaliser pour ce devis.</p>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "Le nom du projet est obligatoire.",
              "Une description claire rassure le client sur votre compréhension du besoin.",
              "La date de validité est automatiquement fixée à 30 jours mais peut être modifiée.",
            ]} />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Nom du projet *</Label>
                <Input id="projectName" name="projectName" value={formData.projectName} onChange={handleInputChange}
                  placeholder="Ex : Construction Résidence Makepe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <select id="category" name="category" value={formData.category} onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border rounded-md">
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectDescription">Description du projet</Label>
                <Textarea id="projectDescription" name="projectDescription" value={formData.projectDescription}
                  onChange={handleInputChange} rows={4} placeholder="Décrivez le projet en détail..." />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début prévue</Label>
                  <div className="relative">
                    <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />
                    <Calendar className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Date limite du projet</Label>
                  <div className="relative">
                    <Input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleInputChange} />
                    <Clock className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget estimé ({symbol})</Label>
                  <div className="relative">
                    <Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleInputChange} placeholder="500000" />
                    <DollarSign className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Devis valable jusqu'au</Label>
                  <div className="relative">
                    <Input id="validUntil" name="validUntil" type="date" value={formData.validUntil} onChange={handleInputChange} />
                    <Calendar className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ── Étape 3 : Articles ───────────────────
      case "items":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Articles du devis</h2>
                <p className="mt-1 text-sm text-gray-500">Listez les prestations ou fournitures à chiffrer.</p>
              </div>
              <Badge variant="outline">{quoteItems.length} article(s)</Badge>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "Chaque article doit avoir une description et un prix unitaire.",
              "Utilisez les flèches ↑↓ pour réordonner les articles.",
              "La remise par ligne est en pourcentage. La remise globale se règle à l'étape suivante.",
            ]} />
            <div className="space-y-4">
              {quoteItems.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }} className="p-4 space-y-3 border rounded-xl bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">Article {index + 1}</Badge>
                    <div className="flex items-center gap-1">
                      <Button type="button" onClick={() => moveItem(index, "up")} disabled={index === 0}
                        variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400">
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button type="button" onClick={() => moveItem(index, "down")} disabled={index === quoteItems.length - 1}
                        variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button type="button" onClick={() => duplicateQuoteItem(item.id)} variant="ghost" size="sm"
                        className="w-8 h-8 p-0 text-blue-500 hover:bg-blue-50" title="Dupliquer">
                        <Copy className="w-4 h-4" />
                      </Button>
                      {quoteItems.length > 1 && (
                        <Button type="button" onClick={() => removeQuoteItem(item.id)} variant="ghost" size="sm"
                          className="w-8 h-8 p-0 text-red-500 hover:bg-red-50" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Input value={item.description} onChange={e => updateQuoteItem(item.id, "description", e.target.value)}
                      placeholder="Ex : Fourniture et pose de carrelage" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Quantité</Label>
                      <div className="flex items-center gap-1">
                        <Button type="button" variant="outline" size="sm" className="flex-shrink-0 w-8 h-8 p-0"
                          onClick={() => updateQuoteItem(item.id, "quantity", Math.max(1, item.quantity - 1))}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input type="number" value={item.quantity} min="1" step="0.01" className="px-1 text-center"
                          onChange={e => updateQuoteItem(item.id, "quantity", Math.max(1, parseFloat(e.target.value) || 1))} />
                        <Button type="button" variant="outline" size="sm" className="flex-shrink-0 w-8 h-8 p-0"
                          onClick={() => updateQuoteItem(item.id, "quantity", item.quantity + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Prix U. ({symbol})</Label>
                      <Input type="number" value={item.unitPrice} min="0" step="100"
                        onChange={e => updateQuoteItem(item.id, "unitPrice", Math.max(0, parseFloat(e.target.value) || 0))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Remise %</Label>
                      <div className="relative">
                        <Input type="number" value={item.discount} min="0" max="100" step="1"
                          onChange={e => updateQuoteItem(item.id, "discount", Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))} />
                        <Percent className="absolute w-3 h-3 text-gray-400 -translate-y-1/2 pointer-events-none right-2 top-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <div className="flex items-center h-10 px-3 py-2 text-sm font-semibold bg-white border rounded-lg text-emerald-600">
                        {item.total.toLocaleString()} {symbol}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button type="button" onClick={addQuoteItem} variant="outline" className="w-full gap-2">
              <Plus className="w-4 h-4" /> Ajouter un article
            </Button>

            {/* Mini récap */}
            <div className="p-4 space-y-2 border rounded-xl bg-emerald-50/50">
              <h4 className="text-sm font-semibold text-emerald-700">Récapitulatif articles</h4>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Sous-total HT</span><span>{subtotal.toLocaleString()} {symbol}</span></div>
              <Separator />
              <div className="flex justify-between text-sm font-bold"><span>Sous-total avant remise globale</span><span className="text-emerald-600">{subtotal.toLocaleString()} {symbol}</span></div>
            </div>
          </div>
        );

      // ── Étape 4 : Paiement ───────────────────
      case "payment":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Paramètres de paiement</h2>
              <p className="mt-1 text-sm text-gray-500">Configurez la TVA, la remise globale et l'acompte.</p>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "La TVA au Cameroun est de 19,25% (taux officiel).",
              "La remise globale s'applique sur le sous-total de tous les articles.",
              "L'acompte peut être un montant fixe ou un pourcentage du total TTC.",
            ]} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taxRate">TVA (%)</Label>
                <div className="relative">
                  <Input id="taxRate" name="taxRate" type="number" value={formData.taxRate}
                    onChange={handleInputChange} min="0" max="100" step="0.01" />
                  <Percent className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountRate">Remise globale (%)</Label>
                <div className="relative">
                  <Input id="discountRate" name="discountRate" type="number" value={formData.discountRate}
                    onChange={handleInputChange} min="0" max="100" step="1" />
                  <Percent className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit">Acompte</Label>
                <div className="flex gap-2">
                  <Input id="deposit" name="deposit" type="number" value={formData.deposit}
                    onChange={handleInputChange} min="0"
                    step={formData.depositType === "percentage" ? "1" : "1000"} className="flex-1" />
                  <select name="depositType" value={formData.depositType} onChange={handleInputChange}
                    className="w-24 px-3 py-2 text-sm border rounded-md">
                    <option value="percentage">%</option>
                    <option value="fixed">{symbol}</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Récapitulatif financier</Label>
                <div className="p-3 space-y-1.5 rounded-lg bg-gray-50 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Sous-total HT</span><span className="font-medium">{subtotal.toLocaleString()} {symbol}</span></div>
                  {discountAmount > 0 && <div className="flex justify-between"><span className="text-gray-600">Remise ({formData.discountRate}%)</span><span className="font-medium text-green-600">-{discountAmount.toLocaleString()} {symbol}</span></div>}
                  <div className="flex justify-between"><span className="text-gray-600">Total HT</span><span className="font-medium">{subtotalAfterDiscount.toLocaleString()} {symbol}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">TVA ({formData.taxRate}%)</span><span className="font-medium">{taxAmount.toLocaleString()} {symbol}</span></div>
                  <Separator />
                  <div className="flex justify-between font-bold text-emerald-600"><span>Total TTC</span><span>{total.toLocaleString()} {symbol}</span></div>
                  {depositAmount > 0 && <>
                    <div className="flex justify-between"><span className="text-gray-600">Acompte</span><span>{depositAmount.toLocaleString()} {symbol}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Reste à payer</span><span>{remainingAmount.toLocaleString()} {symbol}</span></div>
                  </>}
                </div>
              </div>
            </div>
          </div>
        );

      // ── Étape 5 : Notes ──────────────────────
      case "notes":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Notes et conditions</h2>
              <p className="mt-1 text-sm text-gray-500">Ajoutez un message personnalisé et vos conditions générales.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Notes additionnelles</Label>
                <Textarea id="additionalNotes" name="additionalNotes" value={formData.additionalNotes}
                  onChange={handleInputChange} rows={3}
                  placeholder="Délais de livraison, garanties, remarques particulières..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Conditions générales</Label>
                <Textarea id="termsAndConditions" name="termsAndConditions" value={formData.termsAndConditions}
                  onChange={handleInputChange} rows={4}
                  placeholder="Conditions de paiement, validité, pénalités de retard..." />
              </div>
            </div>
          </div>
        );

      // ── Étape 6 : Aperçu ─────────────────────
      case "preview": {
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Aperçu du devis</h2>
                <p className="mt-1 text-sm text-gray-500">Vérifiez votre devis avant de le générer.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setCurrentStep(0)} className="gap-2">
                  <Edit2 className="w-4 h-4" /> Modifier
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                  <Printer className="w-4 h-4" /> Imprimer
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleSendEmail} disabled={isSending || !formData.email} className="gap-2">
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Envoyer
                </Button>
                <Button type="button" size="sm" onClick={handleDownloadPDF} disabled={isGenerating}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Télécharger PDF
                </Button>
              </div>
            </div>

            {/* Document preview */}
            <div className="overflow-hidden border shadow-sm rounded-xl">
              <div ref={quoteRef} className="max-w-4xl p-8 mx-auto bg-white">
                {/* En-tête */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-emerald-600">DEVIS</h1>
                      <p className="font-mono text-sm text-gray-500">N° {formData.quoteNumber}</p>
                    </div>
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-emerald-100">
                      <FileText className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mt-8">
                    <div>
                      <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Client</h3>
                      <p className="font-bold">{fullName || "Client"}</p>
                      {formData.company && <p className="text-sm">{formData.company}</p>}
                      {formData.address && <p className="text-sm text-gray-600">{formData.address}</p>}
                      {(formData.postalCode || formData.city) && <p className="text-sm text-gray-600">{formData.postalCode} {formData.city}</p>}
                      {formData.phone && <p className="text-sm text-gray-600">Tél : {formData.phone}</p>}
                      {formData.email && <p className="text-sm text-gray-600">{formData.email}</p>}
                    </div>
                    <div className="space-y-1 text-sm text-right">
                      <p><span className="text-gray-500">Date d'émission : </span><span className="font-medium">{new Date().toLocaleDateString("fr-FR")}</span></p>
                      {formData.validUntil && <p><span className="text-gray-500">Valable jusqu'au : </span><span className="font-medium">{new Date(formData.validUntil).toLocaleDateString("fr-FR")}</span></p>}
                      {formData.startDate  && <p><span className="text-gray-500">Début prévu : </span><span className="font-medium">{new Date(formData.startDate).toLocaleDateString("fr-FR")}</span></p>}
                      {formData.deadline   && <p><span className="text-gray-500">Date limite : </span><span className="font-medium">{new Date(formData.deadline).toLocaleDateString("fr-FR")}</span></p>}
                    </div>
                  </div>

                  {formData.projectName && (
                    <div className="p-4 mt-6 rounded-lg bg-emerald-50/60">
                      <h3 className="mb-1 text-sm font-semibold text-emerald-800">Projet : {formData.projectName}</h3>
                      {formData.projectDescription && <p className="text-sm text-gray-600">{formData.projectDescription}</p>}
                    </div>
                  )}
                </div>

                {/* Tableau articles */}
                <table className="w-full mb-8 text-sm">
                  <thead>
                    <tr className="bg-emerald-50">
                      <th className="p-3 font-semibold text-left">Description</th>
                      <th className="p-3 font-semibold text-right">Qté</th>
                      <th className="p-3 font-semibold text-right">Prix U. ({symbol})</th>
                      <th className="p-3 font-semibold text-right">Remise</th>
                      <th className="p-3 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteItems.map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-3">{item.description || "-"}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">{item.unitPrice.toLocaleString()} {symbol}</td>
                        <td className="p-3 text-right">{item.discount > 0 ? `${item.discount}%` : "-"}</td>
                        <td className="p-3 font-medium text-right">{item.total.toLocaleString()} {symbol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totaux */}
                <div className="flex justify-end mb-8">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Sous-total HT</span><span className="font-medium">{subtotal.toLocaleString()} {symbol}</span></div>
                    {discountAmount > 0 && <div className="flex justify-between"><span className="text-gray-600">Remise ({formData.discountRate}%)</span><span className="font-medium text-green-600">-{discountAmount.toLocaleString()} {symbol}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-600">Total HT</span><span className="font-medium">{subtotalAfterDiscount.toLocaleString()} {symbol}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">TVA ({formData.taxRate}%)</span><span className="font-medium">{taxAmount.toLocaleString()} {symbol}</span></div>
                    <div className="pt-2 mt-2 border-t-2 border-emerald-500">
                      <div className="flex justify-between text-base font-bold"><span>TOTAL TTC</span><span className="text-emerald-600">{total.toLocaleString()} {symbol}</span></div>
                    </div>
                    {depositAmount > 0 && (
                      <div className="pt-2 mt-1 space-y-1 border-t border-gray-200">
                        <div className="flex justify-between"><span className="text-gray-600">Acompte</span><span>{depositAmount.toLocaleString()} {symbol}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Reste à payer</span><span>{remainingAmount.toLocaleString()} {symbol}</span></div>
                      </div>
                    )}
                  </div>
                </div>

                {formData.additionalNotes    && <div className="mb-4"><h4 className="mb-1 text-sm font-semibold">Notes :</h4><p className="text-sm text-gray-600">{formData.additionalNotes}</p></div>}
                {formData.termsAndConditions && <div><h4 className="mb-1 text-sm font-semibold">Conditions :</h4><p className="text-xs text-gray-500">{formData.termsAndConditions}</p></div>}

                <div className="pt-4 mt-8 text-xs text-center text-gray-400 border-t">
                  Devis généré le {new Date().toLocaleDateString("fr-FR")}
                  {formData.validUntil && ` — Valable jusqu'au ${new Date(formData.validUntil).toLocaleDateString("fr-FR")}`}
                </div>
              </div>
            </div>
          </div>
        );
      }

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
      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-white">
        <div className="container px-4 py-10 mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-4 rounded-full w-14 h-14 bg-emerald-100">
              <FileText className="w-7 h-7 text-emerald-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Générateur de Devis</h1>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="font-mono text-sm text-gray-500">{formData.quoteNumber}</span>
              {getStatusBadge()}
            </div>
            <p className="mt-1 text-sm text-gray-500">Créez un devis professionnel en quelques étapes guidées</p>
          </motion.div>
        </div>
      </div>

      {/* Erreur */}
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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => setIsQuoteHistoryOpen(true)} className="gap-2">
              <BookOpen className="w-4 h-4" /> Historique des devis
            </Button>
            <Button type="button" variant="outline" onClick={goPrev} disabled={currentStep === 0} className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Précédent
            </Button>
          </div>

          <div className="hidden text-xs text-muted-foreground sm:block">
            {currentStep + 1} / {STEPS.length}
          </div>

          <div className="flex gap-2">
            {currentStep < STEPS.length - 1 && (
              <Button type="button" variant="outline" onClick={goNext} disabled={!canGoNext()} className="gap-2">
                Suivant <ChevronRight className="w-4 h-4" />
              </Button>
            )}
            <Button type="button" onClick={handleGenerateQuote} disabled={isGenerating || !isFormValid()}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Génération…</>
                : <><Download className="w-4 h-4" /> Générer le devis</>}
            </Button>
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

        {/* Conseils généraux */}
        {STEPS[currentStep]?.id !== "preview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 mt-8 border rounded-xl bg-muted/30">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="mb-2 text-sm font-semibold">Conseils pour un devis efficace</h4>
                <ul className="grid grid-cols-1 gap-1 text-xs text-muted-foreground md:grid-cols-2">
                  <li>• Détaillez précisément chaque poste pour éviter les litiges</li>
                  <li>• Indiquez clairement la validité du devis (30 jours recommandé)</li>
                  <li>• Mentionnez les délais de réalisation et conditions de livraison</li>
                  <li>• Demandez un acompte à la signature pour sécuriser le projet</li>
                  <li>• Relisez les montants avant d'envoyer au client</li>
                  <li>• Conservez une copie signée de chaque devis accepté</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bouton Nouvelle devis */}
        {STEPS[currentStep]?.id === "preview" && (
          <div className="flex justify-center mt-6">
            <Button type="button" variant="outline" onClick={resetForm} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Nouveau devis
            </Button>
          </div>
        )}
      </div>

      {/* Dialog Historique */}
      <QuoteHistoryDialog
        isOpen={isQuoteHistoryOpen}
        onClose={() => setIsQuoteHistoryOpen(false)}
        symbol={symbol}
        quoteHistory={[
          {
            id: "1",
            quoteNumber:  "DEV-202603-0017",
            clientName:   "Samuel Bikoko",
            clientCompany:"Bikoko Génie Civil SARL",
            projectName:  "Construction Résidence Makepe",
            total:        2500000,
            statut:       "accepted",  // "draft" | "sent" | "accepted" | "rejected" | "expired"
            dateCreation: "12/03/2026",
            validUntil:   "11/04/2026",
            url:          "https://...",
          },
        ]}
        onPreviewQuote={(q)   => window.open(q.url, "_blank")}
        onDownloadQuote={(q)  => { /* download logic */ }}
        onDeleteQuote={(q)    => { /* delete logic  */ }}
        onDuplicateQuote={(q) => { /* duplicate logic */ }}
      />
    </div>
  );
};

export default QuotePage;