import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private baseUrl = 'http://localhost:8047/api/leave';

  constructor(private http: HttpClient) {}

  // الهيدر مع التوكن المخزن
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // جلب كل الإجازات مع نوع الإجازة
  getAllLeavesWithType(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all-with-type`, {
      headers: this.getAuthHeaders()
    });
  }

  getLeaveTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/types`, {
      headers: this.getAuthHeaders()
    });
  }

  applyLeave(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply`, payload, {
      headers: this.getAuthHeaders()
    });
  }
}
