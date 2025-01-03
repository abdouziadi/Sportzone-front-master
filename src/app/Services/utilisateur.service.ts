import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Client } from '../Interfaces/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  
  private API_SERVER = "http://localhost:8081/client";

  constructor(private httpClient: HttpClient) { }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {	
    let errorMessage = 'Unknown Error.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  // Récupérer tous les clients
  getAllClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(`${this.API_SERVER}/all`).pipe(catchError(this.handleError));
  }

  // Ajouter un client
  createClient(client: Client): Observable<Client> {
    return this.httpClient.post<Client>(`${this.API_SERVER}/save`, client).pipe(catchError(this.handleError));
  }

  // Récupérer un client par ID
  getClientById(id: number): Observable<Client> {
    return this.httpClient.get<Client>(`${this.API_SERVER}/getOne/${id}`).pipe(catchError(this.handleError));
  }

  // Mettre à jour un client
  updateClient(id: number, client: Client): Observable<Client> {
    return this.httpClient.put<Client>(`${this.API_SERVER}/update/${id}`, client).pipe(catchError(this.handleError));
  }

  // Supprimer un client
  deleteClient(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_SERVER}/delete/${id}`).pipe(catchError(this.handleError));
  }
}
