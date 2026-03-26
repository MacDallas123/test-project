// QuotePage.jsx — Générateur de devis par étapes
// Corrections v2 :
//   • Ajout étape "Émetteur" (companyName, companyLogo, companySiret, companyApe, companyTva, companyPort…)
//   • formData initial inclut tous les champs société + logoPreview
//   • Articles enrichis : tpsMO, unite, taxRate par ligne (fidèle aux colonnes du template)
//   • payload handleGenerateQuote transmet tous les champs company* au backend
//   • useEffect de chargement (mode édition) restaure tous les nouveaux champs
//   • Étape preview restaurée (rendu propre du résumé)

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
  Percent, Image,
} from "lucide-react";
import {
  selectCurrentQuote, selectQuoteLoading, selectQuoteError,
  selectGeneratedQuotePDF, createQuote, updateQuoteById,
  generateQuotePDF, sendQuoteByEmail, clearQuote, clearError,
  fetchQuoteById,
} from "@/redux/slices/quoteSlice";
import { useCurrency } from "@/context/CurrencyContext";
import QuoteHistoryDialog from "@/components/dialog/QuoteHistoryDialog";
import { useAppMainContext } from "@/context/AppProvider";
import { useAuth } from "@/hooks/useAuth";

// ─────────────────────────────────────────────
// ÉTAPES DU WIZARD  — "emetteur" ajouté
// ─────────────────────────────────────────────
const STEPS = [
  { id: "client",   label: "Client",   icon: User       },
  { id: "emetteur", label: "Émetteur", icon: Building2  },
  { id: "project",  label: "Projet",   icon: Briefcase  },
  { id: "items",    label: "Articles", icon: Package    },
  { id: "payment",  label: "Paiement", icon: CreditCard },
  { id: "notes",    label: "Notes",    icon: FileCheck  },
  { id: "preview",  label: "Aperçu",  icon: Eye        },
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
              className={`flex flex-col items-center gap-1 transition-all ${
                active ? "text-emerald-600" : done ? "text-emerald-400" : "text-gray-300"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                active ? "border-emerald-500 bg-emerald-50" : done ? "border-emerald-400 bg-emerald-50" : "border-gray-200"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="hidden text-xs sm:block">{step.label}</span>
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
  const [quoteStatus,         setQuoteStatus]        = useState("DRAFT");
  const [logoPreview,         setLogoPreview]        = useState("");  // ← NOUVEAU

  const { symbol } = useCurrency();

  const { setIsViewLocked } = useAppMainContext();
  const { isLoggedIn } = useAuth();


  useEffect(() => {
    if(!isLoggedIn()) setIsViewLocked(true);
  }, []);
  
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
    // Identité devis
    quoteNumber:        generateQuoteNumber(),
    bisNumber:          "",

    // Client
    firstName:          "Samuel",
    lastName:           "Bikoko",
    company:            "Bikoko Génie Civil SARL",
    email:              "s.bikoko@bgc-cm.com",
    phone:              "+237 6 71 23 45 67",
    address:            "123 Rue Paul Biya",
    city:               "Douala",
    postalCode:         "CM-237",

    // Type
    quoteType:          "1",

    // ── Champs société / émetteur ── (NOUVEAUX — identiques à la facture)
    companyName:        "Sté SEN FIBEM France",
    companyContact:     "Mr GOMIS",
    companyAddress:     "51 Rue du Grevarin",
    companyCity:        "27200 Vernon",
    companyPhone:       "",
    companyPort:        "07.52.49.75.46",
    companyEmail:       "senfibem.paris@outlook.com",
    companySiret:       "445 374 937 00032",
    companyApe:         "4120B Travaux Bâtiment & Industrie",
    companyTva:         "FR17378128441",
    companyLogo:        "",   // chemin serveur après upload (ex: "uploads/logos/fibem.png")
    contactBE:          "",   // Référence interne Contact B.E.

    // Projet
    projectName:        "Construction Résidence Makepe",
    projectDescription: "Projet de construction d'une résidence moderne à Makepe, Douala.",
    startDate:          new Date().toISOString().split("T")[0],
    deadline:           "",
    budget:             "9500000",
    category:           "construction",

    // Conditions financières
    taxRate:            19.25,
    discountRate:       0,
    deposit:            0,
    depositType:        "percentage",
    validUntil:         (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split("T")[0]; })(),

    // Notes
    additionalNotes:    "- 30 % à verser 1 semaine après le démarrage du Technicien\n- 70 % à la fin du 1er mois",
    termsAndConditions: "Ce devis est valable 30 jours. Le paiement est exigible selon les conditions ci-dessus.",

    // Paiement
    paymentMethod:      "",
  });

  // ── Articles enrichis : + tpsMO, unite, taxRate ─
  const [quoteItems, setQuoteItems] = useState([
    {
      id: 1,
      description: "Fourniture et pose de fondations en béton armé",
      quantity: 10,   unitPrice: 75000, discount: 0,
      taxRate: 19.25, total: 750000,
      tpsMO: "1,0h",  unite: "Ens",
    },
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

  const unites = ["Ens", "h", "j", "m²", "m³", "ml", "u", "kg", "t", "forfait"];

  // ── Chargement édition ──────────────────────
  useEffect(() => {
    if (id) dispatch(fetchQuoteById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (currentQuote) {
      setFormData({
        quoteNumber:        currentQuote.quoteNumber        || generateQuoteNumber(),
        bisNumber:          currentQuote.bisNumber          || "",
        firstName:          currentQuote.firstName          || "",
        lastName:           currentQuote.lastName           || "",
        company:            currentQuote.company            || "",
        email:              currentQuote.email              || "",
        phone:              currentQuote.phone              || "",
        address:            currentQuote.address            || "",
        city:               currentQuote.city               || "",
        postalCode:         currentQuote.postalCode         || "",
        quoteType:          currentQuote.quoteType          || "",
        // Société
        companyName:        currentQuote.companyName        || "",
        companyContact:     currentQuote.companyContact     || "",
        companyAddress:     currentQuote.companyAddress     || "",
        companyCity:        currentQuote.companyCity        || "",
        companyPhone:       currentQuote.companyPhone       || "",
        companyPort:        currentQuote.companyPort        || "",
        companyEmail:       currentQuote.companyEmail       || "",
        companySiret:       currentQuote.companySiret       || "",
        companyApe:         currentQuote.companyApe         || "",
        companyTva:         currentQuote.companyTva         || "",
        companyLogo:        currentQuote.companyLogo        || "",
        contactBE:          currentQuote.contactBE          || "",
        // Projet
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
        paymentMethod:      currentQuote.paymentMethod      || "",
      });
      if (currentQuote.quoteItems)  setQuoteItems(currentQuote.quoteItems);
      if (currentQuote.quoteStatus) setQuoteStatus(currentQuote.quoteStatus);
      if (currentQuote.companyLogo) setLogoPreview(
        currentQuote.companyLogo.startsWith("http")
          ? currentQuote.companyLogo
          : `${window.location.origin}/${currentQuote.companyLogo.replace(/^\/+/, "")}`
      );
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
    setQuoteItems([...quoteItems, {
      id: newId, description: "", quantity: 1, unitPrice: 0,
      discount: 0, taxRate: 19.25, total: 0, tpsMO: "1,0h", unite: "Ens",
    }]);
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
    const ok = ["firstName", "lastName", "email", "phone", "projectName", "companyName"]
      .every(f => formData[f]?.toString().trim() !== "");
    const itemsOk = quoteItems.every(i => i.description?.trim() && i.unitPrice > 0);
    return ok && itemsOk;
  };

  const canGoNext = () => {
    switch (STEPS[currentStep].id) {
      case "client":   return formData.firstName && formData.lastName && formData.email && formData.phone;
      case "emetteur": return formData.companyName?.trim() !== "";
      case "project":  return formData.projectName?.trim() !== "";
      case "items":    return quoteItems.length > 0 && quoteItems.every(i => i.description?.trim() && i.unitPrice > 0);
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
  const handleGenerateQuote = async () => {
    setIsGenerating(true);
    try {
      // Payload complet — tous les champs company* sont inclus
      const payload = {
        ...formData,
        quoteItems: quoteItems.map(({ id, ...i }) => i),
        quoteStatus,
        subtotal, taxAmount, discountAmount, total, depositAmount, remainingAmount,
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
      await dispatch(sendQuoteByEmail({
        id: currentQuote.id, email: formData.email,
        message: `Veuillez trouver ci-joint le devis ${formData.quoteNumber}`,
      })).unwrap();
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
    setFormData(prev => ({
      ...prev,
      quoteNumber: generateQuoteNumber(), firstName: "", lastName: "", company: "",
      email: "", phone: "", address: "", city: "", postalCode: "", quoteType: "",
      projectName: "", projectDescription: "",
      startDate: new Date().toISOString().split("T")[0],
      deadline: "", budget: "", category: "", taxRate: 19.25, discountRate: 0,
      deposit: 0, depositType: "percentage",
      validUntil: (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split("T")[0]; })(),
      additionalNotes: "", termsAndConditions: "",
      // Note : on conserve les champs société pour ne pas avoir à les ressaisir
    }));
    setQuoteItems([{ id: 1, description: "", quantity: 1, unitPrice: 0, discount: 0, taxRate: 19.25, total: 0, tpsMO: "1,0h", unite: "Ens" }]);
    setQuoteStatus("DRAFT");
    setCurrentStep(0);
  };

  // ── Badge statut ────────────────────────────
  const getStatusBadge = () => {
    const cfg = {
      DRAFT:    { label: "Brouillon", className: "bg-gray-100 text-gray-700"       },
      SENT:     { label: "Envoyé",    className: "bg-blue-100 text-blue-700"       },
      ACCEPTED: { label: "Accepté",   className: "bg-emerald-100 text-emerald-700" },
      REJECTED: { label: "Refusé",    className: "bg-red-100 text-red-700"         },
      EXPIRED:  { label: "Expiré",    className: "bg-orange-100 text-orange-700"   },
    };
    const c = cfg[quoteStatus] || cfg.DRAFT;
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
                <Label htmlFor="company">Entreprise cliente</Label>
                <div className="relative">
                  <Input id="company" name="company" value={formData.company} onChange={handleInputChange} placeholder="Nom de l'entreprise cliente" />
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

      // ── Étape 2 : Émetteur (NOUVEAU) ─────────
      case "emetteur":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Votre entreprise (émetteur)</h2>
              <p className="mt-1 text-sm text-gray-500">Ces informations apparaîtront dans le bloc prestataire du devis.</p>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "Le nom de l'entreprise est obligatoire.",
              "Le logo sera affiché en haut à gauche du devis PDF.",
              "SIRET, APE et N° TVA apparaissent dans le bloc prestataire, fidèle au PDF FIBEM.",
              "Port = numéro de portable (champ séparé du téléphone fixe).",
            ]} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                <Input id="companyName" name="companyName" value={formData.companyName}
                  onChange={handleInputChange} placeholder="Sté SEN FIBEM France" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyContact">Contact / Interlocuteur</Label>
                <Input id="companyContact" name="companyContact" value={formData.companyContact}
                  onChange={handleInputChange} placeholder="Mr GOMIS" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyAddress">Adresse</Label>
                <Input id="companyAddress" name="companyAddress" value={formData.companyAddress}
                  onChange={handleInputChange} placeholder="51 Rue du Grevarin" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyCity">Ville (avec code postal)</Label>
                <Input id="companyCity" name="companyCity" value={formData.companyCity}
                  onChange={handleInputChange} placeholder="27200 Vernon" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Téléphone fixe</Label>
                <div className="relative">
                  <Input id="companyPhone" name="companyPhone" value={formData.companyPhone}
                    onChange={handleInputChange} placeholder="+33 1 XX XX XX XX" />
                  <Phone className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPort">Portable</Label>
                <div className="relative">
                  <Input id="companyPort" name="companyPort" value={formData.companyPort}
                    onChange={handleInputChange} placeholder="07.52.49.75.46" />
                  <Phone className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyEmail">Email</Label>
                <div className="relative">
                  <Input id="companyEmail" name="companyEmail" type="email" value={formData.companyEmail}
                    onChange={handleInputChange} placeholder="contact@votreentreprise.com" />
                  <Mail className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySiret">SIRET</Label>
                <Input id="companySiret" name="companySiret" value={formData.companySiret}
                  onChange={handleInputChange} placeholder="445 374 937 00032" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyApe">Code APE</Label>
                <Input id="companyApe" name="companyApe" value={formData.companyApe}
                  onChange={handleInputChange} placeholder="4120B Travaux Bâtiment & Industrie" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyTva">N° TVA intracommunautaire</Label>
                <Input id="companyTva" name="companyTva" value={formData.companyTva}
                  onChange={handleInputChange} placeholder="FR17378128441" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactBE">Contact B.E. (référence interne)</Label>
                <Input id="contactBE" name="contactBE" value={formData.contactBE}
                  onChange={handleInputChange} placeholder="Réf. bureau d'études" />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="bisNumber">Indice / BIS</Label>
                <Input id="bisNumber" name="bisNumber" value={formData.bisNumber}
                  onChange={handleInputChange} placeholder="Bis2" />
              </div> */}

              {/* ── Upload logo — identique à InvoicePage ── */}
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
                      const reader = new FileReader();
                      reader.onload = (ev) => {
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
                {logoPreview && (
                  <div className="mt-2">
                    <img
                      src={logoPreview}
                      alt="Aperçu logo"
                      className="border rounded max-h-16"
                      style={{ objectFit: "contain", background: "#f9f9f9", padding: 2 }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      // ── Étape 3 : Projet ─────────────────────
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

      // ── Étape 4 : Articles ─────────────────── (enrichi : tpsMO, unite, taxRate)
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
              "Temps M.O. : durée main d'œuvre (ex: 1,0h). Unité : Ens, h, m², etc.",
              "La remise par ligne est en pourcentage.",
              "Utilisez les flèches ↑↓ pour réordonner les articles.",
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

                  {/* Description */}
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Input value={item.description} onChange={e => updateQuoteItem(item.id, "description", e.target.value)}
                      placeholder="Ex : Fourniture et pose de carrelage" />
                  </div>

                  {/* Ligne 1 : Temps MO + Unité + Qté + Prix U */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Temps M.O.</Label>
                      <Input value={item.tpsMO} placeholder="1,0h"
                        onChange={e => updateQuoteItem(item.id, "tpsMO", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Unité</Label>
                      <select value={item.unite} onChange={e => updateQuoteItem(item.id, "unite", e.target.value)}
                        className="w-full h-10 px-3 py-2 text-sm border rounded-md">
                        {unites.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
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
                  </div>

                  {/* Ligne 2 : Remise + TVA + Total */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Remise %</Label>
                      <div className="relative">
                        <Input type="number" value={item.discount} min="0" max="100" step="1"
                          onChange={e => updateQuoteItem(item.id, "discount", Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))} />
                        <Percent className="absolute w-3 h-3 text-gray-400 -translate-y-1/2 pointer-events-none right-2 top-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>TVA %</Label>
                      <div className="relative">
                        <Input type="number" value={item.taxRate} min="0" step="0.01"
                          onChange={e => updateQuoteItem(item.id, "taxRate", Math.max(0, parseFloat(e.target.value) || 0))} />
                        <Percent className="absolute w-3 h-3 text-gray-400 -translate-y-1/2 pointer-events-none right-2 top-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Total HT</Label>
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
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total HT</span>
                <span>{subtotal.toLocaleString()} {symbol}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-bold">
                <span>Total avant remise globale</span>
                <span className="text-emerald-600">{subtotal.toLocaleString()} {symbol}</span>
              </div>
            </div>
          </div>
        );

      // ── Étape 5 : Paiement ───────────────────
      case "payment":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Paramètres de paiement</h2>
              <p className="mt-1 text-sm text-gray-500">Configurez la TVA globale, la remise et l'acompte.</p>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "La TVA au Cameroun est de 19,25% (taux officiel). En France : 20%.",
              "La remise globale s'applique sur le sous-total de tous les articles.",
              "L'acompte peut être un montant fixe ou un pourcentage du total TTC.",
            ]} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taxRate">TVA globale (%)</Label>
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total HT</span>
                    <span className="font-medium">{subtotal.toLocaleString()} {symbol}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remise ({formData.discountRate}%)</span>
                      <span className="font-medium text-green-600">-{discountAmount.toLocaleString()} {symbol}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total HT</span>
                    <span className="font-medium">{subtotalAfterDiscount.toLocaleString()} {symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TVA ({formData.taxRate}%)</span>
                    <span className="font-medium">{taxAmount.toLocaleString()} {symbol}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-emerald-600">
                    <span>Total TTC</span>
                    <span>{total.toLocaleString()} {symbol}</span>
                  </div>
                  {depositAmount > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Acompte</span>
                        <span>{depositAmount.toLocaleString()} {symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reste à payer</span>
                        <span>{remainingAmount.toLocaleString()} {symbol}</span>
                      </div>
                    </>
                  )}
                </div>
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
              <p className="mt-1 text-sm text-gray-500">Ces textes apparaîtront dans la section "Conditions de règlement" du devis.</p>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "Les notes additionnelles sont affichées dans 'Conditions de règlement'.",
              "Indiquez les conditions d'acompte (ex : 30% au démarrage, 70% à la fin).",
            ]} />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Conditions de règlement / Notes</Label>
                <Textarea id="additionalNotes" name="additionalNotes" value={formData.additionalNotes}
                  onChange={handleInputChange} rows={4}
                  placeholder="- 30 % à verser 1 semaine après le démarrage&#10;- 70 % à la fin du 1er mois" />
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

      // ── Étape 7 : Aperçu ─────────────────────
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
                <Button type="button" variant="outline" size="sm" onClick={handleSendEmail}
                  disabled={isSending || !formData.email} className="gap-2">
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

            {/* ── Résumé structuré ── */}
            <div ref={quoteRef} className="space-y-4">
              {/* En-tête */}
              <div className="flex items-start justify-between p-4 border rounded-xl bg-gray-50">
                <div>
                  {logoPreview
                    ? <img src={logoPreview} alt="Logo" className="mb-2 max-h-12" style={{ objectFit: "contain" }} />
                    : <p className="text-lg font-bold text-blue-800">{formData.companyName}</p>
                  }
                  <p className="text-xs text-gray-500">{formData.companyAddress} – {formData.companyCity}</p>
                  {formData.companyEmail && <p className="text-xs text-gray-500">{formData.companyEmail}</p>}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">Devis en EURO</p>
                  <p className="font-mono text-sm text-gray-600">
                    N° {formData.quoteNumber}{formData.bisNumber ? ` ${formData.bisNumber}` : ""}
                  </p>
                  {getStatusBadge()}
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg text-sm space-y-0.5">
                  <p className="mb-1 font-semibold text-gray-700">Prestataire</p>
                  <p className="font-bold">{formData.companyName}</p>
                  {formData.companyContact && <p>{formData.companyContact}</p>}
                  {formData.companyAddress && <p className="text-gray-600">{formData.companyAddress}</p>}
                  {formData.companyCity    && <p className="text-gray-600">{formData.companyCity}</p>}
                  {formData.companyPort    && <p className="text-gray-600">Port : {formData.companyPort}</p>}
                  {formData.companySiret   && <p className="text-gray-600">SIRET : {formData.companySiret}</p>}
                </div>
                <div className="p-3 border rounded-lg text-sm space-y-0.5">
                  <p className="mb-1 font-semibold text-gray-700">Client</p>
                  <p className="font-bold">{formData.company || fullName}</p>
                  {formData.company && fullName && <p>{fullName}</p>}
                  {formData.address    && <p className="text-gray-600">{formData.address}</p>}
                  {(formData.postalCode || formData.city) && <p className="text-gray-600">{formData.postalCode} {formData.city}</p>}
                  {formData.phone      && <p className="text-gray-600">Tél : {formData.phone}</p>}
                  {formData.email      && <p className="text-gray-600">{formData.email}</p>}
                </div>
              </div>

              {/* Projet */}
              {formData.projectName && (
                <div className="p-3 text-sm border rounded-lg bg-emerald-50/60">
                  <p className="font-semibold text-emerald-800">Projet : {formData.projectName}</p>
                  {formData.projectDescription && <p className="mt-1 text-gray-600">{formData.projectDescription}</p>}
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    {formData.startDate  && <span>Début : {new Date(formData.startDate).toLocaleDateString("fr-FR")}</span>}
                    {formData.validUntil && <span>Valable jusqu'au : {new Date(formData.validUntil).toLocaleDateString("fr-FR")}</span>}
                  </div>
                </div>
              )}

              {/* Tableau articles */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left border">Tps M.O.</th>
                      <th className="p-2 text-left border">Description</th>
                      <th className="p-2 text-center border">U</th>
                      <th className="p-2 text-right border">Prix U. HT</th>
                      <th className="p-2 text-center border">Qté</th>
                      <th className="p-2 text-right border">Montant HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteItems.map((item, i) => (
                      <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                        <td className="p-2 text-xs text-center border">{item.tpsMO}</td>
                        <td className="p-2 border">{item.description || "-"}</td>
                        <td className="p-2 text-xs text-center border">{item.unite}</td>
                        <td className="p-2 text-right border">{item.unitPrice.toLocaleString()} {symbol}</td>
                        <td className="p-2 text-center border">{item.quantity}</td>
                        <td className="p-2 font-medium text-right border">{item.total.toLocaleString()} {symbol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totaux */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant Total H.T.</span>
                    <span className="font-medium">{subtotalAfterDiscount.toLocaleString()} {symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TVA ({formData.taxRate}%)</span>
                    <span className="font-medium">{taxAmount.toLocaleString()} {symbol}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-bold border-t-2 border-emerald-500">
                    <span>Montant Total T.T.C.</span>
                    <span className="text-emerald-600">{total.toLocaleString()} {symbol}</span>
                  </div>
                </div>
              </div>

              {/* Conditions */}
              {formData.additionalNotes && (
                <div className="p-3 text-sm border rounded-lg">
                  <p className="mb-1 font-semibold">Conditions de règlement :</p>
                  {formData.additionalNotes.split("\n").map((l, i) => <p key={i}>{l}</p>)}
                </div>
              )}
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

        {/* Navigation haut */}
        <div className="flex flex-row items-center justify-between gap-3 mb-6">
          <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
            {/* <Button type="button" onClick={handleGenerateQuote} disabled={isGenerating || !isFormValid()} */}
            <Button type="button" onClick={handleGenerateQuote} disabled={isGenerating}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Génération…</>
                : <><Download className="w-4 h-4" /> Générer le devis</>}
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
            className="bg-white border rounded-2xl shadow-sm p-6 md:p-8 min-h-[400px] mb-4"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation bas */}
        <div className="flex flex-row items-center justify-between gap-3 mb-6">
          <Button type="button" variant="outline" onClick={goPrev} disabled={currentStep === 0} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Précédent
          </Button>
          <div className="hidden text-xs text-muted-foreground sm:block">
            {currentStep + 1} / {STEPS.length}
          </div>
          {currentStep < STEPS.length - 1 && (
            <Button type="button" variant="outline" onClick={goNext} disabled={!canGoNext()} className="gap-2">
              Suivant <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

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

        {/* Bouton Nouveau devis */}
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
            statut:       "accepted",
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