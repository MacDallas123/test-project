// CreditNotePage.jsx — Générateur d'avoirs (notes de crédit) par étapes
// Corrections v2 :
//   • Intégration Redux complète via creditNoteSlice
//   • Étape "Émetteur" avec logo (upload + prévisualisation)
//   • Champs émetteur enrichis : companyPort, companySiret, companyApe, companyTva
//   • Payload handleGenerateCreditNote transmet tous les champs company*
//   • useEffect de chargement (mode édition) restaure tous les champs
//   • Aperçu visuel en identité orange "avoir"

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
  Calendar, Package, Plus, Minus, Trash2,
  Send, Download, CheckCircle, AlertCircle,
  CreditCard, FileCheck, Edit2, Eye,
  Printer, Loader2, ChevronDown, ChevronUp, ChevronLeft,
  ChevronRight, Copy, RefreshCw, Info, BookOpen, Percent,
  RotateCcw,
} from "lucide-react";
import {
  selectCurrentCreditNote, selectCreditNoteLoading, selectCreditNoteError,
  selectGeneratedCreditPDF,
  createCreditNote, updateCreditNoteById, generateCreditNotePDF,
  sendCreditNoteByEmail, clearCreditNote, clearError, fetchCreditNoteById,
} from "@/redux/slices/creditNoteSlice";
import { useCurrency } from "@/context/CurrencyContext";
import { useAppMainContext } from "@/context/AppProvider";
import { useAuth } from "@/hooks/useAuth";

// ─────────────────────────────────────────────
// ÉTAPES DU WIZARD
// ─────────────────────────────────────────────
const STEPS = [
  { id: "identification", label: "Avoir",    icon: FileText  },
  { id: "emetteur",       label: "Émetteur", icon: Building2 },
  { id: "client",         label: "Client",   icon: User      },
  { id: "items",          label: "Articles", icon: Package   },
  { id: "notes",          label: "Notes",    icon: FileCheck },
  { id: "preview",        label: "Aperçu",   icon: Eye       },
];

// ─────────────────────────────────────────────
// OPTIONS
// ─────────────────────────────────────────────
const CREDIT_REASONS = [
  { value: "product_return",    label: "Retour de marchandise"   },
  { value: "defective_product", label: "Produit défectueux"       },
  { value: "billing_error",     label: "Erreur de facturation"    },
  { value: "discount",          label: "Remise commerciale"       },
  { value: "price_adjustment",  label: "Ajustement de prix"       },
  { value: "cancelled_order",   label: "Annulation de commande"   },
  { value: "goodwill",          label: "Geste commercial"         },
  { value: "other",             label: "Autre"                    },
];

const REFUND_METHODS = [
  { value: "bank_transfer",    label: "Virement Bancaire"             },
  { value: "original_payment", label: "Méthode de paiement d'origine" },
  { value: "store_credit",     label: "Avoir en magasin"              },
  { value: "cash",             label: "Espèces"                       },
  { value: "check",            label: "Chèque"                        },
];

