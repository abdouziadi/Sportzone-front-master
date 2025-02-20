import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbonnementService {
  private baseUrl = 'http://localhost:8085/abonnement'; // Adjust the URL to match your backend server

  constructor(private http: HttpClient) { }

  getAllAbonnements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  getAbonnementById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getOne/${id}`);
  }

  createAbonnement(abonnement: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/new`, abonnement);
  }

  createAbonnementForClient(clientId: number, abonnement: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/save/${clientId}`, abonnement);
  }

  updateAbonnement(id: number, abonnement: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, abonnement);
  }

  deleteAbonnement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
