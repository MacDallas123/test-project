// CreditNotePage.jsx — Générateur d'avoirs par étapes
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  FileText, User, Mail, Phone, Building2, Calendar,
  Package, Plus, Trash2, Send, Download, CheckCircle,
  AlertCircle, FileCheck, Receipt, Hash, Edit2, Eye,
  Printer, Loader2, ChevronDown, ChevronUp, ChevronLeft,
  ChevronRight, Copy, RefreshCw, RotateCcw, AlertTriangle,
  FileX, Check, X, Shield, Info, BookOpen, Percent,
  DollarSign,
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import CreditNoteHistoryDialog from "@/components/dialog/CreditNoteHistoryDialog";

// ─────────────────────────────────────────────
// ÉTAPES DU WIZARD
// ─────────────────────────────────────────────
const STEPS = [
  { id: "avoir",   label: "Avoir",    icon: FileText   },
  { id: "company", label: "Émetteur", icon: Building2  },
  { id: "client",  label: "Client",   icon: User       },
  { id: "items",   label: "Lignes",   icon: Package    },
  { id: "notes",   label: "Notes",    icon: FileCheck  },
  { id: "preview", label: "Aperçu",   icon: Eye        },
];

// Couleur identitaire : orange/ambre (document correctif)
const ACCENT = {
  ring:    "ring-orange-500",
  bar:     "from-orange-500 to-amber-400",
  active:  "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-200",
  done:    "border-orange-400 bg-orange-50 text-orange-600",
  hover:   "group-hover:border-orange-300",
  text:    "text-orange-600",
  stepLbl: { active: "text-orange-600", done: "text-orange-500" },
  btn:     "bg-orange-600 hover:bg-orange-700",
  preview: "bg-orange-50",
  table:   "bg-orange-50/60",
  border:  "border-orange-500",
  badge:   "bg-orange-100 text-orange-800",
  info:    "bg-orange-50 border-orange-200 text-orange-700",
  rowHover:"hover:border-orange-300/50 hover:bg-orange-50/20",
};

