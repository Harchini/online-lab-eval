import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = '/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  // Questions
  getQuestions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/questions`, { headers: this.headers() });
  }

  createQuestion(q: any): Observable<any> {
    return this.http.post(`${this.base}/questions`, q, { headers: this.headers() });
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.base}/questions/${id}`, { headers: this.headers() });
  }

  // Leaderboard
  getLeaderboard(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/submissions/leaderboard`, { headers: this.headers() });
  }

  // All Submissions
  getAllSubmissions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/submissions/all`, { headers: this.headers() });
  }
}
