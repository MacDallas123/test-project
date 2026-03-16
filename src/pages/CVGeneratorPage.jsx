import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Eye, FileText, User, Mail, Phone, MapPin,
  Linkedin, Github, Globe, GraduationCap, Briefcase,
  Award, Star, Plus, Trash2, Edit2, CheckCircle, Printer,
  Share2, Save, Loader2, ChevronDown, ChevronUp,
  ChevronLeft, ChevronRight, Info, AlertCircle, Sparkles,
  LayoutTemplate, BookOpen, Languages, FolderOpen,
  Pencil,
  X,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCV, createCV, generateCV,
  selectCurrentCV, selectCVError, selectCVLoading, updateCVById,
} from "@/redux/slices/cvSlice";
import CVHistoryDialog from "@/components/dialog/CvHistoryDialog";
import { useAuth } from "@/hooks/useAuth";

// ─────────────────────────────────────────────
// DONNÉES PAR DÉFAUT
// ─────────────────────────────────────────────
const defaultCvData = {
  personal: {
    firstName: "AAA",
    lastName: "BBB",
    title: "Développeur Full Stack",
    email: "aaa.bbb@email.com",
    phone: "+33 6 12 34 56 78",
    address: "12 rue de Paris",
    city: "Paris",
    postalCode: "75001",
    country: "France",
    linkedin: "linkedin.com/in/aaabbb",
    github: "github.com/aaabbb",
    portfolio: "aaabbb.dev",
    summary: "Développeur full stack passionné avec 5 ans d'expérience dans le développement web et mobile."
  },
  skills: [
    { id: "1", name: "JavaScript", level: "Avancé" },
    { id: "2", name: "React", level: "Avancé" },
    { id: "3", name: "Node.js", level: "Intermédiaire" },
    { id: "4", name: "SQL", level: "Intermédiaire" }
  ],
  education: [
    {
      institution: "Université de Paris",
      degree: "Master Informatique",
      startDate: "2018",
      endDate: "2020",
      location: "Paris, France",
      description: "Spécialisation en développement web et applications mobiles."
    }
  ],
  experience: [
    {
      company: "StartUpWeb",
      position: "Développeur Full Stack",
      startDate: "2021",
      endDate: "Présent",
      location: "Paris, France",
      description: "Conception et développement d'applications web avec React et Node.js."
    },
    {
      company: "AgenceDigital",
      position: "Développeur Frontend",
      startDate: "2019",
      endDate: "2021",
      location: "Paris, France",
      description: "Création d'interfaces utilisateurs réactives en React."
    }
  ],
  projects: [
    {
      name: "Gestionnaire de tâches",
      description: "Application web pour gérer ses tâches quotidiennes.",
      technologies: ["React", "Node.js", "MongoDB"],
      link: "https://github.com/jeandupont/gestionnaire-taches"
    }
  ],
  languages: [
    { name: "Français", level: "Natif" },
    { name: "Anglais", level: "Intermédiaire" }
  ],
  certifications: [
    {
      name: "Certification React avancée",
      issuer: "OpenClassrooms",
      year: "2021"
    }
  ],
  settings: { template: "classic", color: "#3b82f6", font: "Inter", showPhoto: false, photoUrl: "" },
};

// ─────────────────────────────────────────────
// NOTICE D'AIDE — composant réutilisable
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
  const pct = Math.round(((currentStep) / (steps.length - 1)) * 100);

  // Helper for mobile: only show previous, current, and next step
  const getMobileSteps = () => {
    const prevStep = currentStep > 0 ? currentStep - 1 : null;
    const nextStep = currentStep < steps.length - 1 ? currentStep + 1 : null;
    let visible = [];
    if (prevStep !== null) visible.push(prevStep);
    visible.push(currentStep);
    if (nextStep !== null) visible.push(nextStep);
    return visible;
  };

  return (
    <div className="space-y-3">
      {/* Pourcentage + libellé */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          Étape {currentStep + 1} / {steps.length} — <span className="text-primary">{steps[currentStep]?.label}</span>
        </span>
        <span className="font-semibold text-primary">{pct}%</span>
      </div>
      {/* Barre */}
      <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Pastilles cliquables */}
      <div className="flex items-center justify-between">
        {/* Desktop: All steps */}
        <div className="items-center justify-between hidden w-full sm:flex">
          {steps.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onNavigate(i)}
                title={step.label}
                className={`flex flex-col items-center gap-1 group transition-opacity`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                  ${active ? "border-primary bg-primary text-white scale-110 shadow-md shadow-primary/30"
                    : done ? "border-green-500 bg-green-50 text-green-600"
                    : "border-gray-300 bg-white text-gray-400 group-hover:border-primary/50"}`}>
                  {done ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-[10px] font-medium leading-tight text-center
                  ${active ? "text-primary" : done ? "text-green-600" : "text-gray-400"}`}>
                  {step.shortLabel || step.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile: Only prev, current, next */}
        <div className="flex items-center justify-between w-full sm:hidden">
          {getMobileSteps().map((stepIndex, idx) => {
            const step = steps[stepIndex];
            const done = stepIndex < currentStep;
            const active = stepIndex === currentStep;
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onNavigate(stepIndex)}
                title={step.label}
                className={`flex flex-col items-center gap-1 group flex-1 transition-opacity`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                  ${active ? "border-primary bg-primary text-white scale-110 shadow-md shadow-primary/30"
                    : done ? "border-green-500 bg-green-50 text-green-600"
                    : "border-gray-300 bg-white text-gray-400 group-hover:border-primary/50"}`}>
                  {done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-[9px] font-medium leading-tight text-center
                  ${active ? "text-primary" : done ? "text-green-600" : "text-gray-400"}`}>
                  {step.shortLabel || step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────
const CVGeneratorPage = () => {
  const cvRef = useRef();
  const dispatch = useDispatch();
  const selectCurrentCVFS = useSelector(selectCurrentCV);
  const selectLoadingFS   = useSelector(selectCVLoading);
  const [isCvHistoryOpen, setIsCvHistoryOpen] = useState(false);

  const { user } = useAuth();

  // ── État global ──────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [cvType, setCvType] = useState(null); // "classique" | "fibem"

  const [cvData, setCvData] = useState(defaultCvData);
  const [newSkill, setNewSkill] = useState({ name: "", level: "Intermédiaire" });
  const [editingSkill, setEditingSkill] = useState(null);

  // ── Définition des étapes ────────────────────
  // Étape 0 = choix du type ; étapes 1…N = sections
  const STEPS = [
    { id: "type",           label: "Type de CV",     shortLabel: "Type",       icon: LayoutTemplate },
    { id: "personal",       label: "Infos perso.",   shortLabel: "Perso.",     icon: User           },
    { id: "experience",     label: "Expérience",     shortLabel: "Expér.",     icon: Briefcase      },
    { id: "education",      label: "Formation",      shortLabel: "Formation",  icon: GraduationCap  },
    { id: "skills",         label: "Compétences",    shortLabel: "Compét.",    icon: Star           },
    { id: "languages",      label: "Langues",        shortLabel: "Langues",    icon: Languages      },
    { id: "certifications", label: "Certifications", shortLabel: "Certif.",    icon: Award          },
    { id: "projects",       label: "Projets",        shortLabel: "Projets",    icon: FolderOpen     },
    { id: "settings",       label: "Apparence",      shortLabel: "Style",      icon: Edit2          },
    //{ id: "preview",        label: "Aperçu & Export",shortLabel: "Export",     icon: Eye            },
    { id: "preview",        label: "Export",shortLabel: "Export",     icon: Eye            },
  ];

  // ── Helpers état ─────────────────────────────
  const handleInputChange = (section, field, value) =>
    setCvData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

  const handleArrayChange = (section, index, field, value) =>
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? { ...item, [field]: value } : item),
    }));

  const addItem = (section, defaultItem) =>
    setCvData(prev => ({ ...prev, [section]: [...prev[section], { id: Date.now(), ...defaultItem }] }));

  const removeItem = (section, id) =>
    setCvData(prev => ({ ...prev, [section]: prev[section].filter(item => item.id !== id) }));

  const activateSkillEdition = (id) => {
    setEditingSkill(id);
  }

  const deactivateSkillEdition = (id) => {
    setEditingSkill(null);
  }
 
  const moveItem = (section, index, direction) => {
    const items = [...cvData[section]];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < items.length) {
      [items[index], items[newIndex]] = [items[newIndex], items[index]];
      setCvData(prev => ({ ...prev, [section]: items }));
    }
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const maxId = cvData.skills.length > 0 ? Math.max(...cvData.skills.map(skill => typeof skill.id === "number" ? skill.id : 0)) : 0;
      const nextId = maxId + 1;
      addItem("skills", { ...newSkill, id: nextId });
      setNewSkill({ id: nextId + 1, name: "", level: "Intermédiaire" });
    }
  };

  // ── Navigation ───────────────────────────────
  const goNext = () => setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
  const goPrev = () => setCurrentStep(s => Math.max(s - 1, 0));
  //const goTo   = (i) => { if (i <= currentStep + 1) setCurrentStep(i); };
  const goTo   = (i) => { setCurrentStep(i); };

  const canGoNext = () => {
    if (currentStep === 0) return cvType !== null;
    if (currentStep === 1) return cvData.personal.firstName && cvData.personal.lastName && cvData.personal.email;
    return true;
  };

  // ── Génération ───────────────────────────────
  const handleGenerateCV = async () => {
    setIsGenerating(true);
    try {
      cvData.settings.template = cvType;
      const cvPayload = {
        personal: cvData.personal, skills: cvData.skills,
        education: cvData.education, experience: cvData.experience,
        projects: cvData.projects, languages: cvData.languages,
        certifications: cvData.certifications, settings: cvData.settings,
        cvType,
        title: `CV - ${cvData.personal.firstName || ""} ${cvData.personal.lastName || ""}`.trim() || "Nouveau CV",
      };
      let cvId;
      if (selectCurrentCVFS?.id) {
        await dispatch(updateCVById({ id: selectCurrentCVFS.id, data: cvPayload })).unwrap();
        cvId = selectCurrentCVFS.id;
      } else {
        const r = await dispatch(createCV(cvPayload)).unwrap();
        cvId = r.content.id;
      }
      const genResp = await dispatch(generateCV({ id: cvId, format: "pdf" })).unwrap();
      if (genResp.content?.url) window.open(genResp.content.url, "_blank");
      else alert("Le CV a été généré mais le lien n'est pas disponible");
    } catch (err) {
      alert(`Erreur : ${err.message || "Une erreur est survenue lors de la génération du CV"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => cvRef.current,
    documentTitle: `CV_${cvData.personal.firstName}_${cvData.personal.lastName}`,
  });

  // ── Contenu de chaque étape ──────────────────
  const renderStep = () => {
    const stepId = STEPS[currentStep]?.id;

    // ── ÉTAPE 0 : Choix du type de CV ───────────
    if (stepId === "type") return (
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Quel type de CV souhaitez-vous créer ?</h2>
          <p className="text-sm text-muted-foreground">
            Choisissez le format qui correspond le mieux à votre situation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* CV Classique */}
          <button
            type="button"
            onClick={() => setCvType("classique")}
            className={`relative p-6 rounded-2xl border-2 text-left transition-all group hover:shadow-lg
              ${cvType === "classique" ? "border-primary bg-primary/5 shadow-md shadow-primary/20" : "border-gray-200 hover:border-primary/40"}`}
          >
            {cvType === "classique" && (
              <div className="absolute flex items-center justify-center w-6 h-6 rounded-full top-4 right-4 bg-primary">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center
              ${cvType === "classique" ? "bg-primary text-white" : "bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary"}`}>
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold">CV Classique</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Format standard reconnu par tous les recruteurs. Idéal pour les candidatures en entreprise, les secteurs traditionnels ou si vous manquez d'expérience.
            </p>
            <ul className="space-y-1 text-xs text-gray-500">
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Mise en page sobre et professionnelle</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Compatible tous secteurs</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Facilement personnalisable</li>
            </ul>
          </button>

          {/* CV FIBEM */}
          <button
            type="button"
            onClick={() => setCvType("fibem")}
            className={`relative p-6 rounded-2xl border-2 text-left transition-all group hover:shadow-lg
              ${cvType === "fibem" ? "border-primary bg-primary/5 shadow-md shadow-primary/20" : "border-gray-200 hover:border-primary/40"}`}
          >
            {cvType === "fibem" && (
              <div className="absolute flex items-center justify-center w-6 h-6 rounded-full top-4 right-4 bg-primary">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center
              ${cvType === "fibem" ? "bg-primary text-white" : "bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary"}`}>
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold">CV FIBEM</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Format spécifique à la plateforme FIBEM. Optimisé pour les recruteurs utilisant notre système, avec des sections dédiées et un rendu visuel adapté.
            </p>
            <ul className="space-y-1 text-xs text-gray-500">
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Intégration native à FIBEM</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Mise en avant des projets</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500" /> Sections enrichies</li>
            </ul>
          </button>
        </div>

        {!cvType && (
          <div className="flex items-center gap-2 p-3 text-sm border rounded-lg bg-amber-50 border-amber-200 text-amber-700">
            <AlertCircle className="flex-shrink-0 w-4 h-4" />
            Veuillez sélectionner un type de CV pour continuer.
          </div>
        )}

        <HelpNotice
          title="Comment choisir ?"
          variant="info"
          tips={[
            "Le CV Classique convient à toutes les candidatures hors plateforme FIBEM.",
            "Le CV FIBEM est recommandé si l'offre est publiée sur FIBEM.",
            "Vous pourrez toujours changer de type ultérieurement.",
            "Les deux formats supportent photo, couleurs et polices personnalisées.",
          ]}
        />
      </div>
    );

    // ── ÉTAPE 1 : Informations personnelles ─────
    if (stepId === "personal") return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <User className="w-5 h-5 text-primary" /> Informations personnelles
          </h3>
          <Badge variant="secondary">{cvType === "fibem" ? "FIBEM" : "Classique"}</Badge>
        </div>

        <HelpNotice
          title="Que renseigner ici ?"
          tips={[
            "Prénom, nom et email sont obligatoires.",
            "Votre titre professionnel apparaîtra juste sous votre nom (ex : \"Développeur Full Stack Senior\").",
            "Le profil professionnel est un résumé de 2-3 phrases sur votre parcours et objectifs.",
            "Renseignez LinkedIn / GitHub uniquement si vos profils sont à jour.",
          ]}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom <span className="text-red-500">*</span></Label>
            <Input id="firstName" value={cvData.personal.firstName}
              onChange={e => handleInputChange("personal", "firstName", e.target.value)} placeholder="Nom" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom <span className="text-red-500">*</span></Label>
            <Input id="lastName" value={cvData.personal.lastName}
              onChange={e => handleInputChange("personal", "lastName", e.target.value)} placeholder="Prénom" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Titre professionnel</Label>
            <Input id="title" value={cvData.personal.title}
              onChange={e => handleInputChange("personal", "title", e.target.value)}
              placeholder="Ex : Développeur Full Stack Senior" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" value={cvData.personal.email}
                onChange={e => handleInputChange("personal", "email", e.target.value)} placeholder="contact@email.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <Input id="phone" value={cvData.personal.phone}
                onChange={e => handleInputChange("personal", "phone", e.target.value)} placeholder="+33 6 12 34 56 78" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <Input id="city" value={cvData.personal.city}
                onChange={e => handleInputChange("personal", "city", e.target.value)} placeholder="Paris" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Pays</Label>
            <Input id="country" value={cvData.personal.country}
              onChange={e => handleInputChange("personal", "country", e.target.value)} placeholder="France" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-muted-foreground" />
              <Input id="linkedin" value={cvData.personal.linkedin}
                onChange={e => handleInputChange("personal", "linkedin", e.target.value)} placeholder="linkedin.com/in/marie-dupont" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-muted-foreground" />
              <Input id="github" value={cvData.personal.github}
                onChange={e => handleInputChange("personal", "github", e.target.value)} placeholder="github.com/marie-dupont" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="portfolio">Portfolio / Site web</Label>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Input id="portfolio" value={cvData.personal.portfolio}
                onChange={e => handleInputChange("personal", "portfolio", e.target.value)} placeholder="https://marie-dupont.dev" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="summary">Profil professionnel</Label>
            <Textarea id="summary" value={cvData.personal.summary}
              onChange={e => handleInputChange("personal", "summary", e.target.value)}
              placeholder="Développeuse Full Stack avec 5 ans d'expérience en React / Node.js. Passionnée par l'architecture logicielle et l'expérience utilisateur. En recherche d'un poste à fort impact dans une équipe agile."
              rows={4} />
            <p className="text-xs text-muted-foreground">2-3 phrases qui résument votre expérience et vos objectifs</p>
          </div>
        </div>
      </div>
    );

    // ── ÉTAPE 2 : Expérience ─────────────────────
    if (stepId === "experience") return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <Briefcase className="w-5 h-5 text-primary" /> Expérience professionnelle
          </h3>
          <Badge variant="outline">{cvData.experience.length} expérience{cvData.experience.length !== 1 ? "s" : ""}</Badge>
        </div>

        <HelpNotice
          title="Comment valoriser votre expérience ?"
          tips={[
            "Listez vos expériences de la plus récente à la plus ancienne.",
            "Utilisez des verbes d'action : développé, géré, optimisé, coordonné…",
            "Quantifiez vos réalisations : chiffres, pourcentages, délais.",
            "Cochez la case \"En poste\" si vous êtes encore dans l'entreprise.",
            "Une description de 3-5 lignes par poste est idéale.",
          ]}
        />

        <div className="space-y-4">
          {cvData.experience.map((exp, index) => (
            <div key={exp.id} className="p-4 space-y-4 border rounded-xl bg-gray-50/50">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-700">Expérience #{index + 1}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveItem("experience", index, "up")} disabled={index === 0}
                      className="p-1 rounded hover:bg-muted disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button type="button" onClick={() => moveItem("experience", index, "down")} disabled={index === cvData.experience.length - 1}
                      className="p-1 rounded hover:bg-muted disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem("experience", exp.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Poste <span className="text-red-500">*</span></Label>
                  <Input value={exp.title} onChange={e => handleArrayChange("experience", index, "title", e.target.value)} placeholder="Développeur Full Stack" />
                </div>
                <div className="space-y-2">
                  <Label>Entreprise <span className="text-red-500">*</span></Label>
                  <Input value={exp.company} onChange={e => handleArrayChange("experience", index, "company", e.target.value)} placeholder="TechCorp SARL" />
                </div>
                <div className="space-y-2">
                  <Label>Lieu</Label>
                  <Input value={exp.location} onChange={e => handleArrayChange("experience", index, "location", e.target.value)} placeholder="Paris, France" />
                </div>
                <div className="space-y-2">
                  <Label>En poste actuellement</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" checked={exp.current}
                      onChange={e => handleArrayChange("experience", index, "current", e.target.checked)} className="rounded" />
                    <span className="text-sm">Je travaille toujours ici</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date de début <span className="text-red-500">*</span></Label>
                  <Input type="month" value={exp.startDate} onChange={e => handleArrayChange("experience", index, "startDate", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin {!exp.current && <span className="text-red-500">*</span>}</Label>
                  <Input type="month" value={exp.endDate} onChange={e => handleArrayChange("experience", index, "endDate", e.target.value)} disabled={exp.current} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description <span className="text-red-500">*</span></Label>
                  <Textarea value={exp.description} onChange={e => handleArrayChange("experience", index, "description", e.target.value)}
                    placeholder="Missions, responsabilités et réalisations concrètes..." rows={4} />
                  <p className="text-xs text-muted-foreground">Utilisez des verbes d'action et chiffres concrets</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" onClick={() => addItem("experience", { title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" })} className="w-full gap-2 border-dashed">
          <Plus className="w-4 h-4" /> Ajouter une expérience
        </Button>
      </div>
    );

    // ── ÉTAPE 3 : Formation ──────────────────────
    if (stepId === "education") return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <GraduationCap className="w-5 h-5 text-primary" /> Formation
          </h3>
          <Badge variant="outline">{cvData.education.length} formation{cvData.education.length !== 1 ? "s" : ""}</Badge>
        </div>

        <HelpNotice
          title="Conseils pour la section Formation"
          tips={[
            "Listez les diplômes du plus récent au plus ancien.",
            "Indiquez la mention si elle est honorable (Bien, Très Bien).",
            "Pour les jeunes diplômés, la formation peut précéder l'expérience.",
            "Mentionnez les projets académiques marquants dans la description.",
          ]}
        />

        <div className="space-y-4">
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="p-4 space-y-4 border rounded-xl bg-gray-50/50">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-700">Formation #{index + 1}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveItem("education", index, "up")} disabled={index === 0}
                      className="p-1 rounded hover:bg-muted disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button type="button" onClick={() => moveItem("education", index, "down")} disabled={index === cvData.education.length - 1}
                      className="p-1 rounded hover:bg-muted disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem("education", edu.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Diplôme <span className="text-red-500">*</span></Label>
                  <Input value={edu.degree} onChange={e => handleArrayChange("education", index, "degree", e.target.value)} placeholder="Master en Informatique" />
                </div>
                <div className="space-y-2">
                  <Label>Établissement <span className="text-red-500">*</span></Label>
                  <Input value={edu.school} onChange={e => handleArrayChange("education", index, "school", e.target.value)} placeholder="Université de Paris" />
                </div>
                <div className="space-y-2">
                  <Label>Lieu</Label>
                  <Input value={edu.location} onChange={e => handleArrayChange("education", index, "location", e.target.value)} placeholder="Paris, France" />
                </div>
                <div className="space-y-2">
                  <Label>En formation actuellement</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" checked={edu.current}
                      onChange={e => handleArrayChange("education", index, "current", e.target.checked)} className="rounded" />
                    <span className="text-sm">Je suis encore en formation</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Input type="month" value={edu.startDate} onChange={e => handleArrayChange("education", index, "startDate", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Input type="month" value={edu.endDate} onChange={e => handleArrayChange("education", index, "endDate", e.target.value)} disabled={edu.current} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea value={edu.description} onChange={e => handleArrayChange("education", index, "description", e.target.value)}
                    placeholder="Mention, spécialisation, mémoire, projets réalisés..." rows={3} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={() => addItem("education", { degree: "", school: "", location: "", startDate: "", endDate: "", current: false, description: "" })} className="w-full gap-2 border-dashed">
          <Plus className="w-4 h-4" /> Ajouter une formation
        </Button>
      </div>
    );

    // ── ÉTAPE 4 : Compétences ────────────────────
    if (stepId === "skills") return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <Star className="w-5 h-5 text-primary" /> Compétences
          </h3>
          <Badge variant="outline">{cvData.skills.length} compétence{cvData.skills.length !== 1 ? "s" : ""}</Badge>
        </div>

        <HelpNotice
          title="Quelles compétences mettre en avant ?"
          tips={[
            "Privilégiez 8 à 12 compétences bien choisies plutôt qu'une longue liste.",
            "Mixez compétences techniques (hard skills) et transversales (soft skills).",
            "Classez-les par ordre de maîtrise ou de pertinence pour le poste.",
            "Soyez honnête sur les niveaux — les recruteurs vérifient souvent.",
          ]}
        />

        <div className="space-y-3">
          {cvData.skills.map((skill, index) => (
            <div key={skill.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50/50">
              {editingSkill === skill.id ? (
                <>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <Input
                        value={skill.name}
                        onChange={e => handleArrayChange("skills", index, "name", e.target.value)}
                        className="font-medium"
                        placeholder="Nom de la compétence"
                        autoFocus
                      />
                      <select
                        className="px-3 py-2 text-xs border rounded-md w-36"
                        value={skill.level}
                        onChange={e => handleArrayChange("skills", index, "level", e.target.value)}
                      >
                        <option>Débutant</option>
                        <option>Intermédiaire</option>
                        <option>Avancé</option>
                        <option>Expert</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem("skills", index, "up")}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem("skills", index, "down")}
                      disabled={index === cvData.skills.length - 1}
                      className="p-1 rounded hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    // Accept: just ends editing mode
                    onClick={() => deactivateSkillEdition(skill.id)}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  {/* <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                    // Cancel: resets values and ends editing mode
                    onClick={() => {
                      // Optionally, you might want to reset skill fields here using original value if keeping a backup.
                      deactivateSkillEdition(skill.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button> */}
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <Badge variant="secondary" className="text-xs">{skill.level}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveItem("skills", index, "up")} disabled={index === 0}
                      className="p-1 rounded hover:bg-muted disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button type="button" onClick={() => moveItem("skills", index, "down")} disabled={index === cvData.skills.length - 1}
                      className="p-1 rounded hover:bg-muted disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => activateSkillEdition(skill.id)}
                    className="text-orange-400 hover:text-orange-500 hover:bg-orange-50">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeItem("skills", skill.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Ajouter une compétence</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label>Nom</Label>
              <Input value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="Ex : React, Python, Gestion de projet…"
                onKeyDown={e => e.key === "Enter" && addSkill()} />
            </div>
            <div className="space-y-2">
              <Label>Niveau</Label>
              <select className="w-full px-3 py-2 text-sm border rounded-md" value={newSkill.level}
                onChange={e => setNewSkill({ ...newSkill, level: e.target.value })}>
                <option>Débutant</option>
                <option>Intermédiaire</option>
                <option>Avancé</option>
                <option>Expert</option>
              </select>
            </div>
          </div>
          <Button type="button" onClick={addSkill} className="gap-2" disabled={!newSkill.name.trim()}>
            <Plus className="w-4 h-4" /> Ajouter cette compétence
          </Button>
        </div>
      </div>
    );

    // ── ÉTAPE 5 : Langues ───────────────────────
    if (stepId === "languages") return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <Globe className="w-5 h-5 text-primary" /> Langues
          </h3>
          <Badge variant="outline">{cvData.languages.length} langue{cvData.languages.length !== 1 ? "s" : ""}</Badge>
        </div>

        <HelpNotice
          title="Comment renseigner les langues ?"
          tips={[
            "Indiquez le niveau CECRL si possible : A1, A2, B1, B2, C1, C2.",
            "\"Langue maternelle\" s'écrit toujours en premier.",
            "Ne mentez pas sur le niveau — vous serez testé en entretien.",
            "Précisez \"Langue professionnelle\" si vous travaillez dans cette langue.",
          ]}
        />

        <div className="space-y-3">
          {cvData.languages.map((lang, index) => (
            <div key={lang.id} className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50/50">
              <div className="grid flex-1 grid-cols-2 gap-3">
                <Input value={lang.name} onChange={e => handleArrayChange("languages", index, "name", e.target.value)} placeholder="Français" />
                <select className="w-full px-3 py-2 text-sm border rounded-md" value={lang.level}
                  onChange={e => handleArrayChange("languages", index, "level", e.target.value)}>
                  <option>Langue maternelle</option>
                  <option>Courant (C1/C2)</option>
                  <option>Avancé (B2)</option>
                  <option>Intermédiaire (B1)</option>
                  <option>Débutant (A1/A2)</option>
                  <option>Notions</option>
                </select>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeItem("languages", lang.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" onClick={() => addItem("languages", { name: "", level: "Intermédiaire (B1)" })} className="w-full gap-2 border-dashed">
          <Plus className="w-4 h-4" /> Ajouter une langue
        </Button>
      </div>
    );

    // ── ÉTAPE 6 : Certifications ─────────────────
    if (stepId === "certifications") return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <Award className="w-5 h-5 text-primary" /> Certifications
          </h3>
          <Badge variant="outline">{cvData.certifications.length} certification{cvData.certifications.length !== 1 ? "s" : ""}</Badge>
        </div>

        <HelpNotice
          title="Quelles certifications inclure ?"
          tips={[
            "Priorisez les certifications reconnues dans votre secteur.",
            "Indiquez l'organisme émetteur (AWS, Google, PMI…).",
            "Si la certification est expirée, mentionnez-le entre parenthèses.",
            "Les certifications récentes (< 3 ans) ont plus de valeur.",
          ]}
        />

        <div className="space-y-3">
          {cvData.certifications.map((cert, index) => (
            <div key={cert.id} className="p-4 space-y-3 border rounded-xl bg-gray-50/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Certification #{index + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem("certifications", cert.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-xs">Nom de la certification</Label>
                  <Input value={cert.name} onChange={e => handleArrayChange("certifications", index, "name", e.target.value)} placeholder="AWS Certified Developer" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Année</Label>
                  <Input value={cert.date} onChange={e => handleArrayChange("certifications", index, "date", e.target.value)} placeholder="2024" />
                </div>
                <div className="space-y-1 md:col-span-3">
                  <Label className="text-xs">Organisme émetteur</Label>
                  <Input value={cert.issuer} onChange={e => handleArrayChange("certifications", index, "issuer", e.target.value)} placeholder="Amazon Web Services" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" onClick={() => addItem("certifications", { name: "", issuer: "", date: "" })} className="w-full gap-2 border-dashed">
          <Plus className="w-4 h-4" /> Ajouter une certification
        </Button>
      </div>
    );

    // ── ÉTAPE 7 : Projets ────────────────────────
    if (stepId === "projects") return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <FolderOpen className="w-5 h-5 text-primary" /> Projets
          </h3>
          <Badge variant="outline">{cvData.projects.length} projet{cvData.projects.length !== 1 ? "s" : ""}</Badge>
        </div>

        <HelpNotice
          title="Quels projets mentionner ?"
          tips={[
            "Projets personnels, open source, académiques ou associatifs sont les bienvenus.",
            "Indiquez les technologies utilisées — c'est très utile pour les recruteurs tech.",
            "Ajoutez un lien GitHub ou démo si disponible.",
            "Décrivez le problème résolu et votre rôle dans le projet.",
          ]}
        />

        <div className="space-y-4">
          {cvData.projects.map((project, index) => (
            <div key={project.id} className="p-4 space-y-3 border rounded-xl bg-gray-50/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Projet #{index + 1}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeItem("projects", project.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-xs">Nom du projet</Label>
                  <Input value={project.name} onChange={e => handleArrayChange("projects", index, "name", e.target.value)} placeholder="Application de gestion de tâches" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-xs">Description</Label>
                  <Textarea value={project.description} onChange={e => handleArrayChange("projects", index, "description", e.target.value)}
                    placeholder="Décrivez le projet, votre rôle et les résultats obtenus..." rows={3} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Technologies (séparées par des virgules)</Label>
                  <Input
                    value={Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies}
                    onChange={e => handleArrayChange("projects", index, "technologies", e.target.value.split(",").map(t => t.trim()))}
                    placeholder="React, Node.js, MongoDB" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Lien (GitHub, démo…)</Label>
                  <Input value={project.link} onChange={e => handleArrayChange("projects", index, "link", e.target.value)} placeholder="https://github.com/user/project" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" onClick={() => addItem("projects", { name: "", description: "", technologies: [], link: "" })} className="w-full gap-2 border-dashed">
          <Plus className="w-4 h-4" /> Ajouter un projet
        </Button>
      </div>
    );

    // ── ÉTAPE 8 : Apparence ──────────────────────
    if (stepId === "settings") return (
      <div className="space-y-6">
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          <Edit2 className="w-5 h-5 text-primary" /> Apparence du CV
        </h3>

        <HelpNotice
          title="Conseils de mise en page"
          tips={[
            "Choisissez un modèle adapté à votre secteur : moderne pour la tech, classique pour la finance ou le droit.",
            "La couleur principale doit rester sobre : bleu, gris, vert foncé…",
            "Évitez les polices fantaisie — elles nuisent à la lisibilité.",
            "La photo n'est pas obligatoire et peut être source de discrimination dans certains pays.",
            "Ciblez 1 à 2 pages maximum pour la plupart des profils.",
          ]}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Modèle de CV</Label>
              {/* <div className="grid grid-cols-2 gap-3">
                {["moderne", "classique", "créatif", "minimaliste"].map(template => (
                  <button key={template} type="button" onClick={() => handleInputChange("settings", "template", template)}
                    className={`p-4 border rounded-lg text-center transition-colors ${cvData.settings.template === template ? "border-primary bg-primary/10" : "hover:border-primary/50"}`}>
                    <div className="mb-2 text-sm font-medium capitalize">{template}</div>
                    <div className="w-3/4 h-1 mx-auto mb-1 rounded bg-primary/30"></div>
                    <div className="w-2/3 h-1 mx-auto mb-1 rounded bg-primary/20"></div>
                    <div className="w-1/2 h-1 mx-auto rounded bg-primary/10"></div>
                  </button>
                ))}
              </div> */}
            </div>

            <div className="space-y-2">
              <Label>Couleur principale</Label>
              <div className="flex items-center gap-4">
                <input type="color" value={cvData.settings.color}
                  onChange={e => handleInputChange("settings", "color", e.target.value)} className="w-12 h-12 border rounded-lg cursor-pointer" />
                <Input value={cvData.settings.color} onChange={e => handleInputChange("settings", "color", e.target.value)} placeholder="#3b82f6" />
              </div>
              <div className="flex flex-wrap gap-2">
                {["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#0f172a", "#0e7490"].map(color => (
                  <button key={color} type="button" onClick={() => handleInputChange("settings", "color", color)}
                    className={`w-8 h-8 border-2 rounded-full transition-transform hover:scale-110 ${cvData.settings.color === color ? "border-gray-800 scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Police de caractères</Label>
              <select className="w-full px-3 py-2 border rounded-md" value={cvData.settings.font}
                onChange={e => handleInputChange("settings", "font", e.target.value)}>
                <option value="Inter">Inter (Moderne)</option>
                <option value="Roboto">Roboto (Neutre)</option>
                <option value="Open Sans">Open Sans (Lisible)</option>
                <option value="Merriweather">Merriweather (Classique)</option>
                <option value="Montserrat">Montserrat (Élégant)</option>
              </select>
            </div>

            <div className="space-y-3">
              <Label>Photo de profil</Label>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="showPhoto" checked={cvData.settings.showPhoto}
                  onChange={e => handleInputChange("settings", "showPhoto", e.target.checked)} className="rounded" />
                <Label htmlFor="showPhoto" className="!mb-0 font-normal">Inclure une photo professionnelle</Label>
              </div>
              {cvData.settings.showPhoto && (
                <div className="mt-2 space-y-2">
                  <Input type="file" accept="image/*" onChange={e => {
                    if (e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = ev => handleInputChange("settings", "photoUrl", ev.target.result);
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }} />
                  <p className="text-xs text-muted-foreground">Photo professionnelle recommandée (format carré, fond neutre)</p>
                  {cvData.settings.photoUrl && (
                    <img src={cvData.settings.photoUrl} alt="Aperçu" className="object-cover w-20 h-20 border-2 border-gray-200 rounded-full" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    // ── ÉTAPE 9 : Aperçu & Export ────────────────
    if (stepId === "preview") return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            {/* <Eye className="w-5 h-5 text-primary" /> Aperçu & Export */}
            <Eye className="w-5 h-5 text-primary" /> Export
          </h3>
          <div className="flex items-center gap-2">
            {/* <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" /> Imprimer
            </Button> */}
            {/* <Button variant="default" size="sm" onClick={handleGenerateCV} disabled={isGenerating} className="gap-2">
              {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Génération…</> : <><Download className="w-4 h-4" /> Télécharger PDF</>}
            </Button> */}
          </div>
        </div>

        {/* <HelpNotice
          title="Avant de télécharger votre CV…"
          variant="success"
          tips={[
            "Vérifiez que toutes les informations sont correctes et à jour.",
            "Assurez-vous que les dates sont cohérentes.",
            "Relisez l'orthographe et la grammaire soigneusement.",
            "Adaptez le profil professionnel à chaque candidature.",
            "Le fichier PDF sera optimisé pour l'impression A4.",
          ]}
        />

        <div className="overflow-hidden border shadow-sm rounded-xl">
          {renderCVPreview()}
        </div> */}

        <div className="flex items-center justify-center p-4 overflow-hidden border rounded-xl">
          <span className="mr-4 text-gray-500">Le document est prêt à être généré</span>

          <Button variant="default" size="sm" onClick={handleGenerateCV} disabled={isGenerating} className="gap-2">
              {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Génération…</> : <><Download className="w-4 h-4" /> Générer le PDF</>}
            </Button>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {/* <Button variant="outline" className="gap-2">
            <Save className="w-4 h-4" /> Sauvegarder le modèle
          </Button> */}
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" /> Partager
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setIsCvHistoryOpen(true)}>
            <BookOpen className="w-4 h-4" /> Historique de CV
          </Button>
          <Button variant="ghost" onClick={() => {
            dispatch(clearCV());
            setCvData(defaultCvData);
            setCvType(null);
            setCurrentStep(0);
          }} className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" /> Recommencer
          </Button>
        </div>
      </div>
    );

    return null;
  };

  // ── Aperçu CV ────────────────────────────────
  const renderCVPreview = () => {
    const { personal, skills, experience, education, languages, certifications, projects, settings } = cvData;
    const fullName = `${personal.firstName} ${personal.lastName}`.trim();
    return (
      <div ref={cvRef} className="max-w-4xl p-8 mx-auto text-gray-800 bg-white" style={{ fontFamily: settings.font }}>
        {/* En-tête */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-1 text-3xl font-bold" style={{ color: settings.color }}>{fullName || "Votre Nom"}</h1>
              {personal.title && <h2 className="mb-3 text-xl text-gray-600">{personal.title}</h2>}
              {personal.summary && <p className="mb-4 text-sm leading-relaxed text-gray-700">{personal.summary}</p>}
            </div>
            {settings.showPhoto && settings.photoUrl && (
              <div className="ml-6">
                <div className="w-24 h-24 overflow-hidden border-2 border-gray-200 rounded-full">
                  <img src={settings.photoUrl} alt={fullName} className="object-cover w-full h-full" />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {personal.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" style={{ color: settings.color }} />{personal.email}</span>}
            {personal.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" style={{ color: settings.color }} />{personal.phone}</span>}
            {personal.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" style={{ color: settings.color }} />{personal.city}, {personal.country}</span>}
            {personal.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3.5 h-3.5" style={{ color: settings.color }} />LinkedIn</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {experience.length > 0 && (
              <div>
                <h3 className="pb-1 mb-3 text-base font-bold border-b" style={{ borderColor: settings.color, color: settings.color }}>Expérience Professionnelle</h3>
                <div className="space-y-4">
                  {experience.map((exp, i) => (
                    <div key={i} className="pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h4 className="text-sm font-bold">{exp.title}</h4>
                          <div className="text-xs font-medium text-gray-600">{exp.company}{exp.location && ` — ${exp.location}`}</div>
                        </div>
                        <div className="ml-2 text-xs text-gray-500 whitespace-nowrap">{exp.startDate} – {exp.current ? "Présent" : exp.endDate}</div>
                      </div>
                      <p className="text-xs leading-relaxed text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {education.length > 0 && (
              <div>
                <h3 className="pb-1 mb-3 text-base font-bold border-b" style={{ borderColor: settings.color, color: settings.color }}>Formation</h3>
                <div className="space-y-3">
                  {education.map((edu, i) => (
                    <div key={i} className="pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold">{edu.degree}</h4>
                          <div className="text-xs text-gray-600">{edu.school}{edu.location && ` — ${edu.location}`}</div>
                          {edu.description && <p className="text-xs text-gray-500 mt-0.5">{edu.description}</p>}
                        </div>
                        <div className="ml-2 text-xs text-gray-500 whitespace-nowrap">{edu.startDate} – {edu.current ? "Présent" : edu.endDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {projects.length > 0 && (
              <div>
                <h3 className="pb-1 mb-3 text-base font-bold border-b" style={{ borderColor: settings.color, color: settings.color }}>Projets</h3>
                <div className="space-y-3">
                  {projects.map((p, i) => (
                    <div key={i} className="text-xs">
                      <span className="font-bold">{p.name}</span>
                      {p.technologies?.length > 0 && <span className="text-gray-500"> — {p.technologies.join(", ")}</span>}
                      {p.description && <p className="text-gray-700 mt-0.5">{p.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {skills.length > 0 && (
              <div>
                <h3 className="pb-1 mb-3 text-base font-bold border-b" style={{ borderColor: settings.color, color: settings.color }}>Compétences</h3>
                <div className="space-y-1">
                  {skills.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-gray-500">{s.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {languages.length > 0 && (
              <div>
                <h3 className="pb-1 mb-3 text-base font-bold border-b" style={{ borderColor: settings.color, color: settings.color }}>Langues</h3>
                <div className="space-y-1">
                  {languages.map((l, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="font-medium">{l.name}</span>
                      <span className="text-gray-500">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {certifications.length > 0 && (
              <div>
                <h3 className="pb-1 mb-3 text-base font-bold border-b" style={{ borderColor: settings.color, color: settings.color }}>Certifications</h3>
                <div className="space-y-2">
                  {certifications.map((c, i) => (
                    <div key={i} className="text-xs">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-gray-500">{c.issuer} {c.date && `· ${c.date}`}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 mt-6 text-xs text-center text-gray-400 border-t border-gray-100">
          CV {cvType === "fibem" ? "FIBEM" : "Classique"} — Généré le {new Date().toLocaleDateString("fr-FR")}
        </div>
      </div>
    );
  };

  // ── RENDU PRINCIPAL ──────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-white">
        <div className="container px-4 py-10 mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-4 rounded-full w-14 h-14 bg-primary/10">
              <FileText className="w-7 h-7 text-primary" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Générateur de CV</h1>
            <p className="text-sm text-gray-500">Créez un CV professionnel en quelques étapes guidées</p>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-5xl px-4 py-8 mx-auto">
        {/* Barre de progression */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 mb-8 bg-white border shadow-sm rounded-2xl">
          <ProgressBar steps={STEPS} currentStep={currentStep} onNavigate={goTo} />
        </motion.div>

        {/* Navigation Précédent / Suivant */}
        <div className="flex flex-row items-center justify-between gap-2 mt-6 mb-6">
          <div className="flex flex-col gap-2 mt-2">
            <Button type="button" variant="outline" onClick={() => setIsCvHistoryOpen(true)}>
              <BookOpen className="w-4 h-4" /> Historique des CV
            </Button>

            <Button type="button" variant="outline" onClick={goPrev} disabled={currentStep === 0} className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Précédent
            </Button>

          </div>

          <div className="hidden text-xs text-muted-foreground sm:block">
            {currentStep + 1} / {STEPS.length}
          </div>

          {currentStep < STEPS.length - 1 ? (
            <div className="flex flex-col gap-2 mt-2">
              <Button type="button" onClick={handleGenerateCV} disabled={isGenerating} className="gap-2">
                {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Génération…</> : <><Download className="w-4 h-4" /> Générer le CV</>}
              </Button>

              <Button type="button" onClick={goNext} disabled={!canGoNext()} className="gap-2">
                Suivant <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={handleGenerateCV} disabled={isGenerating} className="gap-2">
              {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Génération…</> : <><Download className="w-4 h-4" /> Générer le CV</>}
            </Button>
          )}
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
        
        <div className="flex flex-row items-center justify-between gap-2 mt-6 mb-6">
          <div className="flex flex-col gap-2 mt-2">
            <Button type="button" variant="outline" onClick={() => setIsCvHistoryOpen(true)}>
              <BookOpen className="w-4 h-4" /> Historique des CV
            </Button>

            <Button type="button" variant="outline" onClick={goPrev} disabled={currentStep === 0} className="gap-2">
              <ChevronLeft className="w-4 h-4" /> Précédent
            </Button>

          </div>

          <div className="hidden text-xs text-muted-foreground sm:block">
            {currentStep + 1} / {STEPS.length}
          </div>

          {currentStep < STEPS.length - 1 ? (
            <div className="flex flex-col gap-2 mt-2">
              <Button type="button" onClick={handleGenerateCV} disabled={isGenerating} className="gap-2">
                {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Génération…</> : <><Download className="w-4 h-4" /> Générer le CV</>}
              </Button>

              <Button type="button" onClick={goNext} disabled={!canGoNext()} className="gap-2">
                Suivant <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={handleGenerateCV} disabled={isGenerating} className="gap-2">
              {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Génération…</> : <><Download className="w-4 h-4" /> Générer le CV</>}
            </Button>
          )}
        </div>
        
        {/* Conseils généraux (toujours visible sauf aperçu final) */}
        {STEPS[currentStep]?.id !== "preview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 mt-8 border rounded-xl bg-muted/30">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="mb-2 text-sm font-semibold">Conseils pour un CV efficace</h4>
                <ul className="grid grid-cols-1 gap-1 text-xs text-muted-foreground md:grid-cols-2">
                  <li>• Soyez concis et pertinent — maximum 2 pages</li>
                  <li>• Adaptez votre CV à chaque candidature</li>
                  <li>• Utilisez des mots-clés du secteur visé</li>
                  <li>• Vérifiez l'orthographe et la grammaire</li>
                  <li>• Mettez en avant vos réalisations chiffrées</li>
                  <li>• Gardez une mise en page aérée et professionnelle</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <CVHistoryDialog
        isOpen={isCvHistoryOpen}
        onClose={() => setIsCvHistoryOpen(false)}
        selectedUser={user}
        cvHistory={[
          {
            id: "1",
            titre: "CV Développeur Senior",
            type: "fibem",        // "fibem" | "classique"
            statut: "genere",     // "genere" | "en_cours" | "echoue"
            template: "moderne",
            dateCreation: "12/03/2025",
            dateModification: "15/03/2025",
            url: "https://...",
          },
        ]}
        onPreviewCV={(cv) => window.open(cv.url, "_blank")}
        onDownloadCV={(cv) => { /* download logic */ }}
        onDeleteCV={(cv)  => { /* delete logic  */ }}
        onDuplicateCV={(cv) => { /* duplicate logic */ }}
      />
    </div>
  );
};

export default CVGeneratorPage;