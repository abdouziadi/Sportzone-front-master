import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salledesport } from '../Interfaces/salledesport';

@Injectable({
  providedIn: 'root',
})
export class SalledesportService {
  private baseUrl = 'http://localhost:8085/salledesport'; // API base URL

  constructor(private http: HttpClient) {}

  // Helper method to get headers with token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
  }
  // Get salles created by the logged-in OWNER
getMySalles(): Observable<Salledesport[]> {
  return this.http.get<Salledesport[]>(`${this.baseUrl}/my-salles`, { headers: this.getAuthHeaders() });
}


  // Create a new Salledesport
  createSalledesport(salledesport: Salledesport): Observable<Salledesport> {
    return this.http.post<Salledesport>(`${this.baseUrl}/save`, salledesport, { headers: this.getAuthHeaders() });
  }

  // Get all Sallesdesport
  getAllSallesdesport(): Observable<Salledesport[]> {
    return this.http.get<Salledesport[]>(`${this.baseUrl}/all`, { headers: this.getAuthHeaders() });
  }

  // Get a Salledesport by ID
  getSalledesportById(id: number): Observable<Salledesport> {
    return this.http.get<Salledesport>(`${this.baseUrl}/getOne/${id}`, { headers: this.getAuthHeaders() });
  }

  // Update a Salledesport
  updateSalledesport(id: number, salledesport: Salledesport): Observable<Salledesport> {
    return this.http.put<Salledesport>(`${this.baseUrl}/update/${id}`, salledesport, { headers: this.getAuthHeaders() });
  }

  // Delete a Salledesport by ID
  deleteSalledesport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { headers: this.getAuthHeaders() });
  }
}
