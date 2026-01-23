import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";

const UserProvider = () => {
  const providers = [
    {
      id: 1,
      name: "TechSolutions Inc.",
      category: "Développement Web",
      description:
        "Agence spécialisée dans le développement d'applications web sur mesure avec React et Node.js.",
      avatar: "bg-gradient-to-br from-blue-500 to-cyan-400",
      website: "https://techsolutions.example.com",
    },
    {
      id: 2,
      name: "DesignCreatives Studio",
      category: "Design Graphique",
      description:
        "Studio créatif expert en identité visuelle, UX/UI design et branding pour startups et PME.",
      avatar: "bg-gradient-to-br from-purple-500 to-pink-400",
      website: "https://designcreatives.example.com",
    },
    {
      id: 3,
      name: "MarketingBoost Agency",
      category: "Marketing Digital",
      description:
        "Agence de marketing digital spécialisée dans le SEO, les campagnes Facebook et le growth hacking.",
      avatar: "bg-gradient-to-br from-green-500 to-emerald-400",
      website: "https://marketingboost.example.com",
    },
    {
      id: 4,
      name: "LegalEase Consultants",
      category: "Services Juridiques",
      description:
        "Cabinet de consultants juridiques spécialisés dans le droit des affaires et la propriété intellectuelle.",
      avatar: "bg-gradient-to-br from-red-500 to-orange-400",
      website: "https://legalease.example.com",
    },
    {
      id: 5,
      name: "BuildMaster Construction",
      category: "BTP & Construction",
      description:
        "Entreprise générale du bâtiment spécialisée dans la construction durable et la rénovation.",
      avatar: "bg-gradient-to-br from-amber-500 to-yellow-400",
      website: "https://buildmaster.example.com",
    },
    {
      id: 6,
      name: "FinTech Solutions",
      category: "FinTech & Banque",
      description:
        "Expert en solutions financières digitales, paiements en ligne et systèmes bancaires modernes.",
      avatar: "bg-gradient-to-br from-indigo-500 to-blue-400",
      website: "https://fintechsolutions.example.com",
    },
  ];

  return (
    <section id="providers" className="px-4 py-4 mb-4 h-[700px]">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold">Prestataires partenaires</h2>
          <p className="max-w-xl mx-auto text-muted-foreground">
            Découvrez nos partenaires experts dans différents domaines
          </p>
        </div>

        {/* Conteneur scrollable */}
        <div className="relative">
          <div className="relative flex h-full py-16 pb-8 space-x-6 overflow-x-auto scrollbar-hide">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="w-64 shrink-0"
              >
                <Card className="h-full transition-shadow duration-300 border-none shadow-sm hover:shadow-md">
                  {/* Avatar circulaire centré */}
                  <div className="flex justify-center py-2">
                    <div
                      className={`w-32 h-32 rounded-full bg-accent flex items-center justify-center text-white text-5xl font-bold border-4 border-background`}
                    >
                      {provider.name.charAt(0)}
                    </div>
                  </div>

                  <CardContent className="pt-6 text-center">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {provider.category}
                      </p>
                    </div>
                    
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                      {provider.description}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <a
                      // href={provider.website}
                      href={`/prestataire/${provider.id}`}
                      // target="_blank"
                      // rel="noopener noreferrer"
                      className="flex items-center justify-center w-full gap-1 text-sm text-primary hover:text-primary/80 hover:underline"
                    >
                      Voir les produits/prestations
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>

          {/* Indicateurs de défilement discrets */}
          <div className="flex justify-center mt-6 space-x-1">
            {providers.slice(0, 4).map((_, index) => (
              <div
                key={index}
                className="w-1 h-1 rounded-full bg-muted-foreground/20"
              />
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/providers"
            className="text-sm transition-colors text-muted-foreground hover:text-primary"
          >
            Voir tous les prestataires →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UserProvider;