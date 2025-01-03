import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import du FormsModule
import { ClientService } from '../../Services/client.service';
import { Client } from '../../Interfaces/client';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  standalone: true, // Composant autonome
  imports: [CommonModule, FormsModule], // Ajout de FormsModule
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clients: Client[] = [];
  errorMessage: string = '';
  newClient: Partial<Client> = {};
  editingClient: Client | null = null;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients() {
    this.clientService.getAllClients().subscribe({
      next: (data) => (this.clients = data),
      error: (err) => (this.errorMessage = err)
    });
  }addClient() {
    if (!this.newClient.nom || !this.newClient.prenom || !this.newClient.email) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }
  
    this.clientService.createClient(this.newClient as Client).subscribe({
      next: (newClient) => {
        this.clients.push(newClient);
        this.newClient = {}; // Réinitialiser le formulaire
      },
      error: (err) => (this.errorMessage = err)
    });
  }
  
  editClient(client: Client) {
    this.editingClient = { ...client }; // Clone pour éviter les modifications directes
  }
  
  updateClient() {
    if (!this.editingClient) return; // Vérification de nullité
  
    this.clientService.updateClient(this.editingClient.id, this.editingClient).subscribe({
      next: (updatedClient) => {
        const index = this.clients.findIndex(c => c.id === updatedClient.id);
        if (index > -1) {
          this.clients[index] = updatedClient; // Mise à jour locale
        }
        this.editingClient = null; // Quitter le mode édition
      },
      error: (err) => (this.errorMessage = err)
    });
  }
  
  deleteClient(id: number) {
    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.clients = this.clients.filter(client => client.id !== id);
      },
      error: (err) => (this.errorMessage = err)
    });
  }
  
}
