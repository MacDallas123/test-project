// ApplicationFormPage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  CheckCircle,
  AlertCircle,
  Calendar,
  Award,
  Trash2,
  Eye,
  Download,
  Building,
  Star,
  Clock,
  DollarSign,
  Loader2,
} from "lucide-react";

const ApplicationFormPage = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();

  // États pour les étapes
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Données de l'offre simulée
  const jobOffer = {
    id: parseInt(id) || 1,
    title: "Poste",
    company: "Entreprise",
    companyId: 1,
    type: type === "internship" ? "Stage" : "CDI",
    location: "Localisation",
    salary: type === "internship" ? "Gratification légale" : "45K-60K €",
    category: "Développement",
    description:
      "Nous recherchons une personne pour ce poste dans l'entreprise",
  };

  // États pour le formulaire
  const [formData, setFormData] = useState({
    // Étape 1: Informations personnelles
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "France",
      birthDate: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },

    // Étape 2: Formation
    education: [
      {
        id: 1,
        degree: "",
        school: "",
        field: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],

    // Étape 3: Expérience professionnelle
    experience: [
      {
        id: 1,
        title: "",
        company: "",
        employmentType: "CDI",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],

    // Étape 4: Compétences et documents
    skills: [],
    coverLetter: "",
    availability: type === "internship" ? "" : "Immédiate",
    desiredSalary: "",
    noticePeriod: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [otherFiles, setOtherFiles] = useState([]);

  // Étapes du formulaire
  const steps = [
    { number: 1, title: "Informations personnelles", icon: User },
    { number: 2, title: "Formation", icon: GraduationCap },
    { number: 3, title: "Expérience", icon: Briefcase },
    { number: 4, title: "Compétences & Documents", icon: FileText },
    { number: 5, title: "Confirmation", icon: CheckCircle },
  ];

  // Gestion des changements de formulaire
  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addItem = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], { id: Date.now() }],
    }));
  };

  const removeItem = (section, id) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleFileUpload = (fileType, file) => {
    if (fileType === "cv") setCvFile(file);
    else if (fileType === "coverLetter") setCoverLetterFile(file);
    else setOtherFiles([...otherFiles, file]);
  };

  const removeFile = (fileType, index) => {
    if (fileType === "cv") setCvFile(null);
    else if (fileType === "coverLetter") setCoverLetterFile(null);
    else setOtherFiles(otherFiles.filter((_, i) => i !== index));
  };

  // Navigation entre les étapes
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler l'envoi
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Candidature soumise:", {
      jobOffer,
      formData,
      files: {
        cv: cvFile,
        coverLetter: coverLetterFile,
        others: otherFiles,
      },
    });

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  // Rendu de l'étape actuelle
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="mb-2 text-xl font-semibold">
                Informations personnelles
              </h3>
              <p className="text-muted-foreground">
                Renseignez vos coordonnées et informations de contact
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.personalInfo.firstName}
                  onChange={(e) =>
                    handleInputChange(
                      "personalInfo",
                      "firstName",
                      e.target.value,
                    )
                  }
                  required
                  placeholder="Votre prénom"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.personalInfo.lastName}
                  onChange={(e) =>
                    handleInputChange(
                      "personalInfo",
                      "lastName",
                      e.target.value,
                    )
                  }
                  required
                  placeholder="Votre nom"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "email", e.target.value)
                  }
                  required
                  placeholder="votre@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  value={formData.personalInfo.phone}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "phone", e.target.value)
                  }
                  required
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.personalInfo.address}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "address", e.target.value)
                  }
                  placeholder="Adresse complète"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={formData.personalInfo.city}
                  onChange={(e) =>
                    handleInputChange("personalInfo", "city", e.target.value)
                  }
                  placeholder="Ville"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  value={formData.personalInfo.postalCode}
                  onChange={(e) =>
                    handleInputChange(
                      "personalInfo",
                      "postalCode",
                      e.target.value,
                    )
                  }
                  placeholder="75000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Date de naissance</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.personalInfo.birthDate}
                  onChange={(e) =>
                    handleInputChange(
                      "personalInfo",
                      "birthDate",
                      e.target.value,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <Input
                    id="linkedin"
                    value={formData.personalInfo.linkedin}
                    onChange={(e) =>
                      handleInputChange(
                        "personalInfo",
                        "linkedin",
                        e.target.value,
                      )
                    }
                    placeholder="URL de votre profil"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <Input
                    id="github"
                    value={formData.personalInfo.github}
                    onChange={(e) =>
                      handleInputChange(
                        "personalInfo",
                        "github",
                        e.target.value,
                      )
                    }
                    placeholder="URL de votre profil"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="portfolio">Portfolio / Site web</Label>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <Input
                    id="portfolio"
                    value={formData.personalInfo.portfolio}
                    onChange={(e) =>
                      handleInputChange(
                        "personalInfo",
                        "portfolio",
                        e.target.value,
                      )
                    }
                    placeholder="URL de votre portfolio"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="mb-2 text-xl font-semibold">Formation</h3>
              <p className="text-muted-foreground">
                Ajoutez vos diplômes et formations
              </p>
            </div>

            {formData.education.map((edu, index) => (
              <div key={edu.id} className="p-4 space-y-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Formation #{index + 1}</h4>
                  {formData.education.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem("education", edu.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Diplôme *</Label>
                    <Input
                      value={edu.degree || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "education",
                          index,
                          "degree",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: Master en Informatique"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Établissement *</Label>
                    <Input
                      value={edu.school || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "education",
                          index,
                          "school",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: Université Paris-Saclay"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Domaine d'études</Label>
                    <Input
                      value={edu.field || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "education",
                          index,
                          "field",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: Informatique, Développement Web"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Actuellement en cours</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${edu.id}`}
                        checked={edu.current || false}
                        onChange={(e) =>
                          handleArrayChange(
                            "education",
                            index,
                            "current",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <Label htmlFor={`current-${edu.id}`} className="!mb-0">
                        Formation en cours
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Date de début *</Label>
                    <Input
                      type="date"
                      value={edu.startDate || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "education",
                          index,
                          "startDate",
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date de fin {!edu.current && "*"}</Label>
                    <Input
                      type="date"
                      value={edu.endDate || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "education",
                          index,
                          "endDate",
                          e.target.value,
                        )
                      }
                      disabled={edu.current}
                      required={!edu.current}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={edu.description || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "education",
                          index,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Décrivez votre formation, les matières principales, les projets réalisés..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => addItem("education")}
              className="w-full"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Ajouter une autre formation
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="mb-2 text-xl font-semibold">
                Expérience professionnelle
              </h3>
              <p className="text-muted-foreground">
                Décrivez votre parcours professionnel
              </p>
            </div>

            {formData.experience.map((exp, index) => (
              <div key={exp.id} className="p-4 space-y-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Expérience #{index + 1}</h4>
                  {formData.experience.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem("experience", exp.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Poste *</Label>
                    <Input
                      value={exp.title || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "title",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: Développeur Full Stack"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Entreprise *</Label>
                    <Input
                      value={exp.company || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "company",
                          e.target.value,
                        )
                      }
                      placeholder="Nom de l'entreprise"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Type de contrat</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={exp.employmentType || "CDI"}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "employmentType",
                          e.target.value,
                        )
                      }
                    >
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Stage">Stage</option>
                      <option value="Alternance">Alternance</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Lieu</Label>
                    <Input
                      value={exp.location || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "location",
                          e.target.value,
                        )
                      }
                      placeholder="Ex: Paris, France"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Actuellement en poste</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-exp-${exp.id}`}
                        checked={exp.current || false}
                        onChange={(e) =>
                          handleArrayChange(
                            "experience",
                            index,
                            "current",
                            e.target.checked,
                          )
                        }
                        className="rounded"
                      />
                      <Label
                        htmlFor={`current-exp-${exp.id}`}
                        className="!mb-0"
                      >
                        Je travaille toujours ici
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Date de début *</Label>
                    <Input
                      type="date"
                      value={exp.startDate || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "startDate",
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date de fin {!exp.current && "*"}</Label>
                    <Input
                      type="date"
                      value={exp.endDate || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "endDate",
                          e.target.value,
                        )
                      }
                      disabled={exp.current}
                      required={!exp.current}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Description *</Label>
                    <Textarea
                      value={exp.description || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "experience",
                          index,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Décrivez vos missions, responsabilités et réalisations..."
                      rows={4}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => addItem("experience")}
              className="w-full"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Ajouter une autre expérience
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="mb-2 text-xl font-semibold">
                Compétences & Documents
              </h3>
              <p className="text-muted-foreground">
                Ajoutez vos compétences et téléchargez vos documents
              </p>
            </div>

            {/* Compétences */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="skills">Compétences techniques</Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Ex: React, Node.js, Python..."
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                  />
                  <Button type="button" onClick={addSkill}>
                    Ajouter
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Lettre de motivation */}
              <div className="space-y-2">
                <Label htmlFor="coverLetter">Lettre de motivation</Label>
                <Textarea
                  id="coverLetter"
                  value={formData.coverLetter}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      coverLetter: e.target.value,
                    }))
                  }
                  placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                  rows={6}
                />
              </div>

              <Separator />

              {/* Informations complémentaires */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="availability">Disponibilité *</Label>
                  <select
                    id="availability"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availability: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="Immédiate">Immédiate</option>
                    <option value="1 mois">1 mois</option>
                    <option value="2 mois">2 mois</option>
                    <option value="3 mois">3 mois</option>
                    <option value="Sur mesure">À discuter</option>
                  </select>
                </div>

                {type !== "internship" && (
                  <div className="space-y-2">
                    <Label htmlFor="desiredSalary">
                      Prétentions salariales
                    </Label>
                    <Input
                      id="desiredSalary"
                      value={formData.desiredSalary}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          desiredSalary: e.target.value,
                        }))
                      }
                      placeholder="Ex: 45 000 € annuels"
                    />
                  </div>
                )}

                {type !== "internship" && (
                  <div className="space-y-2">
                    <Label htmlFor="noticePeriod">Préavis actuel</Label>
                    <Input
                      id="noticePeriod"
                      value={formData.noticePeriod}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          noticePeriod: e.target.value,
                        }))
                      }
                      placeholder="Ex: 1 mois"
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* Téléchargement de fichiers */}
              <div className="space-y-4">
                <h4 className="font-semibold">Documents à télécharger</h4>

                <div className="space-y-3">
                  {/* CV */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <Label className="font-medium">CV *</Label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        PDF, DOC, DOCX (max. 5MB)
                      </span>
                    </div>
                    {cvFile ? (
                      <div className="flex items-center justify-between p-2 rounded bg-muted">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{cvFile.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(URL.createObjectURL(cvFile), "_blank")
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile("cv")}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center border-2 border-dashed rounded-lg">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          Déposez votre CV ou cliquez pour sélectionner
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) =>
                            e.target.files[0] &&
                            handleFileUpload("cv", e.target.files[0])
                          }
                          className="hidden"
                          id="cv-upload"
                        />
                        <Label htmlFor="cv-upload">
                          <Button type="button" variant="outline" as="span">
                            Parcourir les fichiers
                          </Button>
                        </Label>
                      </div>
                    )}

                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => navigate("/cv")}
                      >
                        <FileText className="w-4 h-4" />
                        Générer un CV
                      </Button>
                    </div>
                  </div>

                  {/* Lettre de motivation facultative */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <Label className="font-medium">
                          Lettre de motivation
                        </Label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Optionnel
                      </span>
                    </div>
                    {coverLetterFile ? (
                      <div className="flex items-center justify-between p-2 rounded bg-muted">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">
                            {coverLetterFile.name}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(
                                URL.createObjectURL(coverLetterFile),
                                "_blank",
                              )
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile("coverLetter")}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center border-2 border-dashed rounded-lg">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          Déposez votre lettre de motivation
                        </p>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) =>
                            e.target.files[0] &&
                            handleFileUpload("coverLetter", e.target.files[0])
                          }
                          className="hidden"
                          id="coverletter-upload"
                        />
                        <Label htmlFor="coverletter-upload">
                          <Button type="button" variant="outline" as="span">
                            Ajouter une lettre
                          </Button>
                        </Label>
                      </div>
                    )}
                  </div>

                  {/* Autres documents */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-500" />
                        <Label className="font-medium">Autres documents</Label>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Relevés de notes, certificats, etc.
                      </span>
                    </div>

                    {otherFiles.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {otherFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded bg-muted"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    URL.createObjectURL(file),
                                    "_blank",
                                  )
                                }
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile("other", index)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.png,.doc,.docx"
                      onChange={(e) => {
                        Array.from(e.target.files).forEach((file) =>
                          handleFileUpload("other", file),
                        );
                      }}
                      className="hidden"
                      id="other-upload"
                    />
                    <Label htmlFor="other-upload">
                      <Button
                        type="button"
                        variant="outline"
                        as="span"
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Ajouter d'autres documents
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-2xl font-semibold">Confirmation</h3>
              <p className="text-muted-foreground">
                Vérifiez les informations de votre candidature avant soumission
              </p>
            </div>

            <div className="space-y-6">
              {/* Récapitulatif de l'offre */}
              <div className="p-4 border rounded-lg">
                <h4 className="mb-3 font-semibold">Offre concernée</h4>
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-12 h-12 text-blue-600 bg-blue-100 rounded-lg">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <h5 className="font-semibold">{jobOffer.title}</h5>
                      <Badge
                        variant={
                          jobOffer.type === "Stage" ? "default" : "secondary"
                        }
                      >
                        {jobOffer.type}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        <span>{jobOffer.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{jobOffer.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{jobOffer.salary}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="p-4 border rounded-lg">
                <h4 className="mb-3 font-semibold">
                  Informations personnelles
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nom complet :</span>
                    <p className="font-medium">
                      {formData.personalInfo.firstName}{" "}
                      {formData.personalInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email :</span>
                    <p className="font-medium">{formData.personalInfo.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Téléphone :</span>
                    <p className="font-medium">{formData.personalInfo.phone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Localisation :
                    </span>
                    <p className="font-medium">
                      {formData.personalInfo.city &&
                        `${formData.personalInfo.city}, `}
                      {formData.personalInfo.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Formation et expérience */}
              <div className="p-4 border rounded-lg">
                <h4 className="mb-3 font-semibold">Parcours</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h5 className="flex items-center gap-1 mb-2 text-sm font-semibold">
                      <GraduationCap className="w-4 h-4" />
                      Formation ({formData.education.length})
                    </h5>
                    <div className="space-y-2">
                      {formData.education.slice(0, 2).map((edu, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-muted-foreground">{edu.school}</p>
                        </div>
                      ))}
                      {formData.education.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{formData.education.length - 2} autres formations
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="flex items-center gap-1 mb-2 text-sm font-semibold">
                      <Briefcase className="w-4 h-4" />
                      Expérience ({formData.experience.length})
                    </h5>
                    <div className="space-y-2">
                      {formData.experience.slice(0, 2).map((exp, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium">{exp.title}</p>
                          <p className="text-muted-foreground">{exp.company}</p>
                        </div>
                      ))}
                      {formData.experience.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{formData.experience.length - 2} autres expériences
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="p-4 border rounded-lg">
                <h4 className="mb-3 font-semibold">Documents fournis</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {cvFile ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium">CV :</span>
                        <span>{cvFile.name}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="font-medium">CV :</span>
                        <span className="text-red-500">Non fourni</span>
                      </>
                    )}
                  </div>

                  {coverLetterFile && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium">
                        Lettre de motivation :
                      </span>
                      <span>{coverLetterFile.name}</span>
                    </div>
                  )}

                  {otherFiles.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Autres documents :</span>
                      <span>
                        {otherFiles.length} fichier
                        {otherFiles.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Avertissement */}
              <div className="p-4 border rounded-lg border-amber-200 bg-amber-50">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800">
                      Avant de soumettre
                    </h4>
                    <ul className="mt-2 space-y-1 text-sm text-amber-700">
                      <li>
                        • Vérifiez l'exactitude de toutes les informations
                      </li>
                      <li>• Assurez-vous que votre CV est à jour</li>
                      <li>• Votre candidature sera envoyée à l'entreprise</li>
                      <li>• Vous recevrez une confirmation par email</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Si la candidature est soumise
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="mb-4 text-3xl font-bold">Candidature envoyée !</h1>
            <p className="mb-6 text-muted-foreground">
              Votre candidature pour le poste de{" "}
              <span className="font-semibold">{jobOffer.title}</span> chez{" "}
              {jobOffer.company} a été soumise avec succès.
            </p>

            <div className="p-4 mb-8 border rounded-lg bg-muted/30">
              <h3 className="mb-3 font-semibold">Prochaines étapes</h3>
              <div className="space-y-3 text-sm text-left">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-primary">
                    1
                  </div>
                  <span>Confirmation par email dans les 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-primary">
                    2
                  </div>
                  <span>Examen de votre candidature par l'entreprise</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-primary">
                    3
                  </div>
                  <span>Réponse sous 7 à 14 jours ouvrables</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/jobs">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Voir d'autres offres
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/profile">
                  <User className="w-4 h-4 mr-2" />
                  Gérer mes candidatures
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        {/* En-tête avec l'offre */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour
          </Button>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Candidature : {jobOffer.title}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{jobOffer.company}</span>
                </div>
                <span>•</span>
                <Badge
                  variant={jobOffer.type === "Stage" ? "default" : "secondary"}
                >
                  {jobOffer.type}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Formulaire en {steps.length} étapes</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Barre de progression */}
          <div className="lg:col-span-1">
            <div className="sticky space-y-6 top-8">
              {/* Étapes */}
              <div className="border rounded-lg">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Progression</h3>
                </div>
                <div className="p-4 space-y-4">
                  {steps.map((step) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.number;
                    const isCompleted = currentStep > step.number;

                    return (
                      <div
                        key={step.number}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : isCompleted
                              ? "bg-green-50 border border-green-200"
                              : "hover:bg-muted"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            isActive
                              ? "bg-primary-foreground text-primary"
                              : isCompleted
                                ? "bg-green-100 text-green-600"
                                : "bg-muted"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            Étape {step.number}
                          </div>
                          <div className="text-xs">{step.title}</div>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Aide et conseils */}
              <div className="p-4 border rounded-lg">
                <h3 className="mb-3 font-semibold">Conseils</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                    <span>Remplissez tous les champs obligatoires (*)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                    <span>Vérifiez l'orthographe et la grammaire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                    <span>Téléchargez un CV à jour (PDF recommandé)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                    <span>Soyez précis dans vos expériences</span>
                  </li>
                </ul>
              </div>

              {/* Progression */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progression</span>
                  <span className="text-sm font-bold text-primary">
                    {Math.round((currentStep / steps.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full transition-all duration-300 bg-primary"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-center text-muted-foreground">
                  Étape {currentStep} sur {steps.length}
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contenu de l'étape */}
              <div className="border rounded-lg">
                <div className="p-6">{renderStep()}</div>

                {/* Navigation */}
                <div className="flex items-center justify-between p-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1 || isSubmitting}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </Button>

                  <div className="flex items-center gap-3">
                    {currentStep < steps.length ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="gap-2"
                      >
                        Suivant
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Soumettre ma candidature
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Sauvegarde automatique */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4" />
                <span>Sauvegarde automatique activée</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFormPage;
