// CVGeneratorPage.jsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Eye,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  GraduationCap,
  Briefcase,
  Award,
  Star,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Printer,
  Share2,
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";

const CVGeneratorPage = () => {
  const cvRef = useRef();
  const [activeSection, setActiveSection] = useState("personal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // États pour le CV
  const [cvData, setCvData] = useState({
    // Informations personnelles
    personal: {
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "France",
      linkedin: "",
      github: "",
      portfolio: "",
      summary: "",
    },
    
    // Compétences
    skills: [
      { id: 1, name: "React", level: "Expert" },
      { id: 2, name: "TypeScript", level: "Avancé" },
      { id: 3, name: "Node.js", level: "Avancé" },
      { id: 4, name: "UI/UX Design", level: "Intermédiaire" },
    ],
    
    // Formation
    education: [
      {
        id: 1,
        degree: "Master en Informatique",
        school: "Université Paris-Saclay",
        location: "Paris, France",
        startDate: "2018-09",
        endDate: "2020-06",
        current: false,
        description: "Spécialisation en développement web et intelligence artificielle",
      },
      {
        id: 2,
        degree: "Licence en Mathématiques",
        school: "Université Paris-Diderot",
        location: "Paris, France",
        startDate: "2015-09",
        endDate: "2018-06",
        current: false,
        description: "Mention Bien",
      },
    ],
    
    // Expérience professionnelle
    experience: [
      {
        id: 1,
        title: "Développeur Full Stack Senior",
        company: "TechSolutions Inc.",
        location: "Paris, France",
        startDate: "2021-03",
        endDate: "",
        current: true,
        description: "Développement d'applications web React/Node.js. Gestion d'équipe de 3 développeurs. Architecture et déploiement sur AWS.",
      },
      {
        id: 2,
        title: "Développeur Frontend",
        company: "DigitalAgency",
        location: "Lyon, France",
        startDate: "2020-07",
        endDate: "2021-02",
        current: false,
        description: "Création d'interfaces utilisateur responsive. Collaboration avec les designers UX/UI. Optimisation des performances.",
      },
    ],
    
    // Projets
    projects: [
      {
        id: 1,
        name: "Plateforme E-commerce",
        description: "Développement d'une plateforme e-commerce avec React et Node.js",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        link: "https://github.com/user/ecommerce",
      },
      {
        id: 2,
        name: "Application de Gestion",
        description: "Application web de gestion de tâches en temps réel",
        technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
        link: "https://github.com/user/task-manager",
      },
    ],
    
    // Langues
    languages: [
      { id: 1, name: "Français", level: "Langue maternelle" },
      { id: 2, name: "Anglais", level: "Courant (C1)" },
      { id: 3, name: "Espagnol", level: "Intermédiaire (B1)" },
    ],
    
    // Certifications
    certifications: [
      { id: 1, name: "AWS Certified Developer", issuer: "Amazon Web Services", date: "2022" },
      { id: 2, name: "React Advanced Patterns", issuer: "Frontend Masters", date: "2021" },
    ],
    
    // Paramètres du CV
    settings: {
      template: "modern",
      color: "#3b82f6",
      font: "Inter",
      showPhoto: false,
      photoUrl: "",
    },
  });

  // Gestion des changements
  const handleInputChange = (section, field, value) => {
    setCvData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = (section, defaultItem) => {
    setCvData(prev => ({
      ...prev,
      [section]: [...prev[section], { id: Date.now(), ...defaultItem }]
    }));
  };

  const removeItem = (section, id) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const moveItem = (section, index, direction) => {
    const items = [...cvData[section]];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < items.length) {
      [items[index], items[newIndex]] = [items[newIndex], items[index]];
      setCvData(prev => ({
        ...prev,
        [section]: items
      }));
    }
  };

  // Ajouter une compétence
  const [newSkill, setNewSkill] = useState({ name: "", level: "Intermédiaire" });
  const addSkill = () => {
    if (newSkill.name.trim()) {
      addItem('skills', newSkill);
      setNewSkill({ name: "", level: "Intermédiaire" });
    }
  };

  // Génération du CV
  const handleGenerateCV = async () => {
    setIsGenerating(true);
    // Simulation de génération
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
    setPreviewMode(true);
  };

  // Téléchargement PDF
  const handlePrint = useReactToPrint({
    content: () => cvRef.current,
    documentTitle: `CV_${cvData.personal.firstName}_${cvData.personal.lastName}`,
  });

  const handleDownloadPDF = () => {
    handlePrint();
  };

  // Sections du formulaire
  const sections = [
    { id: "personal", name: "Informations personnelles", icon: User },
    { id: "skills", name: "Compétences", icon: Star },
    { id: "experience", name: "Expérience", icon: Briefcase },
    { id: "education", name: "Formation", icon: GraduationCap },
    { id: "projects", name: "Projets", icon: FileText },
    { id: "languages", name: "Langues", icon: Globe },
    { id: "certifications", name: "Certifications", icon: Award },
    { id: "settings", name: "Apparence", icon: Edit2 },
  ];

  // Rendu de la section active
  const renderActiveSection = () => {
    switch(activeSection) {
      case "personal":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Informations personnelles</h3>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={cvData.personal.firstName}
                  onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                  placeholder="Jean"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={cvData.personal.lastName}
                  onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                  placeholder="Dupont"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Titre professionnel</Label>
                <Input
                  id="title"
                  value={cvData.personal.title}
                  onChange={(e) => handleInputChange('personal', 'title', e.target.value)}
                  placeholder="Ex: Développeur Full Stack Senior"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={cvData.personal.email}
                    onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                    placeholder="jean.dupont@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={cvData.personal.phone}
                    onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="city"
                    value={cvData.personal.city}
                    onChange={(e) => handleInputChange('personal', 'city', e.target.value)}
                    placeholder="Paris"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  value={cvData.personal.country}
                  onChange={(e) => handleInputChange('personal', 'country', e.target.value)}
                  placeholder="France"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <Input
                    id="linkedin"
                    value={cvData.personal.linkedin}
                    onChange={(e) => handleInputChange('personal', 'linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/jeandupont"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <Input
                    id="github"
                    value={cvData.personal.github}
                    onChange={(e) => handleInputChange('personal', 'github', e.target.value)}
                    placeholder="https://github.com/jeandupont"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="portfolio">Portfolio / Site web</Label>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <Input
                    id="portfolio"
                    value={cvData.personal.portfolio}
                    onChange={(e) => handleInputChange('personal', 'portfolio', e.target.value)}
                    placeholder="https://jeandupont.dev"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="summary">Profil professionnel</Label>
                <Textarea
                  id="summary"
                  value={cvData.personal.summary}
                  onChange={(e) => handleInputChange('personal', 'summary', e.target.value)}
                  placeholder="Décrivez votre profil professionnel en quelques lignes..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  2-3 phrases qui résument votre expérience et vos objectifs
                </p>
              </div>
            </div>
          </div>
        );

      case "skills":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Compétences</h3>
              <Badge variant="outline">{cvData.skills.length} compétences</Badge>
            </div>

            <div className="space-y-4">
              {cvData.skills.map((skill, index) => (
                <div key={skill.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <Badge variant="secondary">{skill.level}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveItem('skills', index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem('skills', index, 'down')}
                        disabled={index === cvData.skills.length - 1}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem('skills', skill.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Ajouter une compétence</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom de la compétence</Label>
                  <Input
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                    placeholder="Ex: React, Python, Gestion de projet..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Niveau</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                  >
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
              <Button type="button" onClick={addSkill} className="gap-2">
                <Plus className="w-4 h-4" />
                Ajouter cette compétence
              </Button>
            </div>

            <div className="p-4 border rounded-lg bg-muted/30">
              <h4 className="mb-2 font-medium">Conseils</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Mettez en avant les compétences pertinentes pour le poste visé</li>
                <li>• Privilégiez 8-12 compétences principales</li>
                <li>• Classez-les par ordre de maîtrise ou pertinence</li>
                <li>• Incluez des compétences techniques et transversales</li>
              </ul>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Expérience professionnelle</h3>
              <Badge variant="outline">{cvData.experience.length} expériences</Badge>
            </div>

            <div className="space-y-4">
              {cvData.experience.map((exp, index) => (
                <div key={exp.id} className="p-4 space-y-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Expérience #{index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveItem('experience', index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-muted disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem('experience', index, 'down')}
                          disabled={index === cvData.experience.length - 1}
                          className="p-1 rounded hover:bg-muted disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem('experience', exp.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Poste *</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)}
                        placeholder="Ex: Développeur Full Stack"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Entreprise *</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                        placeholder="Nom de l'entreprise"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Lieu</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => handleArrayChange('experience', index, 'location', e.target.value)}
                        placeholder="Ex: Paris, France"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Actuellement en poste</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => handleArrayChange('experience', index, 'current', e.target.checked)}
                          className="rounded"
                        />
                        <Label className="!mb-0">Je travaille toujours ici</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Date de début *</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Date de fin {!exp.current && '*'}</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                        disabled={exp.current}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Description *</Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                        placeholder="Décrivez vos missions, responsabilités et réalisations..."
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Utilisez des verbes d'action et des chiffres concrets
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => addItem('experience', {
                title: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
              })}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter une expérience
            </Button>
          </div>
        );

      case "education":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Formation</h3>
              <Badge variant="outline">{cvData.education.length} formations</Badge>
            </div>

            <div className="space-y-4">
              {cvData.education.map((edu, index) => (
                <div key={edu.id} className="p-4 space-y-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Formation #{index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveItem('education', index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-muted disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem('education', index, 'down')}
                          disabled={index === cvData.education.length - 1}
                          className="p-1 rounded hover:bg-muted disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem('education', edu.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Diplôme *</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                        placeholder="Ex: Master en Informatique"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Établissement *</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)}
                        placeholder="Ex: Université Paris-Saclay"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Lieu</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => handleArrayChange('education', index, 'location', e.target.value)}
                        placeholder="Ex: Paris, France"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Actuellement en cours</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) => handleArrayChange('education', index, 'current', e.target.checked)}
                          className="rounded"
                        />
                        <Label className="!mb-0">Formation en cours</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Date de début *</Label>
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Date de fin {!edu.current && '*'}</Label>
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)}
                        disabled={edu.current}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={edu.description}
                        onChange={(e) => handleArrayChange('education', index, 'description', e.target.value)}
                        placeholder="Mention, spécialisation, projets réalisés..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => addItem('education', {
                degree: "",
                school: "",
                location: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
              })}
              className="w-full gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter une formation
            </Button>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Apparence du CV</h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Modèle de CV</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["moderne", "classique", "créatif", "minimaliste"].map((template) => (
                      <button
                        key={template}
                        type="button"
                        onClick={() => handleInputChange('settings', 'template', template)}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          cvData.settings.template === template
                            ? "border-primary bg-primary/10"
                            : "hover:border-primary/50"
                        }`}
                      >
                        <div className="mb-2 text-sm font-medium capitalize">{template}</div>
                        <div className="w-3/4 h-1 mx-auto mb-1 rounded bg-primary/30"></div>
                        <div className="w-2/3 h-1 mx-auto mb-1 rounded bg-primary/20"></div>
                        <div className="w-1/2 h-1 mx-auto rounded bg-primary/10"></div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Couleur principale</Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={cvData.settings.color}
                      onChange={(e) => handleInputChange('settings', 'color', e.target.value)}
                      className="w-12 h-12 cursor-pointer"
                    />
                    <div className="flex-1">
                      <Input
                        value={cvData.settings.color}
                        onChange={(e) => handleInputChange('settings', 'color', e.target.value)}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleInputChange('settings', 'color', color)}
                        className="w-8 h-8 border rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Police de caractères</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={cvData.settings.font}
                    onChange={(e) => handleInputChange('settings', 'font', e.target.value)}
                  >
                    <option value="Inter">Inter (Moderne)</option>
                    <option value="Roboto">Roboto (Neutre)</option>
                    <option value="Open Sans">Open Sans (Lisible)</option>
                    <option value="Merriweather">Merriweather (Classique)</option>
                    <option value="Montserrat">Montserrat (Élégant)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Photo de profil</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="showPhoto"
                      checked={cvData.settings.showPhoto}
                      onChange={(e) => handleInputChange('settings', 'showPhoto', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="showPhoto" className="!mb-0">
                      Inclure une photo
                    </Label>
                  </div>
                  
                  {cvData.settings.showPhoto && (
                    <div className="mt-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              handleInputChange('settings', 'photoUrl', event.target.result);
                            };
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Photo professionnelle recommandée (format carré)
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="mb-2 font-medium">Conseils de mise en page</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Choisissez un modèle adapté à votre secteur</li>
                    <li>• Privilégiez la lisibilité</li>
                    <li>• Limitez le CV à 1-2 pages maximum</li>
                    <li>• Utilisez des espaces blancs pour aérer</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold capitalize">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h3>
            <p className="text-muted-foreground">
              Section en cours de développement
            </p>
          </div>
        );
    }
  };

  // Rendu du CV
  const renderCVPreview = () => {
    const { personal, skills, experience, education, languages, certifications, projects, settings } = cvData;
    const fullName = `${personal.firstName} ${personal.lastName}`.trim();

    return (
      <div 
        ref={cvRef}
        className="max-w-4xl p-8 mx-auto text-gray-800 bg-white border shadow-sm"
        style={{ fontFamily: settings.font }}
      >
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold" style={{ color: settings.color }}>
                {fullName || "Votre Nom"}
              </h1>
              {personal.title && (
                <h2 className="mb-4 text-xl text-gray-600">{personal.title}</h2>
              )}
              
              {personal.summary && (
                <p className="mb-4 text-gray-700">{personal.summary}</p>
              )}
            </div>
            
            {settings.showPhoto && settings.photoUrl && (
              <div className="ml-6">
                <div className="w-24 h-24 overflow-hidden border-2 border-gray-200 rounded-full">
                  <img 
                    src={settings.photoUrl} 
                    alt={fullName}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Coordonnées */}
          <div className="flex flex-wrap gap-4 text-sm">
            {personal.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" style={{ color: settings.color }} />
                <span>{personal.email}</span>
              </div>
            )}
            {personal.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" style={{ color: settings.color }} />
                <span>{personal.phone}</span>
              </div>
            )}
            {personal.city && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: settings.color }} />
                <span>{personal.city}, {personal.country}</span>
              </div>
            )}
            {personal.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" style={{ color: settings.color }} />
                <span>LinkedIn</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Colonne gauche */}
          <div className="space-y-8 lg:col-span-2">
            {/* Expérience */}
            {experience.length > 0 && (
              <div>
                <h3 className="pb-2 mb-4 text-xl font-bold border-b" style={{ borderColor: settings.color, color: settings.color }}>
                  Expérience Professionnelle
                </h3>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-bold">{exp.title}</h4>
                          <div className="font-medium text-gray-600">{exp.company}</div>
                          {exp.location && <div className="text-sm text-gray-500">{exp.location}</div>}
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-600">
                            {exp.startDate} - {exp.current ? "Présent" : exp.endDate}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formation */}
            {education.length > 0 && (
              <div>
                <h3 className="pb-2 mb-4 text-xl font-bold border-b" style={{ borderColor: settings.color, color: settings.color }}>
                  Formation
                </h3>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold">{edu.degree}</h4>
                          <div className="text-gray-600">{edu.school}</div>
                          {edu.location && <div className="text-sm text-gray-500">{edu.location}</div>}
                        </div>
                        <div className="text-right">
                          <div className="text-gray-600">
                            {edu.startDate} - {edu.current ? "Présent" : edu.endDate}
                          </div>
                        </div>
                      </div>
                      {edu.description && (
                        <p className="text-sm text-gray-700">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite */}
          <div className="space-y-8">
            {/* Compétences */}
            {skills.length > 0 && (
              <div>
                <h3 className="pb-2 mb-4 text-xl font-bold border-b" style={{ borderColor: settings.color, color: settings.color }}>
                  Compétences
                </h3>
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {skill.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Langues */}
            {languages.length > 0 && (
              <div>
                <h3 className="pb-2 mb-4 text-xl font-bold border-b" style={{ borderColor: settings.color, color: settings.color }}>
                  Langues
                </h3>
                <div className="space-y-2">
                  {languages.map((lang, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-sm text-gray-600">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h3 className="pb-2 mb-4 text-xl font-bold border-b" style={{ borderColor: settings.color, color: settings.color }}>
                  Certifications
                </h3>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index}>
                      <div className="font-medium">{cert.name}</div>
                      <div className="text-sm text-gray-600">{cert.issuer}</div>
                      <div className="text-xs text-gray-500">{cert.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pied de page */}
        <div className="pt-4 mt-8 text-xs text-center text-gray-500 border-t border-gray-200">
          CV généré <span className="text-3xl text-secondary">L</span>ivreur<span className="text-3xl text-secondary">N</span>ourriture • {new Date().getFullYear()}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            Générateur de CV
          </h1>
          <p className="text-muted-foreground">
            Créez un CV professionnel en quelques minutes
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Navigation des sections */}
          <div className="lg:col-span-1">
            <div className="sticky space-y-4 top-8">
              {/* Navigation */}
              <div className="border rounded-lg">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Sections du CV</h3>
                </div>
                <div className="p-2 space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const itemCount = cvData[section.id]?.length || 0;
                    
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{section.name}</span>
                        </div>
                        {itemCount > 0 && (
                          <Badge 
                            variant={activeSection === section.id ? "secondary" : "outline"} 
                            className="text-xs"
                          >
                            {itemCount}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progression */}
              <div className="p-4 border rounded-lg">
                <h3 className="mb-3 font-semibold">Progression</h3>
                <div className="space-y-3">
                  {sections.map((section) => {
                    const isComplete = section.id === "personal" 
                      ? cvData.personal.firstName && cvData.personal.lastName && cvData.personal.email
                      : section.id === "experience"
                      ? cvData.experience.length > 0 && cvData.experience.every(e => e.title && e.company)
                      : section.id === "education"
                      ? cvData.education.length > 0 && cvData.education.every(e => e.degree && e.school)
                      : cvData[section.id]?.length > 0;
                    
                    return (
                      <div key={section.id} className="flex items-center gap-3">
                        {isComplete ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <div className="w-4 h-4 border border-gray-300 rounded-full" />
                        )}
                        <span className="text-sm">{section.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="p-4 border rounded-lg">
                <h3 className="mb-3 font-semibold">Actions</h3>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start w-full gap-2"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    <Eye className="w-4 h-4" />
                    {previewMode ? "Masquer l'aperçu" : "Aperçu du CV"}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="default"
                    className="justify-start w-full gap-2"
                    onClick={handleGenerateCV}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Générer le CV
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire principal */}
          <div className={`${previewMode ? 'lg:col-span-2' : 'lg:col-span-2'}`}>
            {previewMode ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Aperçu de votre CV</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewMode(false)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleDownloadPDF}
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      className="gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      Imprimer
                    </Button>
                  </div>
                </div>

                <div className="overflow-hidden border rounded-lg">
                  {renderCVPreview()}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="gap-2">
                    <Save className="w-4 h-4" />
                    Sauvegarder le modèle
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Partager
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => {
                      // Réinitialiser le CV
                      setCvData({
                        personal: {
                          firstName: "",
                          lastName: "",
                          title: "",
                          email: "",
                          phone: "",
                          address: "",
                          city: "",
                          postalCode: "",
                          country: "France",
                          linkedin: "",
                          github: "",
                          portfolio: "",
                          summary: "",
                        },
                        skills: [],
                        education: [],
                        experience: [],
                        projects: [],
                        languages: [],
                        certifications: [],
                        settings: {
                          template: "modern",
                          color: "#3b82f6",
                          font: "Inter",
                          showPhoto: false,
                          photoUrl: "",
                        },
                      });
                      setPreviewMode(false);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Nouveau CV
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg">
                <div className="p-6">
                  {renderActiveSection()}
                </div>
                
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {activeSection === "personal" && "Remplissez vos informations de base"}
                    {activeSection === "skills" && "Ajoutez vos compétences techniques et transversales"}
                    {activeSection === "experience" && "Décrivez votre parcours professionnel"}
                    {activeSection === "education" && "Ajoutez vos diplômes et formations"}
                    {activeSection === "settings" && "Personnalisez l'apparence de votre CV"}
                  </div>
                  
                  <Button
                    type="button"
                    variant="default"
                    onClick={handleGenerateCV}
                    disabled={isGenerating}
                    className="gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Voir l'aperçu
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conseils généraux */}
        {!previewMode && (
          <div className="p-4 mt-8 border rounded-lg bg-muted/30">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="mb-2 font-semibold">Conseils pour un CV efficace</h4>
                <ul className="grid grid-cols-1 gap-2 text-sm text-muted-foreground md:grid-cols-2">
                  <li>• Soyez concis et pertinent</li>
                  <li>• Adaptez votre CV à chaque candidature</li>
                  <li>• Utilisez des mots-clés du secteur</li>
                  <li>• Vérifiez l'orthographe et la grammaire</li>
                  <li>• Mettez en avant vos réalisations</li>
                  <li>• Gardez une mise en page professionnelle</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVGeneratorPage;