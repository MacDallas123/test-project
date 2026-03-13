import { useState } from "react";
import {
  FileText, Download, Eye, Trash2, Clock, Sparkles,
  LayoutTemplate, Calendar, Search, Filter, AlertCircle,
  CheckCircle2, XCircle, MoreHorizontal, RefreshCw,
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
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// ── Helpers ──────────────────────────────────────────────────────────────────

const CV_TYPE_META = {
  fibem:    { label: "FIBEM",     icon: Sparkles,       bg: "bg-violet-100 text-violet-700 border-violet-200" },
  classique:{ label: "Classique", icon: LayoutTemplate, bg: "bg-sky-100    text-sky-700    border-sky-200"    },
};

const CV_STATUS_META = {
  genere:    { label: "Généré",    icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  en_cours:  { label: "En cours", icon: RefreshCw,    color: "text-amber-500",   bg: "bg-amber-50   text-amber-700   border-amber-200"   },
  echoue:    { label: "Échoué",   icon: XCircle,      color: "text-red-500",     bg: "bg-red-50     text-red-700     border-red-200"     },
};

function CvStatusBadge({ statut }) {
  const meta = CV_STATUS_META[statut] || CV_STATUS_META.en_cours;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${meta.bg}`}>
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}

function CvTypeBadge({ type }) {
  const meta = CV_TYPE_META[type] || CV_TYPE_META.classique;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${meta.bg}`}>
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}

// ── Ligne CV ─────────────────────────────────────────────────────────────────

function CvRow({ cv, onPreview, onDownload, onDelete, onDuplicate, index }) {
  return (
    <div
      className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-200"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Icône document */}
      <div className="flex items-center justify-center flex-shrink-0 w-10 h-12 border rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border-primary/10">
        <FileText className="w-5 h-5 text-primary/60" />
      </div>

      {/* Infos principales */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-800 truncate">{cv.titre}</span>
          <CvTypeBadge type={cv.type} />
          <CvStatusBadge statut={cv.statut} />
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Créé le {cv.dateCreation}
          </span>
          {cv.dateModification && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Modifié le {cv.dateModification}
            </span>
          )}
          {cv.template && (
            <span className="text-gray-400">Modèle : {cv.template}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 transition-opacity opacity-0 group-hover:opacity-100">
        {cv.statut === "genere" && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-500 hover:text-primary hover:bg-primary/10"
              onClick={() => onPreview(cv)}
              title="Aperçu"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
              onClick={() => onDownload(cv)}
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
          <DropdownMenuContent align="end" className=" z-2010">
            {cv.statut === "genere" && (
              <>
                <DropdownMenuItem onClick={() => onPreview(cv)} className="gap-2 text-sm">
                  <Eye className="w-4 h-4" /> Aperçu
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload(cv)} className="gap-2 text-sm">
                  <Download className="w-4 h-4" /> Télécharger
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={() => onDuplicate(cv)} className="gap-2 text-sm">
              <RefreshCw className="w-4 h-4" /> Dupliquer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(cv)}
              className="gap-2 text-sm text-red-500 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Actions toujours visibles sur mobile */}
      <div className="flex items-center gap-1 sm:hidden">
        {cv.statut === "genere" && (
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onDownload(cv)}>
            <Download className="w-4 h-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="w-8 h-8 text-red-400" onClick={() => onDelete(cv)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────

const CVHistoryDialog = ({
  isOpen,
  onClose,
  selectedUser,
  cvHistory = [],          // tableau de CVs
  onPreviewCV,             // (cv) => void
  onDownloadCV,            // (cv) => void
  onDeleteCV,              // (cv) => void
  onDuplicateCV,           // (cv) => void
  isLoading = false,
}) => {
  const [search, setSearch]       = useState("");
  const [filterType, setFilterType] = useState("tous");   // "tous" | "fibem" | "classique"
  const [filterStatus, setFilterStatus] = useState("tous"); // "tous" | "genere" | "en_cours" | "echoue"

  // Filtrage
  const filtered = cvHistory.filter(cv => {
    const matchSearch  = cv.titre.toLowerCase().includes(search.toLowerCase());
    const matchType    = filterType   === "tous" || cv.type   === filterType;
    const matchStatus  = filterStatus === "tous" || cv.statut === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  // Compteurs résumés
  const total   = cvHistory.length;
  const generes = cvHistory.filter(c => c.statut === "genere").length;
  const fibem   = cvHistory.filter(c => c.type   === "fibem").length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[780px] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">

        {/* ── En-tête ─────────────────────────────── */}
        <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-br from-primary/5 to-transparent">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Historique des CVs
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
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-bold text-gray-800">{total}</span>
              <span className="text-muted-foreground">CV au total</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-bold text-gray-800">{generes}</span>
              <span className="text-muted-foreground">générés</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-sm">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              <span className="font-bold text-gray-800">{fibem}</span>
              <span className="text-muted-foreground">FIBEM</span>
            </div>
          </div>
        </div>

        {/* ── Filtres ──────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 px-6 py-3 bg-white border-b">
          {/* Recherche */}
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              className="h-8 pl-8 text-sm"
              placeholder="Rechercher un CV…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filtre type */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {[
              { val: "tous",     label: "Tous" },
              { val: "classique",label: "Classique" },
              { val: "fibem",    label: "FIBEM" },
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setFilterType(opt.val)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all
                  ${filterType === opt.val ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Filtre statut */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {[
              { val: "tous",    label: "Tous"       },
              { val: "genere",  label: "Générés"    },
              { val: "en_cours",label: "En cours"   },
              { val: "echoue",  label: "Échoués"    },
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setFilterStatus(opt.val)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all
                  ${filterStatus === opt.val ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Liste ────────────────────────────────── */}
        <div className="flex-1 px-6 py-4 space-y-2 overflow-y-auto bg-gray-50/50">
          {isLoading ? (
            // Squelette de chargement
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[68px] rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            // État vide
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex items-center justify-center mb-3 bg-gray-100 rounded-full w-14 h-14">
                <AlertCircle className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                {cvHistory.length === 0 ? "Aucun CV généré pour cet utilisateur" : "Aucun résultat pour ces filtres"}
              </p>
              {cvHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => { setSearch(""); setFilterType("tous"); setFilterStatus("tous"); }}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            filtered.map((cv, i) => (
              <CvRow
                key={cv.id}
                cv={cv}
                index={i}
                onPreview={onPreviewCV}
                onDownload={onDownloadCV}
                onDelete={onDeleteCV}
                onDuplicate={onDuplicateCV}
              />
            ))
          )}
        </div>

        {/* ── Pied ─────────────────────────────────── */}
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

export default CVHistoryDialog;

// ─────────────────────────────────────────────────────────────────────────────
// EXEMPLE D'UTILISATION dans UserDetailsDialog ou toute page admin :
//
// const [isCvHistoryOpen, setIsCvHistoryOpen] = useState(false);
//
// <Button variant="outline" onClick={() => setIsCvHistoryOpen(true)}>
//   <FileText className="w-4 h-4 mr-2" /> Historique CVs
// </Button>
//
// <CVHistoryDialog
//   isOpen={isCvHistoryOpen}
//   onClose={() => setIsCvHistoryOpen(false)}
//   selectedUser={selectedUser}
//   cvHistory={[
//     {
//       id: "1",
//       titre: "CV Développeur Senior",
//       type: "fibem",        // "fibem" | "classique"
//       statut: "genere",     // "genere" | "en_cours" | "echoue"
//       template: "moderne",
//       dateCreation: "12/03/2025",
//       dateModification: "15/03/2025",
//       url: "https://...",
//     },
//   ]}
//   onPreviewCV={(cv) => window.open(cv.url, "_blank")}
//   onDownloadCV={(cv) => { /* download logic */ }}
//   onDeleteCV={(cv)  => { /* delete logic  */ }}
//   onDuplicateCV={(cv) => { /* duplicate logic */ }}
// />
// ─────────────────────────────────────────────────────────────────────────────