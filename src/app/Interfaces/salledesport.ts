import { Abonnement } from "../Interfaces/abonnement";  // Correct import path

export interface Salledesport {
  id?: number; 
  nomSalle: string;
  adresse: string;
  numTel: string;
  heureOuverture: string;
  heureFermeture: string;
  ownerUsername?: string // Optional: If the owner (User) is associated
  abonnements?: Abonnement[]; // Updated to use the Abonnement interface
}