// ─────────────────────────────────────────────
// NOTICE D'AIDE
// ─────────────────────────────────────────────
const HelpNotice = ({ tips, title = "Conseils", variant = "info" }) => {
  const [open, setOpen] = useState(false);
  const colors = {
    info:    { bg: "bg-blue-50 border-blue-200",   icon: "text-blue-500",  title: "text-blue-700"  },
    warning: { bg: "bg-amber-50 border-amber-200", icon: "text-amber-500", title: "text-amber-700" },
    success: { bg: "bg-green-50 border-green-200", icon: "text-green-500", title: "text-green-700" },
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
          <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
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
          Étape {currentStep + 1} / {steps.length} — <span className={ACCENT.text}>{steps[currentStep]?.label}</span>
        </span>
        <span className={`font-semibold ${ACCENT.text}`}>{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
        <motion.div className={`h-full rounded-full bg-gradient-to-r ${ACCENT.bar}`}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }} />
      </div>
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const done   = i < currentStep;
          const active = i === currentStep;
          const Icon   = step.icon;
          return (
            <button key={step.id} type="button" onClick={() => onNavigate(i)} title={step.label}
              className="flex flex-col items-center gap-1 transition-opacity group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                ${active ? ACCENT.active : done ? ACCENT.done : `border-gray-300 bg-white text-gray-400 ${ACCENT.hover}`}`}>
                {done ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className={`hidden sm:block text-[10px] font-medium leading-tight text-center
                ${active ? ACCENT.stepLbl.active : done ? ACCENT.stepLbl.done : "text-gray-400"}`}>
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
const CreditNotePage = () => {
  const navigate    = useNavigate();
  const creditRef   = useRef();

  const { symbol } = useCurrency();

  // États locaux
  const [currentStep,             setCurrentStep]            = useState(0);
  const [isGenerating,            setIsGenerating]           = useState(false);
  const [isSending,               setIsSending]              = useState(false);
  const [isCreditNoteHistoryOpen, setIsCreditNoteHistoryOpen] = useState(false);
  const [creditNoteStatus,        setCreditNoteStatus]       = useState("draft");

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
    creditNoteNumber:      generateCreditNoteNumber(),
    creditNoteDate:        new Date().toISOString().split("T")[0],
    originalInvoiceNumber: "",
    originalInvoiceDate:   "",
    creditReason:          "",
    companyName:           "",
    companyAddress:        "",
    companyCity:           "",
    companyPostalCode:     "",
    companyPhone:          "",
    companyEmail:          "",
    companyTaxId:          "",
    clientName:            "",
    clientCompany:         "",
    clientEmail:           "",
    clientPhone:           "",
    clientAddress:         "",
    clientCity:            "",
    clientPostalCode:      "",
    clientTaxId:           "",
    refundMethod:          "",
    notes:                 "",
    internalNotes:         "",
  });

  // ── Articles ────────────────────────────────
  const [creditNoteItems, setCreditNoteItems] = useState([
    { id: 1, description: "", quantity: 1, unitPrice: 0, discount: 0, taxRate: 19.25, total: 0, originalAmount: 0 },
  ]);

  // ── Options ─────────────────────────────────
  const creditReasons = [
    { value: "product_return",    label: "Retour de marchandise",      icon: "📦" },
    { value: "defective_product", label: "Produit défectueux",         icon: "⚠️" },
    { value: "billing_error",     label: "Erreur de facturation",      icon: "❌" },
    { value: "discount",          label: "Remise commerciale",         icon: "💰" },
    { value: "price_adjustment",  label: "Ajustement de prix",        icon: "💵" },
    { value: "cancelled_order",   label: "Annulation de commande",    icon: "🚫" },
    { value: "goodwill",          label: "Geste commercial",          icon: "🤝" },
    { value: "other",             label: "Autre",                     icon: "📝" },
  ];

  const refundMethods = [
    { value: "bank_transfer",    label: "Virement Bancaire",              icon: "🏦" },
    { value: "original_payment", label: "Méthode de paiement d'origine",  icon: "🔄" },
    { value: "store_credit",     label: "Avoir en magasin",               icon: "🎫" },
    { value: "cash",             label: "Espèces",                        icon: "💵" },
    { value: "check",            label: "Chèque",                         icon: "📝" },
  ];

  // ── Handlers formulaire ─────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Articles handlers ───────────────────────
  const addCreditNoteItem = () => {
    const newId = Math.max(...creditNoteItems.map(i => i.id), 0) + 1;
    setCreditNoteItems([...creditNoteItems, { id: newId, description: "", quantity: 1, unitPrice: 0, discount: 0, taxRate: 19.25, total: 0, originalAmount: 0 }]);
  };

  const updateCreditNoteItem = (id, field, value) => {
    setCreditNoteItems(creditNoteItems.map(item => {
      if (item.id !== id) return item;
      const u        = { ...item, [field]: value };
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

  const removeCreditNoteItem    = (id) => { if (creditNoteItems.length > 1) setCreditNoteItems(creditNoteItems.filter(i => i.id !== id)); };
  const duplicateCreditNoteItem = (id) => {
    const item = creditNoteItems.find(i => i.id === id);
    if (!item) return;
    const newId = Math.max(...creditNoteItems.map(i => i.id), 0) + 1;
    setCreditNoteItems([...creditNoteItems, { ...item, id: newId }]);
  };

  // Import simulé depuis facture
  const importFromInvoice = () => {
    if (!formData.originalInvoiceNumber) {
      alert("Veuillez entrer le numéro de facture d'origine");
      return;
    }
    setCreditNoteItems([
      { id: Date.now() + 1, description: "Service de développement web", quantity: 1, unitPrice: 50000, discount: 0, taxRate: 19.25, total: 59625, originalAmount: 59625 },
      { id: Date.now() + 2, description: "Hébergement annuel",           quantity: 1, unitPrice: 15000, discount: 10, taxRate: 19.25, total: 16091.25, originalAmount: 16091.25 },
    ]);
    alert("Lignes importées depuis la facture " + formData.originalInvoiceNumber);
  };

  // ── Calculs ─────────────────────────────────
  const subtotal              = creditNoteItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const totalDiscount         = creditNoteItems.reduce((s, i) => s + i.quantity * i.unitPrice * (i.discount / 100), 0);
  const subtotalAfterDiscount = subtotal - totalDiscount;
  const totalTax              = creditNoteItems.reduce((s, i) => {
    const base = i.quantity * i.unitPrice * (1 - i.discount / 100);
    return s + base * (i.taxRate / 100);
  }, 0);
  const total = creditNoteItems.reduce((s, i) => s + i.total, 0);

  // ── Validation ──────────────────────────────
  const isFormValid = () => {
    const ok = ["creditNoteNumber", "creditNoteDate", "companyName", "clientName", "creditReason", "refundMethod"]
      .every(f => formData[f]?.toString().trim() !== "");
    const itemsOk = creditNoteItems.every(i => i.description?.trim() && i.unitPrice > 0);
    return ok && itemsOk;
  };

  const canGoNext = () => {
    switch (STEPS[currentStep].id) {
      case "avoir":   return formData.creditNoteDate && formData.creditReason && formData.refundMethod;
      case "company": return formData.companyName?.trim() !== "";
      case "client":  return formData.clientName?.trim() !== "";
      case "items":   return creditNoteItems.length > 0 && creditNoteItems.every(i => i.description?.trim() && i.unitPrice > 0);
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
  const handleGenerateCreditNote = async () => {
    if (!isFormValid()) return;
    setIsGenerating(true);
    try {
      // TODO: dispatch createCreditNote / generateCreditNotePDF
      await new Promise(r => setTimeout(r, 1000)); // simulation
      setCreditNoteStatus("issued");
      setCurrentStep(STEPS.length - 1);
    } catch (err) {
      alert(err.message || "Erreur lors de la génération de l'avoir");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => creditRef.current,
    documentTitle: `Avoir_${formData.creditNoteNumber}`,
  });

  const resetForm = () => {
    setFormData({
      creditNoteNumber: generateCreditNoteNumber(), creditNoteDate: new Date().toISOString().split("T")[0],
      originalInvoiceNumber: "", originalInvoiceDate: "", creditReason: "",
      companyName: "", companyAddress: "", companyCity: "", companyPostalCode: "",
      companyPhone: "", companyEmail: "", companyTaxId: "",
      clientName: "", clientCompany: "", clientEmail: "", clientPhone: "",
      clientAddress: "", clientCity: "", clientPostalCode: "", clientTaxId: "",
      refundMethod: "", notes: "", internalNotes: "",
    });
    setCreditNoteItems([{ id: 1, description: "", quantity: 1, unitPrice: 0, discount: 0, taxRate: 19.25, total: 0, originalAmount: 0 }]);
    setCreditNoteStatus("draft");
    setCurrentStep(0);
  };

  // ── Badge statut ────────────────────────────
  const getStatusBadge = () => {
    const cfg = {
      draft:     { label: "Brouillon", className: "bg-gray-100 text-gray-700"    },
      issued:    { label: "Émis",      className: "bg-orange-100 text-orange-700" },
      processed: { label: "Traité",    className: "bg-green-100 text-green-700"  },
      cancelled: { label: "Annulé",    className: "bg-red-100 text-red-700"      },
    };
    const c = cfg[creditNoteStatus] || cfg.draft;
    return <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.className}`}>{c.label}</span>;
  };

  // ── Raison lisible ──────────────────────────
  const getCreditReasonLabel = () => creditReasons.find(r => r.value === formData.creditReason)?.label || "-";
  const getRefundMethodLabel = () => refundMethods.find(r => r.value === formData.refundMethod)?.label || "-";

  // ════════════════════════════════════════════
  // RENDU DES ÉTAPES
  // ════════════════════════════════════════════
  const renderStep = () => {
    switch (STEPS[currentStep].id) {

      // ── Étape 1 : Informations avoir ─────────
      case "avoir":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Informations de l'avoir</h2>
              <p className="mt-1 text-sm text-gray-500">Référencez l'avoir et sa facture d'origine.</p>
            </div>

            {/* Alerte légale */}
            <div className="flex items-start gap-3 p-4 border border-orange-200 rounded-xl bg-orange-50">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-orange-700">À propos des avoirs</h3>
                <p className="mt-1 text-sm text-orange-600">
                  Un avoir est un document comptable officiel qui annule tout ou partie d'une facture.
                  Il doit obligatoirement faire référence à la facture d'origine et être conservé 10 ans.
                </p>
              </div>
            </div>

            <HelpNotice variant="info" title="À savoir" tips={[
              "Le numéro d'avoir est généré automatiquement mais peut être modifié.",
              "La facture d'origine n'est pas obligatoire mais fortement recommandée.",
              "Le bouton ↺ à côté du numéro de facture permet d'importer ses lignes automatiquement.",
              "La raison et la méthode de remboursement sont obligatoires.",
            ]} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="creditNoteNumber">Numéro d'avoir *</Label>
                <div className="relative">
                  <Input id="creditNoteNumber" name="creditNoteNumber" value={formData.creditNoteNumber}
                    onChange={handleInputChange} className="pr-10 font-mono" required />
                  <Hash className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditNoteDate">Date de l'avoir *</Label>
                <div className="relative">
                  <Input id="creditNoteDate" name="creditNoteDate" type="date" value={formData.creditNoteDate}
                    onChange={handleInputChange} required />
                  <Calendar className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalInvoiceNumber">Facture d'origine</Label>
                <div className="flex gap-2">
                  <Input id="originalInvoiceNumber" name="originalInvoiceNumber" value={formData.originalInvoiceNumber}
                    onChange={handleInputChange} placeholder="INV-202603-0001" className="flex-1 font-mono" />
                  <Button type="button" onClick={importFromInvoice} variant="outline" size="sm"
                    className="gap-1 shrink-0" title="Importer les lignes de cette facture">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalInvoiceDate">Date facture d'origine</Label>
                <div className="relative">
                  <Input id="originalInvoiceDate" name="originalInvoiceDate" type="date"
                    value={formData.originalInvoiceDate} onChange={handleInputChange} />
                  <Calendar className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditReason">Raison de l'avoir *</Label>
                <select id="creditReason" name="creditReason" value={formData.creditReason}
                  onChange={handleInputChange} className="w-full px-3 py-2 text-sm border rounded-md" required>
                  <option value="">Sélectionnez une raison</option>
                  {creditReasons.map(r => <option key={r.value} value={r.value}>{r.icon} {r.label}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refundMethod">Méthode de remboursement *</Label>
                <select id="refundMethod" name="refundMethod" value={formData.refundMethod}
                  onChange={handleInputChange} className="w-full px-3 py-2 text-sm border rounded-md" required>
                  <option value="">Sélectionnez</option>
                  {refundMethods.map(m => <option key={m.value} value={m.value}>{m.icon} {m.label}</option>)}
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
              <p className="mt-1 text-sm text-gray-500">Ces informations apparaîtront en tant qu'émetteur de l'avoir.</p>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "Le nom de l'entreprise est obligatoire.",
              "Ajoutez votre NIF si vous êtes assujetti à la TVA.",
            ]} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                <Input id="companyName" name="companyName" value={formData.companyName}
                  onChange={handleInputChange} placeholder="Votre Entreprise SARL" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyAddress">Adresse</Label>
                <Input id="companyAddress" name="companyAddress" value={formData.companyAddress}
                  onChange={handleInputChange} placeholder="123 Avenue de la République" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyCity">Ville</Label>
                <Input id="companyCity" name="companyCity" value={formData.companyCity}
                  onChange={handleInputChange} placeholder="Douala" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPostalCode">Code postal / BP</Label>
                <Input id="companyPostalCode" name="companyPostalCode" value={formData.companyPostalCode}
                  onChange={handleInputChange} placeholder="BP 1234" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Téléphone</Label>
                <div className="relative">
                  <Input id="companyPhone" name="companyPhone" value={formData.companyPhone}
                    onChange={handleInputChange} placeholder="+237 6XX XX XX XX" />
                  <Phone className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email</Label>
                <div className="relative">
                  <Input id="companyEmail" name="companyEmail" type="email" value={formData.companyEmail}
                    onChange={handleInputChange} placeholder="contact@votreentreprise.com" />
                  <Mail className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 right-3 top-1/2" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyTaxId">N° Identification Fiscale</Label>
                <Input id="companyTaxId" name="companyTaxId" value={formData.companyTaxId}
                  onChange={handleInputChange} placeholder="CM12345678901" />
              </div>
            </div>
          </div>
        );

      // ── Étape 3 : Client ─────────────────────
      case "client":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Client bénéficiaire</h2>
              <p className="mt-1 text-sm text-gray-500">Coordonnées du client qui recevra l'avoir.</p>
            </div>
            <HelpNotice variant="info" title="Conseils" tips={[
              "Le nom du client est obligatoire.",
              "Renseignez l'email pour pouvoir lui transmettre l'avoir directement.",
            ]} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientName">Nom du client *</Label>
                <Input id="clientName" name="clientName" value={formData.clientName}
                  onChange={handleInputChange} placeholder="Jean Dupont" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientCompany">Entreprise du client</Label>
                <Input id="clientCompany" name="clientCompany" value={formData.clientCompany}
                  onChange={handleInputChange} placeholder="Client Entreprise SA" />
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
                <Input id="clientAddress" name="clientAddress" value={formData.clientAddress}
                  onChange={handleInputChange} placeholder="456 Boulevard Principal" />
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
                <Label htmlFor="clientTaxId">N° Identification Fiscale</Label>
                <Input id="clientTaxId" name="clientTaxId" value={formData.clientTaxId}
                  onChange={handleInputChange} placeholder="CM98765432101" />
              </div>
            </div>
          </div>
        );

      // ── Étape 4 : Lignes ─────────────────────
      case "items":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Lignes de l'avoir</h2>
                <p className="mt-1 text-sm text-gray-500">Montants à rembourser ou à corriger.</p>
              </div>
              <Badge variant="outline">{creditNoteItems.length} ligne(s)</Badge>
            </div>
            <HelpNotice variant="warning" title="Important" tips={[
              "Chaque ligne doit correspondre à un article ou service de la facture d'origine.",
              "Le total d'un avoir ne peut pas excéder le montant de la facture d'origine.",
              "Utilisez le bouton ↺ à l'étape 1 pour importer les lignes de la facture.",
            ]} />
            <div className="space-y-4">
              {creditNoteItems.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 space-y-3 transition-colors border-2 border-orange-100 rounded-xl bg-orange-50/30 hover:border-orange-200">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs bg-white">Ligne {index + 1}</Badge>
                    <div className="flex gap-1">
                      <Button type="button" onClick={() => duplicateCreditNoteItem(item.id)} variant="ghost" size="sm"
                        className="w-8 h-8 p-0 text-orange-500 hover:bg-orange-50" title="Dupliquer">
                        <Copy className="w-4 h-4" />
                      </Button>
                      {creditNoteItems.length > 1 && (
                        <Button type="button" onClick={() => removeCreditNoteItem(item.id)} variant="ghost" size="sm"
                          className="w-8 h-8 p-0 text-red-500 hover:bg-red-50" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Input value={item.description}
                      onChange={e => updateCreditNoteItem(item.id, "description", e.target.value)}
                      placeholder="Ex : Retour produit défectueux — Réf. PROD-001" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    <div className="space-y-2">
                      <Label>Quantité</Label>
                      <Input type="number" value={item.quantity} min="1" step="0.01"
                        onChange={e => updateCreditNoteItem(item.id, "quantity", Math.max(1, parseFloat(e.target.value) || 1))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Prix U. ({symbol})</Label>
                      <Input type="number" value={item.unitPrice} min="0" step="0.01"
                        onChange={e => updateCreditNoteItem(item.id, "unitPrice", Math.max(0, parseFloat(e.target.value) || 0))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Remise %</Label>
                      <div className="relative">
                        <Input type="number" value={item.discount} min="0" max="100" step="0.01"
                          onChange={e => updateCreditNoteItem(item.id, "discount", Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))} />
                        <Percent className="absolute w-3 h-3 text-gray-400 -translate-y-1/2 pointer-events-none right-2 top-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>TVA %</Label>
                      <Input type="number" value={item.taxRate} min="0" step="0.01"
                        onChange={e => updateCreditNoteItem(item.id, "taxRate", Math.max(0, parseFloat(e.target.value) || 0))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <div className="flex items-center h-10 px-3 py-2 text-sm font-semibold text-orange-600 bg-white border rounded-lg">
                        {item.total.toLocaleString()} {symbol}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button type="button" onClick={addCreditNoteItem} variant="outline" className="w-full gap-2">
              <Plus className="w-4 h-4" /> Ajouter une ligne
            </Button>

            {/* Récap */}
            <div className="p-4 space-y-2 border-2 border-orange-200 rounded-xl bg-orange-50/50">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-orange-700">
                <RotateCcw className="w-4 h-4" /> Montant à rembourser
              </h4>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Sous-total HT</span><span>{subtotal.toLocaleString()} {symbol}</span></div>
              {totalDiscount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Remise</span><span className="text-green-600">-{totalDiscount.toLocaleString()} {symbol}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-gray-600">TVA</span><span>{totalTax.toLocaleString()} {symbol}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-orange-700">
                <span>Total TTC à rembourser</span>
                <span>{total.toLocaleString()} {symbol}</span>
              </div>
            </div>
          </div>
        );

      // ── Étape 5 : Notes ──────────────────────
      case "notes":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Notes</h2>
              <p className="mt-1 text-sm text-gray-500">Ajoutez un message au client et des notes internes.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes client <span className="text-xs text-gray-400">(visibles sur l'avoir)</span></Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={5}
                  placeholder="Nous vous prions de nous excuser pour ce désagrément..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="internalNotes">Notes internes <span className="text-xs text-gray-400">(usage interne uniquement)</span></Label>
                <Textarea id="internalNotes" name="internalNotes" value={formData.internalNotes}
                  onChange={handleInputChange} rows={5} placeholder="Référence ticket support, contexte interne..." />
              </div>
            </div>

            {/* Rappel légal */}
            <div className="p-4 space-y-1 text-xs text-orange-700 border border-orange-200 rounded-xl bg-orange-50">
              <p className="font-semibold">⚠️ Mentions légales :</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>L'avoir doit faire référence à la facture d'origine</li>
                <li>Le montant ne peut pas excéder celui de la facture</li>
                <li>Conservation obligatoire pendant 10 ans</li>
              </ul>
            </div>
          </div>
        );

      // ── Étape 6 : Aperçu ─────────────────────
      case "preview":
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Aperçu de l'avoir</h2>
                <p className="mt-1 text-sm text-gray-500">Vérifiez votre avoir avant de le générer.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setCurrentStep(0)} className="gap-2">
                  <Edit2 className="w-4 h-4" /> Modifier
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                  <Printer className="w-4 h-4" /> Imprimer
                </Button>
                <Button type="button" size="sm" onClick={handleGenerateCreditNote} disabled={isGenerating || !isFormValid()}
                  className={`gap-2 ${ACCENT.btn}`}>
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Télécharger PDF
                </Button>
              </div>
            </div>

            {/* Document preview */}
            <div className="overflow-hidden border-2 border-orange-100 shadow-sm rounded-xl">
              <div ref={creditRef} className="max-w-4xl p-8 mx-auto bg-white">
                {/* En-tête */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-orange-600">AVOIR</h1>
                      <p className="font-mono text-sm text-gray-500">N° {formData.creditNoteNumber}</p>
                      {formData.originalInvoiceNumber && (
                        <p className="text-xs text-gray-400">Réf. facture : {formData.originalInvoiceNumber}
                          {formData.originalInvoiceDate && ` du ${new Date(formData.originalInvoiceDate).toLocaleDateString("fr-FR")}`}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-lg">
                        <RotateCcw className="w-8 h-8 text-orange-600" />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{new Date(formData.creditNoteDate).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>

                  {/* Raison + remboursement */}
                  <div className="flex gap-4 mt-4">
                    <div className="flex-1 p-3 text-sm rounded-lg bg-orange-50">
                      <span className="text-xs font-semibold tracking-wide text-orange-600 uppercase">Raison</span>
                      <p className="font-medium mt-0.5">{getCreditReasonLabel()}</p>
                    </div>
                    <div className="flex-1 p-3 text-sm rounded-lg bg-orange-50">
                      <span className="text-xs font-semibold tracking-wide text-orange-600 uppercase">Remboursement</span>
                      <p className="font-medium mt-0.5">{getRefundMethodLabel()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mt-6">
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
                      <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Bénéficiaire</h3>
                      {formData.clientCompany && <p className="font-bold">{formData.clientCompany}</p>}
                      <p className="font-medium">{formData.clientName || "Client"}</p>
                      {formData.clientAddress && <p className="text-sm text-gray-600">{formData.clientAddress}</p>}
                      {(formData.clientPostalCode || formData.clientCity) && <p className="text-sm text-gray-600">{formData.clientPostalCode} {formData.clientCity}</p>}
                      {formData.clientPhone && <p className="text-sm text-gray-600">Tél : {formData.clientPhone}</p>}
                      {formData.clientEmail && <p className="text-sm text-gray-600">{formData.clientEmail}</p>}
                    </div>
                  </div>
                </div>

                {/* Tableau lignes */}
                <table className="w-full mb-8 text-sm">
                  <thead>
                    <tr className="bg-orange-50">
                      <th className="p-3 font-semibold text-left">Description</th>
                      <th className="p-3 font-semibold text-right">Qté</th>
                      <th className="p-3 font-semibold text-right">Prix U. ({symbol})</th>
                      <th className="p-3 font-semibold text-right">Remise</th>
                      <th className="p-3 font-semibold text-right">TVA</th>
                      <th className="p-3 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditNoteItems.map((item, i) => (
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

                {/* Totaux */}
                <div className="flex justify-end mb-8">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Sous-total HT</span><span className="font-medium">{subtotal.toLocaleString()} {symbol}</span></div>
                    {totalDiscount > 0 && <div className="flex justify-between"><span className="text-gray-600">Remise totale</span><span className="font-medium text-green-600">-{totalDiscount.toLocaleString()} {symbol}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-600">Total HT</span><span className="font-medium">{subtotalAfterDiscount.toLocaleString()} {symbol}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">TVA</span><span className="font-medium">{totalTax.toLocaleString()} {symbol}</span></div>
                    <div className={`pt-2 mt-2 border-t-2 ${ACCENT.border}`}>
                      <div className="flex justify-between text-base font-bold">
                        <span>TOTAL À REMBOURSER</span>
                        <span className={ACCENT.text}>{total.toLocaleString()} {symbol}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.notes && <div className="mb-4"><h4 className="mb-1 text-sm font-semibold">Notes :</h4><p className="text-sm text-gray-600">{formData.notes}</p></div>}

                <div className="pt-4 mt-8 text-xs text-center text-gray-400 border-t">
                  Avoir généré le {new Date().toLocaleDateString("fr-FR")} — Document comptable officiel
                </div>
              </div>
            </div>
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
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-400/5 to-white">
        <div className="container px-4 py-10 mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-4 bg-orange-100 rounded-full w-14 h-14">
              <RotateCcw className="text-orange-600 w-7 h-7" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Générateur d'Avoir</h1>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="font-mono text-sm text-gray-500">{formData.creditNoteNumber}</span>
              {getStatusBadge()}
            </div>
            <p className="mt-1 text-sm text-gray-500">Créez un avoir professionnel en quelques étapes guidées</p>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-5xl px-4 py-8 mx-auto">
        {/* Barre de progression */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 mb-8 bg-white border shadow-sm rounded-2xl">
          <ProgressBar steps={STEPS} currentStep={currentStep} onNavigate={goTo} />
        </motion.div>

        {/* Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => setIsCreditNoteHistoryOpen(true)} className="gap-2">
              <BookOpen className="w-4 h-4" /> Historique des avoirs
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
            <Button type="button" onClick={handleGenerateCreditNote} disabled={isGenerating || !isFormValid()}
              className={`gap-2 ${ACCENT.btn}`}>
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Génération…</>
                : <><Download className="w-4 h-4" /> Générer l'avoir</>}
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
              <Shield className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="mb-2 text-sm font-semibold">Bonnes pratiques pour un avoir conforme</h4>
                <ul className="grid grid-cols-1 gap-1 text-xs text-muted-foreground md:grid-cols-2">
                  <li>• Référencez toujours la facture d'origine dans l'avoir</li>
                  <li>• Le montant de l'avoir ne peut pas dépasser celui de la facture</li>
                  <li>• Conservez une copie signée de chaque avoir émis</li>
                  <li>• Transmettez l'avoir au client dès que possible</li>
                  <li>• Enregistrez l'avoir dans votre comptabilité sous 48h</li>
                  <li>• Conservation obligatoire : 10 ans minimum</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Nouvel avoir */}
        {STEPS[currentStep]?.id === "preview" && (
          <div className="flex justify-center mt-6">
            <Button type="button" variant="outline" onClick={resetForm} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Nouvel avoir
            </Button>
          </div>
        )}
      </div>

      {/* Dialog Historique */}
      <CreditNoteHistoryDialog
        isOpen={isCreditNoteHistoryOpen}
        onClose={() => setIsCreditNoteHistoryOpen(false)}
        symbol={symbol}
        creditNoteHistory={[
          {
            id: "1",
            creditNoteNumber:      "AV-202603-0003",
            clientName:            "Client SA",
            originalInvoiceNumber: "INV-202602-0042",
            total:                 75000,
            statut:                "processed", // "draft"|"issued"|"processed"|"cancelled"
            creditReason:          "billing_error",
            dateCreation:          "13/03/2026",
            url:                   "https://...",
          },
        ]}
        onPreviewCreditNote={(cn)   => window.open(cn.url, "_blank")}
        onDownloadCreditNote={(cn)  => { /* download logic */ }}
        onDeleteCreditNote={(cn)    => { /* delete logic  */ }}
        onDuplicateCreditNote={(cn) => { /* duplicate logic */ }}
      />
    </div>
  );
};

export default CreditNotePage;