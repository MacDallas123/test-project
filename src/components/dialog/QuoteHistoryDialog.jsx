import { useState } from "react";
import {
  FileText, Download, Eye, Trash2, Clock, Send,
  Calendar, Search, AlertCircle, CheckCircle2,
  XCircle, MoreHorizontal, RefreshCw, ThumbsUp,
  ThumbsDown, Timer, Briefcase, DollarSign, Copy,
} from "lucide-react";
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
const QUOTE_STATUS_META = {
  draft:    { label: "Brouillon", icon: RefreshCw,    bg: "bg-gray-50    text-gray-600    border-gray-200"    },
  sent:     { label: "Envoyé",   icon: Send,          bg: "bg-sky-50     text-sky-700     border-sky-200"     },
  accepted: { label: "Accepté",  icon: ThumbsUp,      bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  rejected: { label: "Refusé",   icon: ThumbsDown,    bg: "bg-red-50     text-red-700     border-red-200"     },
  expired:  { label: "Expiré",   icon: Timer,         bg: "bg-orange-50  text-orange-700  border-orange-200"  },
};

// ─────────────────────────────────────────────
// BADGE STATUT
// ─────────────────────────────────────────────
function QuoteStatusBadge({ statut }) {
  const meta = QUOTE_STATUS_META[statut] || QUOTE_STATUS_META.draft;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${meta.bg}`}>
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// LIGNE DEVIS
// ─────────────────────────────────────────────
function QuoteRow({ quote, onPreview, onDownload, onDelete, onDuplicate, index, symbol = "FCFA" }) {
  const canAct = ["sent", "accepted"].includes(quote.statut);

  return (
    <div
      className="flex items-center gap-4 p-4 transition-all duration-200 bg-white border border-gray-100 group rounded-xl hover:border-emerald-300/50 hover:bg-emerald-50/20"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Icône document */}
      <div className="flex items-center justify-center flex-shrink-0 w-10 h-12 border rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-100">
        <FileText className="w-5 h-5 text-emerald-500" />
      </div>

      {/* Infos principales */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-gray-800 truncate">
            {quote.quoteNumber}
          </span>
          <QuoteStatusBadge statut={quote.statut} />
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
          {quote.clientName && (
            <span className="font-medium text-gray-600 truncate max-w-[140px]">
              {quote.clientCompany ? `${quote.clientName} — ${quote.clientCompany}` : quote.clientName}
            </span>
          )}
          {quote.projectName && (
            <span className="flex items-center gap-1 text-gray-500 truncate max-w-[160px]">
              <Briefcase className="flex-shrink-0 w-3 h-3" />
              {quote.projectName}
            </span>
          )}
          {quote.total !== undefined && (
            <span className="flex items-center gap-1 font-semibold text-emerald-600">
              <DollarSign className="w-3 h-3" />
              {quote.total.toLocaleString()} {symbol}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Créé le {quote.dateCreation}
          </span>
          {quote.validUntil && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Valable jusqu'au {quote.validUntil}
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
              className="w-8 h-8 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
              onClick={() => onPreview(quote)}
              title="Aperçu"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
              onClick={() => onDownload(quote)}
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
                <DropdownMenuItem onClick={() => onPreview(quote)} className="gap-2 text-sm">
                  <Eye className="w-4 h-4" /> Aperçu
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(quote)} className="gap-2 text-sm">
                  <Download className="w-4 h-4" /> Télécharger
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={() => onDuplicate(quote)} className="gap-2 text-sm">
              <Copy className="w-4 h-4" /> Dupliquer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(quote)}
              className="gap-2 text-sm text-red-500 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Actions mobiles */}
      <div className="flex items-center gap-1 sm:hidden">
        {canAct && (
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onDownload(quote)}>
            <Download className="w-4 h-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="w-8 h-8 text-red-400" onClick={() => onDelete(quote)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────
const QuoteHistoryDialog = ({
  isOpen,
  onClose,
  selectedUser,
  quoteHistory = [],       // tableau de devis
  onPreviewQuote,          // (quote) => void
  onDownloadQuote,         // (quote) => void
  onDeleteQuote,           // (quote) => void
  onDuplicateQuote,        // (quote) => void
  isLoading = false,
  symbol = "FCFA",
}) => {
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("tous");

  // Filtrage
  const filtered = quoteHistory.filter(q => {
    const term        = search.toLowerCase();
    const matchSearch = (
      q.quoteNumber?.toLowerCase().includes(term)   ||
      q.clientName?.toLowerCase().includes(term)    ||
      q.projectName?.toLowerCase().includes(term)
    );
    const matchStatus = filterStatus === "tous" || q.statut === filterStatus;
    return matchSearch && matchStatus;
  });

  // Compteurs
  const total    = quoteHistory.length;
  const accepted = quoteHistory.filter(q => q.statut === "accepted").length;
  const sent     = quoteHistory.filter(q => q.statut === "sent").length;
  const rejected = quoteHistory.filter(q => q.statut === "rejected").length;
  const expired  = quoteHistory.filter(q => q.statut === "expired").length;
  const totalTTC = quoteHistory
    .filter(q => q.total !== undefined)
    .reduce((s, q) => s + q.total, 0);
  const acceptanceRate = total > 0
    ? Math.round((accepted / total) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[860px] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">

        {/* ── En-tête ───────────────────────────── */}
        <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-br from-emerald-50 to-transparent">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Historique des devis
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
              <span className="text-muted-foreground">devis au total</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-sm">
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-bold text-gray-800">{accepted}</span>
              <span className="text-muted-foreground">accepté{accepted !== 1 ? "s" : ""}</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-sm">
              <Send className="w-3.5 h-3.5 text-sky-500" />
              <span className="font-bold text-gray-800">{sent}</span>
              <span className="text-muted-foreground">envoyé{sent !== 1 ? "s" : ""}</span>
            </div>
            {rejected > 0 && (
              <>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-sm">
                  <ThumbsDown className="w-3.5 h-3.5 text-red-500" />
                  <span className="font-bold text-red-600">{rejected}</span>
                  <span className="text-muted-foreground">refusé{rejected !== 1 ? "s" : ""}</span>
                </div>
              </>
            )}
            {expired > 0 && (
              <>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-sm">
                  <Timer className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-bold text-orange-600">{expired}</span>
                  <span className="text-muted-foreground">expiré{expired !== 1 ? "s" : ""}</span>
                </div>
              </>
            )}
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-sm">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-bold text-gray-800">{totalTTC.toLocaleString()}</span>
              <span className="text-muted-foreground">{symbol} total</span>
            </div>
            {total > 0 && (
              <>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-bold text-emerald-600">{acceptanceRate}%</span>
                  <span className="text-muted-foreground">taux d'acceptation</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Filtres ───────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-3 bg-white border-b">
          {/* Recherche */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              className="h-8 pl-8 text-sm"
              placeholder="N° devis, client, projet…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filtre statut */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 flex-wrap">
            {[
              { val: "tous",     label: "Tous"       },
              { val: "draft",    label: "Brouillons" },
              { val: "sent",     label: "Envoyés"    },
              { val: "accepted", label: "Acceptés"   },
              { val: "rejected", label: "Refusés"    },
              { val: "expired",  label: "Expirés"    },
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setFilterStatus(opt.val)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all
                  ${filterStatus === opt.val
                    ? "bg-white shadow-sm text-emerald-600"
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
                <div key={i} className="h-[72px] rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex items-center justify-center mb-3 bg-gray-100 rounded-full w-14 h-14">
                <AlertCircle className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                {quoteHistory.length === 0
                  ? "Aucun devis généré pour le moment"
                  : "Aucun résultat pour ces filtres"}
              </p>
              {quoteHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => { setSearch(""); setFilterStatus("tous"); }}
                  className="mt-2 text-xs text-emerald-600 hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            filtered.map((quote, i) => (
              <QuoteRow
                key={quote.id}
                quote={quote}
                index={i}
                symbol={symbol}
                onPreview={onPreviewQuote}
                onDownload={onDownloadQuote}
                onDelete={onDeleteQuote}
                onDuplicate={onDuplicateQuote}
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

export default QuoteHistoryDialog;

// ─────────────────────────────────────────────────────────────────────────────
// EXEMPLE D'UTILISATION :
//
// const [isQuoteHistoryOpen, setIsQuoteHistoryOpen] = useState(false);
//
// <Button variant="outline" onClick={() => setIsQuoteHistoryOpen(true)}>
//   <FileText className="w-4 h-4 mr-2" /> Historique des devis
// </Button>
//
// <QuoteHistoryDialog
//   isOpen={isQuoteHistoryOpen}
//   onClose={() => setIsQuoteHistoryOpen(false)}
//   selectedUser={user}
//   symbol="FCFA"
//   quoteHistory={[
//     {
//       id: "1",
//       quoteNumber:   "DEV-202603-0017",
//       clientName:    "Samuel Bikoko",
//       clientCompany: "Bikoko Génie Civil SARL",
//       projectName:   "Construction Résidence Makepe",
//       total:         2500000,
//       statut:        "accepted",  // "draft"|"sent"|"accepted"|"rejected"|"expired"
//       dateCreation:  "12/03/2026",
//       validUntil:    "11/04/2026",
//       url:           "https://...",
//     },
//   ]}
//   onPreviewQuote={(q)   => window.open(q.url, "_blank")}
//   onDownloadQuote={(q)  => { /* download logic */ }}
//   onDeleteQuote={(q)    => { /* delete logic  */ }}
//   onDuplicateQuote={(q) => { /* duplicate logic */ }}
// />
// ─────────────────────────────────────────────────────────────────────────────