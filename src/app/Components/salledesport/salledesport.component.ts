import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SalledesportService } from '../../Services/sallesdesport.service';
import { Salledesport } from '../../Interfaces/salledesport';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-salles-sport',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './salledesport.component.html',
  styleUrls: ['./salledesport.component.css']
})
export class SallesSportComponent implements OnInit {
  userRole: string = ''; // Role of the current user
  sallesdesport: Salledesport[] = [];
  newSalledesport: Salledesport = {
    nomSalle: '', 
    adresse: '', 
    numTel: '', 
    heureOuverture: '', 
    heureFermeture: ''
  };
  editSalledesport: Salledesport | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private salleService: SalledesportService, 
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserRole();
    this.loadSalles();
  }

  // Load user role from localStorage
  loadUserRole(): void {
    const storedRole = localStorage.getItem('userRole');
    this.userRole = storedRole ? storedRole : 'guest';
    console.log('Loaded user role:', this.userRole);
  }

  loadSalles(): void {
    this.loading = true;
    if (this.userRole === 'ROLE_OWNER') {
      this.salleService.getMySalles().subscribe({
        next: (salles) => {
          this.sallesdesport = salles;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = `Error fetching sallesdesport: ${err.message}`;
          this.loading = false;
        }
      });
    } else {
      this.salleService.getAllSallesdesport().subscribe({
        next: (salles) => {
          this.sallesdesport = salles;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = `Error fetching sallesdesport: ${err.message}`;
          this.loading = false;
        }
      });
    }
  }
  

  // Add new sports hall
  addSalledesport(): void {
    if (this.userRole === 'ROLE_OWNER') {
      this.loading = true;
      this.salleService.createSalledesport(this.newSalledesport).subscribe({
        next: (response) => {
          this.sallesdesport.push(response);
          this.newSalledesport = { nomSalle: '', adresse: '', numTel: '', heureOuverture: '', heureFermeture: '' };
          alert('Salle added successfully!');
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = `Error adding salle: ${err.message}`;
        },
        complete: () => (this.loading = false)
      });
    } else {
      alert('You must be an OWNER to add a salle.');
    }
  }

  // Edit sports hall
  editMode(salle: Salledesport): void {
    if (this.userRole === 'ROLE_OWNER') {
      this.editSalledesport = { ...salle };
    } else {
      alert('You must be an OWNER to edit a salle.');
    }
  }

  saveEdit(): void {
    if (this.editSalledesport) {
      this.loading = true;
      this.salleService.updateSalledesport(this.editSalledesport.id!, this.editSalledesport).subscribe({
        next: (updatedSalle) => {
          const index = this.sallesdesport.findIndex(salle => salle.id === updatedSalle.id);
          if (index > -1) {
            this.sallesdesport[index] = updatedSalle;
          }
          this.editSalledesport = null;
          alert('Salle updated successfully!');
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = `Error saving edits: ${err.message}`;
        },
        complete: () => (this.loading = false)
      });
    }
  }

  deleteSalledesport(id: number): void {
    if (this.userRole === 'ROLE_OWNER') {
      if (confirm('Are you sure you want to delete this sports hall?')) {
        this.loading = true;
        this.salleService.deleteSalledesport(id).subscribe({
          next: () => {
            this.sallesdesport = this.sallesdesport.filter(salle => salle.id !== id);
            alert('Salle deleted successfully!');
          },
          error: (err: HttpErrorResponse) => {
            this.errorMessage = `Error deleting salle: ${err.message}`;
          },
          complete: () => (this.loading = false)
        });
      }
    } else {
      alert('You must be an OWNER to delete a salle.');
    }
  }
}