// ─────────────────────────────────────────────
// NOTICE D'AIDE
// ─────────────────────────────────────────────
const HelpNotice = ({ tips, title = "Conseils", variant = "info" }) => {
  const [open, setOpen] = useState(false);
  const colors = {
    info:    { bg: "bg-orange-50 border-orange-200",  icon: "text-orange-500",  title: "text-orange-700"  },
    success: { bg: "bg-green-50 border-green-200",    icon: "text-green-500",   title: "text-green-700"   },
    warning: { bg: "bg-amber-50 border-amber-200",    icon: "text-amber-500",   title: "text-amber-700"   },
  };
  const c = colors[variant] || colors.info;
  return (
    <div className={`border rounded-lg ${c.bg} overflow-hidden`}>
      <button type="button" onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full p-3 text-sm font-medium ${c.title}`}>
        <div className="flex items-center gap-2">
          <Info className={`w-4 h-4 ${c.icon}`} />
          {title}
        </div>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="px-4 pb-3 space-y-1 overflow-hidden text-sm text-gray-700">
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
          Étape {currentStep + 1} / {steps.length} — <span className="text-orange-600">{steps[currentStep]?.label}</span>
        </span>
        <span className="font-semibold text-orange-600">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
      </div>
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const done   = i < currentStep;
          const active = i === currentStep;
          const Icon   = step.icon;
          return (
            <button key={step.id} type="button" onClick={() => onNavigate(i)} title={step.label}
              className={`flex flex-col items-center gap-1 transition-all ${
                active ? "text-orange-600" : done ? "text-orange-400" : "text-gray-300"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                active ? "border-orange-500 bg-orange-50" : done ? "border-orange-400 bg-orange-50" : "border-gray-200"}`}>
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
const CreditNotePage = () => {
  const navigate   = useNavigate();
  const { id }     = useParams();
  const creditRef  = useRef();
  const dispatch   = useDispatch();

  // Redux
  const currentCreditNote = useSelector(selectCurrentCreditNote);
  const loading           = useSelector(selectCreditNoteLoading);
  const error             = useSelector(selectCreditNoteError);

  // États locaux
  const [currentStep,    setCurrentStep]    = useState(0);
  const [isGenerating,   setIsGenerating]   = useState(false);
  const [isSending,      setIsSending]      = useState(false);
  const [creditStatus,   setCreditStatus]   = useState("DRAFT");
  const [logoPreview,    setLogoPreview]    = useState("");

  const { symbol } = useCurrency();

  const { setIsViewLocked } = useAppMainContext();
  const { isLoggedIn } = useAuth();


  useEffect(() => {
    if(!isLoggedIn()) setIsViewLocked(true);
  }, []);

  // ── Numéro d'avoir ──────────────────────────
  const generateCreditNoteNumber = () => {
    const d   = new Date();
    const yr  = d.getFullYear();
    const mo  = String(d.getMonth() + 1).padStart(2, "0");
    const rnd = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
    return `AV-${yr}${mo}-${rnd}`;
  };

  // ── Formulaire ──────────────────────────────
  const [formData, setFormData] = useState({
    // Identification avoir
    creditNoteNumber:      generateCreditNoteNumber(),
    bisNumber:             "",
    creditNoteDate:        new Date().toISOString().split("T")[0],
    originalInvoiceNumber: "",
    originalInvoiceDate:   "",
    creditReason:          "billing_error",
    refundMethod:          "bank_transfer",

    // Émetteur
    companyName:     "Sté SEN FIBEM France",
    companyAddress:  "51 Rue du Grevarin",
    companyCity:     "27200 Vernon",
    companyPostalCode: "",
    companyPhone:    "",
    companyPort:     "07.52.49.75.46",
    companyEmail:    "senfibem.paris@outlook.com",
    companySiret:    "445 374 937 00032",
    companyApe:      "4120B Travaux Bâtiment & Industrie",
    companyTva:      "FR17378128441",
    companyLogo:     "",  // File après upload

    // Client
    clientName:        "Amélie Martin",
    clientCompany:     "EURL AquaTech",
    clientEmail:       "amelie.martin@aquatech.fr",
    clientPhone:       "07 89 67 45 32",
    clientAddress:     "8 Avenue des Lumières",
    clientCity:        "Lyon",
    clientPostalCode:  "69008",
    clientTaxId:       "FR99887766554",

    // Notes
    notes:              "",
    termsAndConditions: "",
  });

  // ── Articles ────────────────────────────────
  const [creditItems, setCreditItems] = useState([
    {
      id: 1,
      description: "Régularisation facture",
      quantity: 1, unitPrice: 0, discount: 0, taxRate: 20, total: 0,
    },
  ]);

  // ── Chargement édition ──────────────────────
  useEffect(() => {
    if (id) dispatch(fetchCreditNoteById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (currentCreditNote) {
      setFormData({
        creditNoteNumber:      currentCreditNote.creditNoteNumber      || generateCreditNoteNumber(),
        bisNumber:             currentCreditNote.bisNumber             || "",
        creditNoteDate:        currentCreditNote.creditNoteDate        || new Date().toISOString().split("T")[0],
        originalInvoiceNumber: currentCreditNote.originalInvoiceNumber || "",
        originalInvoiceDate:   currentCreditNote.originalInvoiceDate   || "",
        creditReason:          currentCreditNote.creditReason          || "billing_error",
        refundMethod:          currentCreditNote.refundMethod          || "bank_transfer",
        companyName:           currentCreditNote.companyName           || "",
        companyAddress:        currentCreditNote.companyAddress        || "",
        companyCity:           currentCreditNote.companyCity           || "",
        companyPostalCode:     currentCreditNote.companyPostalCode     || "",
        companyPhone:          currentCreditNote.companyPhone          || "",
        companyPort:           currentCreditNote.companyPort           || "",
        companyEmail:          currentCreditNote.companyEmail          || "",
        companySiret:          currentCreditNote.companySiret          || "",
        companyApe:            currentCreditNote.companyApe            || "",
        companyTva:            currentCreditNote.companyTva            || "",
        companyLogo:           currentCreditNote.companyLogo           || "",
        clientName:            currentCreditNote.clientName            || "",
        clientCompany:         currentCreditNote.clientCompany         || "",
        clientEmail:           currentCreditNote.clientEmail           || "",
        clientPhone:           currentCreditNote.clientPhone           || "",
        clientAddress:         currentCreditNote.clientAddress         || "",
        clientCity:            currentCreditNote.clientCity            || "",
        clientPostalCode:      currentCreditNote.clientPostalCode      || "",
        clientTaxId:           currentCreditNote.clientTaxId           || "",
        notes:                 currentCreditNote.notes                 || "",
        termsAndConditions:    currentCreditNote.termsAndConditions    || "",
      });
      if (currentCreditNote.creditNoteItems) setCreditItems(currentCreditNote.creditNoteItems);
      if (currentCreditNote.creditNoteStatus) setCreditStatus(currentCreditNote.creditNoteStatus);
      if (currentCreditNote.companyLogo) {
        const logo = currentCreditNote.companyLogo;
        setLogoPreview(logo.startsWith("http") ? logo : `${window.location.origin}/${logo.replace(/^\/+/, "")}`);
      }
    }
  }, [currentCreditNote]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(t);
    }
  }, [error, dispatch]);

  // ── Handlers formulaire ─────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Handlers articles ───────────────────────
  const addItem = () => {
    const newId = Math.max(...creditItems.map(i => i.id), 0) + 1;
    setCreditItems([...creditItems, { id: newId, description: "", quantity: 1, unitPrice: 0, discount: 0, taxRate: 20, total: 0 }]);
  };

  const updateItem = (id, field, value) => {
    setCreditItems(creditItems.map(item => {
      if (item.id !== id) return item;
      const u     = { ...item, [field]: value };
      const qty   = parseFloat(field === "quantity"  ? value : u.quantity)  || 0;
      const price = parseFloat(field === "unitPrice" ? value : u.unitPrice) || 0;
      const disc  = parseFloat(field === "discount"  ? value : u.discount)  || 0;
      const base  = qty * price;
      u.total = base - base * (disc / 100);
      return u;
    }));
  };

  const removeItem    = (id) => { if (creditItems.length > 1) setCreditItems(creditItems.filter(i => i.id !== id)); };
  const duplicateItem = (id) => {
    const item  = creditItems.find(i => i.id === id);
    if (!item) return;
    const newId = Math.max(...creditItems.map(i => i.id), 0) + 1;
    setCreditItems([...creditItems, { ...item, id: newId }]);
  };
  const moveItem = (index, dir) => {
    const items    = [...creditItems];
    const newIndex = dir === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < items.length) {
      [items[index], items[newIndex]] = [items[newIndex], items[index]];
      setCreditItems(items);
    }
  };

  // ── Calculs ─────────────────────────────────
  const subtotalHT = creditItems.reduce((s, i) => s + i.total, 0);
  const totalTVA   = creditItems.reduce((s, i) => {
    const base = i.quantity * i.unitPrice * (1 - (i.discount || 0) / 100);
    return s + base * ((i.taxRate || 0) / 100);
  }, 0);
  const totalTTC = subtotalHT + totalTVA;

  // ── Validation ──────────────────────────────
  const isFormValid = () => true
    /* formData.creditNoteNumber?.trim() &&
    formData.companyName?.trim() &&
    creditItems.every(i => i.description?.trim() && i.unitPrice > 0); */

  const canGoNext = () => {
    switch (STEPS[currentStep].id) {
      case "identification": return formData.creditNoteNumber?.trim() !== "";
      case "emetteur":       return formData.companyName?.trim() !== "";
      case "client":         return true;
      case "items":          return creditItems.length > 0 && creditItems.every(i => i.description?.trim() && i.unitPrice > 0);
      case "notes":          return true;
      case "preview":        return true;
      default:               return true;
    }
  };

  // ── Navigation ──────────────────────────────
  const goNext = () => { if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1); };
  const goPrev = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };
  const goTo   = (i) => setCurrentStep(i);

  // ── Actions ─────────────────────────────────
  const handleGenerateCreditNote = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        ...formData,
        creditNoteItems: creditItems.map(({ id, ...i }) => i),
        creditNoteStatus: creditStatus,
        subtotalHT, totalTVA, totalTTC,
      };
      let creditNoteId;
      if (currentCreditNote?.id) {
        await dispatch(updateCreditNoteById({ id: currentCreditNote.id, data: payload })).unwrap();
        creditNoteId = currentCreditNote.id;
      } else {
        const res = await dispatch(createCreditNote(payload)).unwrap();
        creditNoteId = res.content.id;
      }
      if (!creditNoteId) throw new Error("ID de l'avoir introuvable");
      const genRes = await dispatch(generateCreditNotePDF({ id: creditNoteId, format: "pdf" })).unwrap();
      if (genRes.content?.url) window.open(genRes.content.url, "_blank");
      setCurrentStep(STEPS.length - 1);
    } catch (err) {
      console.error(err);
      alert(err.message || "Erreur lors de la génération de l'avoir");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (currentCreditNote?.id) {
      setIsGenerating(true);
      try {
        const res = await dispatch(generateCreditNotePDF({ id: currentCreditNote.id, format: "pdf" })).unwrap();
        if (res.content?.url) {
          const a = document.createElement("a");
          a.href = res.content.url;
          a.download = `Avoir_${formData.creditNoteNumber}.pdf`;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
        }
      } finally { setIsGenerating(false); }
    } else { await handleGenerateCreditNote(); }
  };

  const handleSendEmail = async () => {
    if (!currentCreditNote?.id) { alert("Veuillez d'abord générer l'avoir"); return; }
    if (!formData.clientEmail)  { alert("Veuillez renseigner l'email du client"); return; }
    setIsSending(true);
    try {
      await dispatch(sendCreditNoteByEmail({
        id: currentCreditNote.id,
        email: formData.clientEmail,
        message: `Veuillez trouver ci-joint l'avoir ${formData.creditNoteNumber}`,
      })).unwrap();
      alert("Avoir envoyé avec succès");
      setCreditStatus("issued");
    } catch { alert("Erreur lors de l'envoi de l'avoir"); }
    finally { setIsSending(false); }
  };

  const handlePrint = useReactToPrint({
    content: () => creditRef.current,
    documentTitle: `Avoir_${formData.creditNoteNumber}`,
  });

  const resetForm = () => {
    dispatch(clearCreditNote());
    setFormData(prev => ({
      ...prev,
      creditNoteNumber: generateCreditNoteNumber(),
      creditNoteDate: new Date().toISOString().split("T")[0],
      originalInvoiceNumber: "", originalInvoiceDate: "",
      creditReason: "billing_error", refundMethod: "bank_transfer",
      clientName: "", clientCompany: "", clientEmail: "", clientPhone: "",
      clientAddress: "", clientCity: "", clientPostalCode: "", clientTaxId: "",
      notes: "", termsAndConditions: "",
      // Les champs émetteur sont conservés
    }));
    setCreditItems([{ id: 1, description: "Régularisation facture", quantity: 1, unitPrice: 0, discount: 0, taxRate: 20, total: 0 }]);
    setCreditStatus("draft");
    setCurrentStep(0);
  };

  // ── Badge statut ────────────────────────────
  const getStatusBadge = () => {
    const cfg = {
      DRAFT:     { label: "Brouillon", className: "bg-gray-100 text-gray-700"         },
      ISSUED:    { label: "Émis",      className: "bg-orange-100 text-orange-700"      },
      PROCESSED: { label: "Traité",    className: "bg-emerald-100 text-emerald-700"    },
      CANCELLED: { label: "Annulé",    className: "bg-red-100 text-red-700"            },
    };
    const c = cfg[creditStatus] || cfg.DRAFT;
    return <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.className}`}>{c.label}</span>;
  };

  // ════════════════════════════════════════════
  // RENDU DES ÉTAPES
  // ════════════════════════════════════════════
  const renderStep = () => {
    switch (STEPS[currentStep].id) {

      // ── Étape 1 : Identification de l'avoir ──
      case "identification":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Identification de l'avoir</h2>
              <p className="mt-1 text-sm text-gray-500">Numéro, date, facture d'origine, raison et méthode de remboursement.</p>
            </div>
            <HelpNotice variant="info" title="À savoir" tips={[
              "Le numéro d'avoir est obligatoire et doit être unique.",
              "Indiquez toujours la facture d'origine à laquelle se rapporte l'avoir.",
              "La raison et la méthode de remboursement apparaîtront sur le document PDF.",
            ]} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* <div className="space-y-2">
                <Label htmlFor="creditNoteNumber">N° de l'avoir *</Label>
                <Input id="creditNoteNumber" name="creditNoteNumber" value={formData.creditNoteNumber}
                  onChange={handleInputChange} placeholder="AV-202603-0001" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bisNumber">Indice / BIS</Label>
                <Input id="bisNumber" name="bisNumber" value={formData.bisNumber}
                  onChange={handleInputChange} placeholder="Bis1" />
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="creditNoteDate">Date de l'avoir *</Label>
                <Input id="creditNoteDate" name="creditNoteDate" type="date" value={formData.creditNoteDate}
                  onChange={handleInputChange} required />
              </div>

              {/* Facture d'origine */}
              <div className="space-y-2">
                <Label htmlFor="originalInvoiceNumber">N° Facture d'origine</Label>
                <div className="relative">
                  <Input id="originalInvoiceNumber" name="originalInvoiceNumber" value={formData.originalInvoiceNumber}
                    onChange={handleInputChange} placeholder="FA-202601-0042" />
                  <RotateCcw className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalInvoiceDate">Date de la facture d'origine</Label>
                <Input id="originalInvoiceDate" name="originalInvoiceDate" type="date" value={formData.originalInvoiceDate}
                  onChange={handleInputChange} />
              </div>

              {/* Raison */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="creditReason">Raison de l'avoir</Label>
                <select id="creditReason" name="creditReason" value={formData.creditReason} onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border rounded-md">
                  {CREDIT_REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              {/* Méthode remboursement */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="refundMethod">Méthode de remboursement</Label>
                <select id="refundMethod" name="refundMethod" value={formData.refundMethod} onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border rounded-md">
                  {REFUND_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>

              {/* Statut */}
              {/* <div className="space-y-2 md:col-span-2">
                <Label>Statut de l'avoir</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "draft",     label: "Brouillon", cls: "border-gray-300 text-gray-700"     },
                    { value: "issued",    label: "Émis",      cls: "border-orange-400 text-orange-700"  },
                    { value: "processed", label: "Traité",    cls: "border-emerald-500 text-emerald-700"},
                    { value: "cancelled", label: "Annulé",    cls: "border-red-400 text-red-700"        },
                  ].map(s => (
                    <button key={s.value} type="button"
                      onClick={() => setCreditStatus(s.value)}
                      className={`px-3 py-1.5 text-sm border rounded-lg transition-all ${
                        creditStatus === s.value
                          ? s.cls + " bg-orange-50 font-semibold"
                          : "border-gray-200 text-gray-500 hover:border-orange-300"
                      }`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        );

      // ── Étape 2 : Émetteur ────────────────────
      case "emetteur":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Votre entreprise (émetteur)</h2>
              <p className="mt-1 text-sm text-gray-500">Ces informations apparaîtront dans le bloc prestataire de l'avoir.</p>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "Le nom de l'entreprise est obligatoire.",
              "Le logo sera affiché en haut à gauche du PDF.",
              "SIRET, APE et N° TVA apparaissent dans le bloc émetteur.",
            ]} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                <Input id="companyName" name="companyName" value={formData.companyName}
                  onChange={handleInputChange} placeholder="Sté SEN FIBEM France" required />
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

              {/* Upload logo — même logique que InvoicePage */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyLogo">Logo de l'entreprise</Label>
                <Input id="companyLogo" name="companyLogo" type="file" accept="image/*"
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
                    <img src={logoPreview} alt="Aperçu logo" className="border rounded max-h-16"
                      style={{ objectFit: "contain", background: "#f9f9f9", padding: 2 }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      // ── Étape 3 : Client ──────────────────────
      case "client":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Informations du client</h2>
              <p className="mt-1 text-sm text-gray-500">Destinataire de l'avoir.</p>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "Renseignez l'email pour envoyer l'avoir directement depuis l'application.",
              "Le N° TVA client apparaît dans la colonne CEE du tableau de synthèse.",
            ]} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nom du client</Label>
                <div className="relative">
                  <Input id="clientName" name="clientName" value={formData.clientName}
                    onChange={handleInputChange} placeholder="Jean Dupont" />
                  <User className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCompany">Entreprise du client</Label>
                <div className="relative">
                  <Input id="clientCompany" name="clientCompany" value={formData.clientCompany}
                    onChange={handleInputChange} placeholder="Client SA" />
                  <Building2 className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email</Label>
                <div className="relative">
                  <Input id="clientEmail" name="clientEmail" type="email" value={formData.clientEmail}
                    onChange={handleInputChange} placeholder="client@email.com" />
                  <Mail className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Téléphone</Label>
                <div className="relative">
                  <Input id="clientPhone" name="clientPhone" value={formData.clientPhone}
                    onChange={handleInputChange} placeholder="+237 6XX XX XX XX" />
                  <Phone className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientAddress">Adresse</Label>
                <div className="relative">
                  <Input id="clientAddress" name="clientAddress" value={formData.clientAddress}
                    onChange={handleInputChange} placeholder="456 Boulevard Principal" />
                  <MapPin className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCity">Ville</Label>
                <Input id="clientCity" name="clientCity" value={formData.clientCity}
                  onChange={handleInputChange} placeholder="Yaoundé" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPostalCode">Code postal / BP</Label>
                <Input id="clientPostalCode" name="clientPostalCode" value={formData.clientPostalCode}
                  onChange={handleInputChange} placeholder="BP 456" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientTaxId">N° TVA / Identification fiscale</Label>
                <Input id="clientTaxId" name="clientTaxId" value={formData.clientTaxId}
                  onChange={handleInputChange} placeholder="FR12345678901" />
              </div>
            </div>
          </div>
        );

      // ── Étape 4 : Articles ────────────────────
      case "items":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Lignes de l'avoir</h2>
                <p className="mt-1 text-sm text-gray-500">Ajoutez les articles ou prestations à créditer.</p>
              </div>
              <Badge variant="outline" className="text-orange-700 border-orange-300">{creditItems.length} ligne(s)</Badge>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "Chaque ligne doit avoir une description et un prix unitaire > 0.",
              "Les montants représentent des crédits — ils s'afficheront en orange sur le PDF.",
              "La remise est en pourcentage (ex : 10 pour 10%).",
            ]} />
            <div className="space-y-4">
              {creditItems.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 space-y-3 border border-orange-100 rounded-xl bg-orange-50/30">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs text-orange-700 border-orange-300">Ligne {index + 1}</Badge>
                    <div className="flex items-center gap-1">
                      <Button type="button" onClick={() => moveItem(index, "up")} disabled={index === 0}
                        variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400">
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button type="button" onClick={() => moveItem(index, "down")} disabled={index === creditItems.length - 1}
                        variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button type="button" onClick={() => duplicateItem(item.id)} variant="ghost" size="sm"
                        className="w-8 h-8 p-0 text-blue-500 hover:bg-blue-50" title="Dupliquer">
                        <Copy className="w-4 h-4" />
                      </Button>
                      {creditItems.length > 1 && (
                        <Button type="button" onClick={() => removeItem(item.id)} variant="ghost" size="sm"
                          className="w-8 h-8 p-0 text-red-500 hover:bg-red-50" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Input value={item.description} onChange={e => updateItem(item.id, "description", e.target.value)}
                      placeholder="Ex : Retour article / Régularisation" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Quantité</Label>
                      <div className="flex items-center gap-1">
                        <Button type="button" variant="outline" size="sm" className="flex-shrink-0 w-8 h-8 p-0"
                          onClick={() => updateItem(item.id, "quantity", Math.max(1, item.quantity - 1))}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input type="number" value={item.quantity} min="1" step="0.01" className="px-1 text-center"
                          onChange={e => updateItem(item.id, "quantity", Math.max(1, parseFloat(e.target.value) || 1))} />
                        <Button type="button" variant="outline" size="sm" className="flex-shrink-0 w-8 h-8 p-0"
                          onClick={() => updateItem(item.id, "quantity", item.quantity + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Prix U. ({symbol})</Label>
                      <Input type="number" value={item.unitPrice} min="0" step="100"
                        onChange={e => updateItem(item.id, "unitPrice", Math.max(0, parseFloat(e.target.value) || 0))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Remise %</Label>
                      <div className="relative">
                        <Input type="number" value={item.discount} min="0" max="100" step="1"
                          onChange={e => updateItem(item.id, "discount", Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))} />
                        <Percent className="absolute w-3 h-3 text-gray-400 -translate-y-1/2 pointer-events-none right-2 top-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>TVA %</Label>
                      <div className="relative">
                        <Input type="number" value={item.taxRate} min="0" step="0.01"
                          onChange={e => updateItem(item.id, "taxRate", Math.max(0, parseFloat(e.target.value) || 0))} />
                        <Percent className="absolute w-3 h-3 text-gray-400 -translate-y-1/2 pointer-events-none right-2 top-1/2" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-orange-100 text-orange-700">
                      Total HT : {item.total.toLocaleString()} {symbol}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button type="button" onClick={addItem} variant="outline"
              className="w-full gap-2 text-orange-700 border-orange-300 hover:bg-orange-50">
              <Plus className="w-4 h-4" /> Ajouter une ligne
            </Button>

            {/* Mini récap */}
            <div className="p-4 space-y-2 border border-orange-200 rounded-xl bg-orange-50/50">
              <h4 className="text-sm font-semibold text-orange-700">Récapitulatif</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total HT</span>
                <span className="font-medium text-orange-700">{subtotalHT.toLocaleString()} {symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">TVA estimée</span>
                <span className="font-medium">{totalTVA.toLocaleString()} {symbol}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-bold">
                <span>Net à rembourser TTC</span>
                <span className="text-orange-600">{totalTTC.toLocaleString()} {symbol}</span>
              </div>
            </div>
          </div>
        );

      // ── Étape 5 : Notes ───────────────────────
      case "notes":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Notes et références</h2>
              <p className="mt-1 text-sm text-gray-500">Informations complémentaires qui apparaîtront sur l'avoir.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Références / Notes</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={3}
                  placeholder="Référence du dossier, motif détaillé, numéro de retour..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Conditions générales</Label>
                <Textarea id="termsAndConditions" name="termsAndConditions" value={formData.termsAndConditions}
                  onChange={handleInputChange} rows={4}
                  placeholder="Conditions de remboursement, délais de traitement..." />
              </div>
            </div>
          </div>
        );

      // ── Étape 6 : Aperçu ──────────────────────
      case "preview": {
        const reasonLabel = CREDIT_REASONS.find(r => r.value === formData.creditReason)?.label || formData.creditReason;
        const refundLabel = REFUND_METHODS.find(m => m.value === formData.refundMethod)?.label  || formData.refundMethod;
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Aperçu de l'avoir</h2>
                <p className="mt-1 text-sm text-gray-500">Vérifiez avant de générer le PDF.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setCurrentStep(0)} className="gap-2">
                  <Edit2 className="w-4 h-4" /> Modifier
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                  <Printer className="w-4 h-4" /> Imprimer
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleSendEmail}
                  disabled={isSending || !formData.clientEmail} className="gap-2">
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Envoyer
                </Button>
                <Button type="button" size="sm" onClick={handleDownloadPDF} disabled={isGenerating}
                  className="gap-2 text-white bg-orange-600 hover:bg-orange-700">
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Télécharger PDF
                </Button>
              </div>
            </div>

            {/* ── Résumé structuré ── */}
            <div ref={creditRef} className="space-y-4">

              {/* En-tête */}
              <div className="flex items-start justify-between p-4 border border-orange-200 rounded-xl bg-orange-50/30">
                <div>
                  {logoPreview
                    ? <img src={logoPreview} alt="Logo" className="mb-2 max-h-12" style={{ objectFit: "contain" }} />
                    : <p className="text-lg font-bold text-orange-800">{formData.companyName}</p>
                  }
                  <p className="text-xs text-gray-500">{formData.companyAddress} — {formData.companyCity}</p>
                  {formData.companyEmail && <p className="text-xs text-gray-500">{formData.companyEmail}</p>}
                  {formData.companySiret && <p className="text-xs text-gray-500">SIRET : {formData.companySiret}</p>}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-700">AVOIR</p>
                  <p className="font-mono text-sm text-gray-600">
                    N° {formData.creditNoteNumber}{formData.bisNumber ? ` ${formData.bisNumber}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(formData.creditNoteDate).toLocaleDateString("fr-FR")}
                  </p>
                  {formData.originalInvoiceNumber && (
                    <p className="text-xs text-gray-400 mt-0.5">Réf. facture : {formData.originalInvoiceNumber}</p>
                  )}
                  <div className="mt-1">{getStatusBadge()}</div>
                </div>
              </div>

              {/* Raison + méthode */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 text-sm border border-orange-100 rounded-lg bg-orange-50/30">
                  <p className="mb-1 text-xs font-semibold text-gray-500 uppercase">Raison</p>
                  <p className="font-medium text-orange-700">{reasonLabel}</p>
                </div>
                <div className="p-3 text-sm border border-orange-100 rounded-lg bg-orange-50/30">
                  <p className="mb-1 text-xs font-semibold text-gray-500 uppercase">Remboursement</p>
                  <p className="font-medium text-orange-700">{refundLabel}</p>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg text-sm space-y-0.5">
                  <p className="mb-1 font-semibold text-gray-700">Émetteur</p>
                  <p className="font-bold">{formData.companyName}</p>
                  {formData.companyAddress  && <p className="text-gray-600">{formData.companyAddress}</p>}
                  {formData.companyCity     && <p className="text-gray-600">{formData.companyCity}</p>}
                  {formData.companyPort     && <p className="text-gray-600">Port : {formData.companyPort}</p>}
                  {formData.companySiret    && <p className="text-gray-600">SIRET : {formData.companySiret}</p>}
                </div>
                <div className="p-3 border rounded-lg text-sm space-y-0.5">
                  <p className="mb-1 font-semibold text-gray-700">Client</p>
                  <p className="font-bold">{formData.clientCompany || formData.clientName || "—"}</p>
                  {formData.clientName && formData.clientCompany && <p>{formData.clientName}</p>}
                  {formData.clientAddress   && <p className="text-gray-600">{formData.clientAddress}</p>}
                  {(formData.clientPostalCode || formData.clientCity) && (
                    <p className="text-gray-600">{formData.clientPostalCode} {formData.clientCity}</p>
                  )}
                  {formData.clientPhone  && <p className="text-gray-600">Tél : {formData.clientPhone}</p>}
                  {formData.clientEmail  && <p className="text-gray-600">{formData.clientEmail}</p>}
                </div>
              </div>

              {/* Tableau articles */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-orange-100">
                      <th className="p-2 text-left border border-orange-200">Description</th>
                      <th className="p-2 text-center border border-orange-200">Qté</th>
                      <th className="p-2 text-right border border-orange-200">Prix U. HT</th>
                      <th className="p-2 text-center border border-orange-200">Remise</th>
                      <th className="p-2 text-center border border-orange-200">TVA %</th>
                      <th className="p-2 text-right border border-orange-200">Montant HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditItems.map((item, i) => (
                      <tr key={i} className={i % 2 === 1 ? "bg-orange-50/30" : ""}>
                        <td className="p-2 border">{item.description || "—"}</td>
                        <td className="p-2 text-center border">{item.quantity}</td>
                        <td className="p-2 text-right border">{item.unitPrice.toLocaleString()} {symbol}</td>
                        <td className="p-2 text-center border">{item.discount > 0 ? `${item.discount}%` : "—"}</td>
                        <td className="p-2 text-center border">{item.taxRate}%</td>
                        <td className="p-2 font-semibold text-right text-orange-700 border">
                          {item.total.toLocaleString()} {symbol}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totaux */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total H.T.</span>
                    <span className="font-medium">{subtotalHT.toLocaleString()} {symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TVA estimée</span>
                    <span className="font-medium">{totalTVA.toLocaleString()} {symbol}</span>
                  </div>
                  <div className="flex justify-between pt-1 font-bold border-t-2 border-orange-500">
                    <span>Net à rembourser T.T.C.</span>
                    <span className="text-orange-600">{totalTTC.toLocaleString()} {symbol}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {formData.notes && (
                <div className="p-3 text-sm border border-orange-100 rounded-lg">
                  <p className="mb-1 font-semibold">Références :</p>
                  <p className="text-gray-600">{formData.notes}</p>
                </div>
              )}
            </div>
          </div>
        );
      }

      default: return null;
    }
  };

  // ════════════════════════════════════════════
  // RENDU PRINCIPAL
  // ════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-white">
        <div className="container px-4 py-10 mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-4 bg-orange-100 rounded-full w-14 h-14">
              <RotateCcw className="text-orange-600 w-7 h-7" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Générateur d'Avoirs</h1>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="font-mono text-sm text-gray-500">{formData.creditNoteNumber}</span>
              {getStatusBadge()}
            </div>
            <p className="mt-1 text-sm text-gray-500">Créez un avoir professionnel lié à une facture existante</p>
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
          <Button type="button" variant="outline" onClick={goPrev} disabled={currentStep === 0} className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Précédent
          </Button>
          <div className="hidden text-xs text-muted-foreground sm:block">
            {currentStep + 1} / {STEPS.length}
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={handleGenerateCreditNote} disabled={isGenerating || !isFormValid()}
              className="gap-2 text-white bg-orange-600 hover:bg-orange-700">
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Génération…</>
                : <><Download className="w-4 h-4" /> Générer l'avoir</>}
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
          <motion.div key={currentStep}
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-white border rounded-2xl shadow-sm p-6 md:p-8 min-h-[400px] mb-4">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 mt-8 border border-orange-100 rounded-xl bg-orange-50/30">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="mb-2 text-sm font-semibold">Bonnes pratiques pour les avoirs</h4>
                <ul className="grid grid-cols-1 gap-1 text-xs text-muted-foreground md:grid-cols-2">
                  <li>• Référencez toujours la facture d'origine pour assurer la traçabilité</li>
                  <li>• Un avoir doit être émis dès que le remboursement est acté</li>
                  <li>• Conservez une copie signée dans votre dossier client</li>
                  <li>• Vérifiez que le montant de l'avoir correspond à la facture originale</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bouton Nouvel avoir */}
        {STEPS[currentStep]?.id === "preview" && (
          <div className="flex justify-center mt-6">
            <Button type="button" variant="outline" onClick={resetForm} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Nouvel avoir
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditNotePage;