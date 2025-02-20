import { Component, OnInit } from '@angular/core';
import { AbonnementService } from '../../Services/abonnement.service';

@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnements.component.html',
  styleUrls: ['./abonnements.component.css']
})
export class AbonnementComponent implements OnInit {
  abonnements: any[] = [];
  selectedAbonnement: any = null;
  newAbonnement: any = {
    nom: '',
    type: '',
    description: '',
    prix: 0,
    dateDebut: '',
    dateFin: ''
  };
errorMessage: any;

  constructor(private abonnementService: AbonnementService) { }

  ngOnInit(): void {
    this.loadAbonnements();
  }

  loadAbonnements() {
    this.abonnementService.getAllAbonnements().subscribe(data => {
      this.abonnements = data;
    });
  }

  saveAbonnement() {
    if (this.newAbonnement.id) {
      this.abonnementService.updateAbonnement(this.newAbonnement.id, this.newAbonnement).subscribe(() => {
        this.loadAbonnements();
        this.resetForm();
      });
    } else {
      this.abonnementService.createAbonnement(this.newAbonnement).subscribe(() => {
        this.loadAbonnements();
        this.resetForm();
      });
    }
  }

  editAbonnement(abonnement: any) {
    this.newAbonnement = { ...abonnement };
  }

  deleteAbonnement(id: number) {
    this.abonnementService.deleteAbonnement(id).subscribe(() => {
      this.loadAbonnements();
    });
  }

  resetForm() {
    this.newAbonnement = {
      nom: '',
      type: '',
      description: '',
      prix: 0,
      dateDebut: '',
      dateFin: ''
    };
  }
}
