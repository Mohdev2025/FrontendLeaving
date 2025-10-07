import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'http://localhost:8047/api/auth/login';

  constructor(private http: HttpClient) {
    console.log('LoginService Initialized');
  }

  login(credentials: any): Observable<any> {
    return this.http.post(this.baseUrl, credentials)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Login error:', error);
    return throwError(() => error);
  }
}
