import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Filter } from "lucide-react";

const ClientsPage = () => {
  // Données pré-remplies
  const clients = [
    {
      id: 1,
      nom: "Entreprise ABC",
      email: "contact@abc.com",
      telephone: "+33 1 23 45 67 89",
      responsable: "Jean Dupont",
      statut: "actif"
    },
    {
      id: 2,
      nom: "Société XYZ",
      email: "info@xyz.fr",
      telephone: "+33 1 98 76 54 32",
      responsable: "Marie Martin",
      statut: "actif"
    }
  ];

  return (
    <main className="flex flex-col w-full p-4 overflow-auto lg:p-8">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 mb-8 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Gérez vos clients et leurs informations
          </p>
        </div>
        
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau client
        </Button>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un client..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des clients */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des clients ({clients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients.map((client) => (
              <div 
                key={client.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50"
              >
                <div>
                  <h3 className="font-semibold">{client.nom}</h3>
                  <p className="text-sm text-muted-foreground">
                    {client.email} • {client.telephone}
                  </p>
                  <p className="mt-1 text-sm">
                    Responsable: {client.responsable}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                    {client.statut}
                  </span>
                  <Button variant="ghost" size="sm">
                    Voir détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ClientsPage;