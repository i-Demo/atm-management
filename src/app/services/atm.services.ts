import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtmService {
  private apiUrl = 'https://67b1a9f63fc4eef538ea56c0.mockapi.io/api/v1/list-atm/atms';

  constructor(private http: HttpClient) {}

  getATMs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addATM(atm: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, atm);
  }

  editATM(id: string, atm: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, atm);
  }

  deleteATM(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
