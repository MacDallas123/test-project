import { useState } from "react";
import {
  Receipt, Download, Eye, Trash2, Clock, Send,
  Calendar, Search, AlertCircle, CheckCircle2,
  XCircle, MoreHorizontal, RefreshCw, CreditCard,
  DollarSign, Copy,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// ─────────────────────────────────────────────
// MÉTADONNÉES STATUT
// ─────────────────────────────────────────────
const INVOICE_STATUS_META = {
  genere:    { label: "Générée",   icon: CheckCircle2, bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  envoye:    { label: "Envoyée",   icon: Send,         bg: "bg-sky-50     text-sky-700     border-sky-200"     },
  paye:      { label: "Payée",     icon: CreditCard,   bg: "bg-violet-50  text-violet-700  border-violet-200"  },
  en_retard: { label: "En retard", icon: XCircle,      bg: "bg-red-50     text-red-700     border-red-200"     },
  brouillon: { label: "Brouillon", icon: RefreshCw,    bg: "bg-gray-50    text-gray-600    border-gray-200"    },
};

// ─────────────────────────────────────────────
// BADGE STATUT
// ─────────────────────────────────────────────
function InvoiceStatusBadge({ statut }) {
  const meta = INVOICE_STATUS_META[statut] || INVOICE_STATUS_META.brouillon;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${meta.bg}`}>
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// LIGNE FACTURE
// ─────────────────────────────────────────────
function InvoiceRow({ invoice, onPreview, onDownload, onDelete, onDuplicate, index, symbol = "FCFA" }) {
  const canAct = ["genere", "envoye", "paye"].includes(invoice.statut);

  return (
    <div
      className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-200"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Icône document */}
      <div className="flex items-center justify-center flex-shrink-0 w-10 h-12 border rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border-primary/10">
        <Receipt className="w-5 h-5 text-primary/60" />
      </div>

      {/* Infos principales */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-gray-800 truncate">
            {invoice.invoiceNumber}
          </span>
          <InvoiceStatusBadge statut={invoice.statut} />
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
          {invoice.clientName && (
            <span className="font-medium text-gray-600 truncate max-w-[140px]">
              {invoice.clientName}
            </span>
          )}
          {invoice.total !== undefined && (
            <span className="flex items-center gap-1 font-semibold text-primary">
              <DollarSign className="w-3 h-3" />
              {invoice.total.toLocaleString()} {symbol}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Créée le {invoice.dateCreation}
          </span>
          {invoice.dateEcheance && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Échéance : {invoice.dateEcheance}
            </span>
          )}
        </div>
      </div>

      {/* Actions hover (desktop) */}
      <div className="flex items-center gap-1 transition-opacity opacity-0 group-hover:opacity-100">
        {canAct && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-500 hover:text-primary hover:bg-primary/10"
              onClick={() => onPreview(invoice)}
              title="Aperçu"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
              onClick={() => onDownload(invoice)}
              title="Télécharger"
            >
              <Download className="w-4 h-4" />
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-gray-700">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 z-2010">
            {canAct && (
              <>
                <DropdownMenuItem onClick={() => onPreview(invoice)} className="gap-2 text-sm">
                  <Eye className="w-4 h-4" /> Aperçu
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(invoice)} className="gap-2 text-sm">
                  <Download className="w-4 h-4" /> Télécharger
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={() => onDuplicate(invoice)} className="gap-2 text-sm">
              <Copy className="w-4 h-4" /> Dupliquer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(invoice)}
              className="gap-2 text-sm text-red-500 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Actions toujours visibles sur mobile */}
      <div className="flex items-center gap-1 sm:hidden">
        {canAct && (
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onDownload(invoice)}>
            <Download className="w-4 h-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="w-8 h-8 text-red-400" onClick={() => onDelete(invoice)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────
const InvoiceHistoryDialog = ({
  isOpen,
  onClose,
  selectedUser,
  invoiceHistory = [],      // tableau de factures
  onPreviewInvoice,         // (invoice) => void
  onDownloadInvoice,        // (invoice) => void
  onDeleteInvoice,          // (invoice) => void
  onDuplicateInvoice,       // (invoice) => void
  isLoading = false,
  symbol = "FCFA",
}) => {
  const [search,        setSearch]        = useState("");
  const [filterStatus,  setFilterStatus]  = useState("tous");

  // Filtrage
  const filtered = invoiceHistory.filter(inv => {
    const term        = search.toLowerCase();
    const matchSearch = (
      inv.invoiceNumber?.toLowerCase().includes(term) ||
      inv.clientName?.toLowerCase().includes(term)
    );
    const matchStatus = filterStatus === "tous" || inv.statut === filterStatus;
    return matchSearch && matchStatus;
  });

  // Compteurs
  const total     = invoiceHistory.length;
  const payees    = invoiceHistory.filter(i => i.statut === "paye").length;
  const envoyees  = invoiceHistory.filter(i => i.statut === "envoye").length;
  const retard    = invoiceHistory.filter(i => i.statut === "en_retard").length;
  const totalTTC  = invoiceHistory
    .filter(i => i.total !== undefined)
    .reduce((s, i) => s + i.total, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[820px] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">

        {/* ── En-tête ───────────────────────────── */}
        <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-br from-primary/5 to-transparent">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              Historique des factures
            </DialogTitle>
            {selectedUser && (
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="text-[9px]">
                    {selectedUser.prenom?.[0]}{selectedUser.nom?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {selectedUser.prenom} {selectedUser.nom} — {selectedUser.email}
                </span>
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Résumé chiffré */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-bold text-gray-800">{total}</span>
              <span className="text-muted-foreground">facture{total !== 1 ? "s" : ""}</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-500" />
              <span className="font-bold text-gray-800">{payees}</span>
              <span className="text-muted-foreground">payée{payees !== 1 ? "s" : ""}</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-sm">
              <Send className="w-3.5 h-3.5 text-sky-500" />
              <span className="font-bold text-gray-800">{envoyees}</span>
              <span className="text-muted-foreground">envoyée{envoyees !== 1 ? "s" : ""}</span>
            </div>
            {retard > 0 && (
              <>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-sm">
                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                  <span className="font-bold text-red-600">{retard}</span>
                  <span className="text-muted-foreground">en retard</span>
                </div>
              </>
            )}
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-sm">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-bold text-gray-800">{totalTTC.toLocaleString()}</span>
              <span className="text-muted-foreground">{symbol} total</span>
            </div>
          </div>
        </div>

        {/* ── Filtres ───────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-3 bg-white border-b">
          {/* Recherche */}
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              className="h-8 pl-8 text-sm"
              placeholder="N° facture, client…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filtre statut */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {[
              { val: "tous",      label: "Tous"       },
              { val: "genere",    label: "Générées"   },
              { val: "envoye",    label: "Envoyées"   },
              { val: "paye",      label: "Payées"     },
              { val: "en_retard", label: "En retard"  },
              { val: "brouillon", label: "Brouillons" },
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setFilterStatus(opt.val)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all
                  ${filterStatus === opt.val
                    ? "bg-white shadow-sm text-primary"
                    : "text-gray-500 hover:text-gray-700"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Liste ─────────────────────────────── */}
        <div className="flex-1 px-6 py-4 space-y-2 overflow-y-auto bg-gray-50/50">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[68px] rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex items-center justify-center mb-3 bg-gray-100 rounded-full w-14 h-14">
                <AlertCircle className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                {invoiceHistory.length === 0
                  ? "Aucune facture générée pour le moment"
                  : "Aucun résultat pour ces filtres"}
              </p>
              {invoiceHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => { setSearch(""); setFilterStatus("tous"); }}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            filtered.map((invoice, i) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
                index={i}
                symbol={symbol}
                onPreview={onPreviewInvoice}
                onDownload={onDownloadInvoice}
                onDelete={onDeleteInvoice}
                onDuplicate={onDuplicateInvoice}
              />
            ))
          )}
        </div>

        {/* ── Pied ──────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 px-6 py-4 bg-white border-t">
          <p className="text-xs text-muted-foreground">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
            {filtered.length !== total && ` sur ${total}`}
          </p>
          <Button variant="outline" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default InvoiceHistoryDialog;

// ─────────────────────────────────────────────────────────────────────────────
// EXEMPLE D'UTILISATION :
//
// const [isInvoiceHistoryOpen, setIsInvoiceHistoryOpen] = useState(false);
//
// <Button variant="outline" onClick={() => setIsInvoiceHistoryOpen(true)}>
//   <Receipt className="w-4 h-4 mr-2" /> Historique des factures
// </Button>
//
// <InvoiceHistoryDialog
//   isOpen={isInvoiceHistoryOpen}
//   onClose={() => setIsInvoiceHistoryOpen(false)}
//   selectedUser={user}
//   symbol="FCFA"
//   invoiceHistory={[
//     {
//       id: "1",
//       invoiceNumber: "INV-202603-0042",
//       clientName: "Client SA",
//       total: 185000,
//       statut: "paye",        // "genere" | "envoye" | "paye" | "en_retard" | "brouillon"
//       dateCreation: "12/03/2026",
//       dateEcheance: "11/04/2026",
//       url: "https://...",
//     },
//   ]}
//   onPreviewInvoice={(inv)   => window.open(inv.url, "_blank")}
//   onDownloadInvoice={(inv)  => { /* download logic */ }}
//   onDeleteInvoice={(inv)    => { /* delete logic  */ }}
//   onDuplicateInvoice={(inv) => { /* duplicate logic */ }}
// />
// ─────────────────────────────────────────────────────────────────────────────