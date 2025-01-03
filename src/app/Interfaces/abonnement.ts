export interface Abonnement {
    id: number;
    nom: string;
    type: string;
    description: string;
    prix: number;
    dateDebut: string;
    dateFin: string;
    client: {
      id: number;
      username: string;
      email: string;
    };
  }