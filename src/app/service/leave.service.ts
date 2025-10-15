import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permission } from '../Models/permission.model';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private baseUrl = 'http://localhost:8047/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // ---------------- LEAVES ----------------
  getAllLeavesWithType(): Observable<any> {
    return this.http.get(`${this.baseUrl}/leave/all-with-type`, {
      headers: this.getAuthHeaders()
    });
  }

  updateLeaveStatus(leaveId: string, status: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/leave/update-status/${leaveId}`,
      { status },
      { headers: this.getAuthHeaders() }
    );
  }

  // ---------------- PERMISSIONS ----------------
  getPermissionsByUser(userId: string): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.baseUrl}/permission/user/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllPermissions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/permission/all`, {
      headers: this.getAuthHeaders()
    });
  }
  getLeavesByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/leave/my-leaves/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ PATCH method to update permission status
  updatePermissionStatus(permissionId: string, status: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/permission/update-status/${permissionId}`,
      { status },
      { headers: this.getAuthHeaders() }
    );
  }
}
