// ContactPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  Building2,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    description: "senfibem.paris@outlook.com",
    details: "Réponse sous 24h",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Phone,
    title: "Téléphone",
    description: "+33 1 23 45 67 89",
    details: "Lun-Ven: 9h-18h",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: MapPin,
    title: "Adresse",
    description: "Vernand, France",
    details: "75 001",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Clock,
    title: "Horaires",
    description: "Lundi - Vendredi",
    details: "9h00 - 18h00",
    gradient: "from-orange-500 to-red-500",
  },
];

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler l'envoi du formulaire
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Message envoyé:", formData);

    setIsSubmitted(true);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      subject: "",
      message: "",
    });

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Bouton retour */}
      {/* <div className="container px-4 pt-6 mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div> */}

      {/* Hero Section Contact */}
      {/* <section className="relative flex items-center justify-center py-8 overflow-hidden bg-primary"> */}
      <section className="border-b bg-linear-to-br from-blue-50 to-indigo-50">
        <div className="container px-4 py-12 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Contactez nous
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Découvrez les opportunités professionnelles proposées par nos
              entreprises partenaires
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="container px-4 py-16 mx-auto">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-8">
                  <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Envoyez-nous un message
                    </h2>
                    <p className="text-muted-foreground">
                      Nous vous répondrons sous 48h
                    </p>
                  </div>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center"
                  >
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold">
                      Message envoyé !
                    </h3>
                    <p className="text-muted-foreground">
                      Merci pour votre message. Notre équipe vous contactera
                      très rapidement.
                    </p>
                    <Button
                      variant="default"
                      className="mt-6"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Envoyer un autre message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block mb-2 text-sm font-medium"
                        >
                          Nom *
                        </label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          placeholder="Votre nom"
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block mb-2 text-sm font-medium"
                        >
                          Prénom *
                        </label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          placeholder="Votre prénom"
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium"
                        >
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="votre@email.com"
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="address"
                          className="block mb-2 text-sm font-medium"
                        >
                          Email *
                        </label>
                        <Input
                          id="address"
                          name="address"
                          type="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          placeholder="Ex: Vernand"
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block mb-2 text-sm font-medium"
                        >
                          Téléphone
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+33 6 05 51 14 32"
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="subject"
                          className="block mb-2 text-sm font-medium"
                        >
                          Sujet *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          placeholder="Objet de votre message"
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block mb-2 text-sm font-medium"
                      >
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Décrivez votre demande ou posez-nous vos questions..."
                        rows={6}
                        className="resize-none"
                      />
                    </div>

                    <div className="p-3 text-sm rounded-lg text-muted-foreground bg-muted/30">
                      <p>
                        Votre position actuelle sera automatiquement jointe à
                        votre message pour un meilleur service.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      variant="default"
                      size="lg"
                      className="w-full text-lg font-semibold h-14"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="mb-8 text-center lg:text-left">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Parlons de Votre
                <span className="block text-transparent bg-primary bg-clip-text">
                  Projet
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Notre équipe d'experts est à votre disposition pour vous
                accompagner.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {contactInfo.map((contact, index) => (
                <motion.div
                  key={contact.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="transition-all duration-300 border-0 cursor-pointer group hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${contact.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                        >
                          <contact.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="mb-1 text-xl font-bold">
                            {contact.title}
                          </h3>
                          <p className="mb-1 text-lg font-semibold text-primary">
                            {contact.description}
                          </p>
                          <p className="text-muted-foreground">
                            {contact.details}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Mini Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 mr-3 text-primary" />
                    <h3 className="text-xl font-bold">Votre Position</h3>
                  </div>
                  <p className="mb-4 text-muted-foreground">
                    Pour un service personnalisé, votre position sera
                    automatiquement incluse avec votre message.
                  </p>

                  {/* Mini Map Visualization */}
                  <div className="flex items-center justify-center h-48 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center">
                      <div className="relative">
                        <MapPin className="w-12 h-12 mx-auto mb-3 text-primary animate-pulse" />
                        <div className="absolute top-0 w-2 h-2 transform -translate-x-1/2 bg-red-500 rounded-full left-1/2 animate-ping"></div>
                      </div>
                      <p className="font-medium text-muted-foreground">
                        Position actuelle détectée
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        (Incluse dans votre message)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>
                      Position partagée uniquement avec votre consentement
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
