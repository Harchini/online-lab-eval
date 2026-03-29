import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  // Advanced Angular Technique: Reactive programming with RxJS tap operator
  login(regNo: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { regNo, password, role: 'staff' }).pipe(
      tap((res: any) => localStorage.setItem('staff', JSON.stringify(res)))
    );
  }

  logout(): void {
    localStorage.removeItem('staff');
  }

  getUser(): any {
    const stored = localStorage.getItem('staff');
    return stored ? JSON.parse(stored) : null;
  }

  getToken(): string | null {
    return this.getUser()?.token || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
