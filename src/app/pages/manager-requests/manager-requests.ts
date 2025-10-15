import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Request {
  id: string;
  employeeName: string;
  type: 'leave' | 'permission';
  startDate?: string;
  endDate?: string;
  permissionDate?: string;
  permissionTime?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

@Component({
  selector: 'app-manager-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-requests.html',
  styleUrls: ['./manager-requests.scss']
})
export class ManagerRequestsComponent implements OnInit {

  requests = signal<Request[]>([]);
  filteredRequests = signal<Request[]>([]);
  filterStatus = signal<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  isLoading = signal(false);

  private baseUrl = 'http://localhost:8047/api';
// يمكنك تعديلها حسب الـ backend

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading.set(true);
    const token = localStorage.getItem('authToken') || '';

    // استدعاء API لكل من leave و permission
    Promise.all([
      this.http.get<any[]>(`${this.baseUrl}/leave/all`, { headers: { Authorization: token } }).toPromise(),
      this.http.get<any[]>(`${this.baseUrl}/permission/all`, { headers: { Authorization: token } }).toPromise()
    ])
    .then(([leaves, permissions]) => {
      const mappedLeaves = (leaves || []).map(item => this.mapLeave(item));
      const mappedPermissions = (permissions || []).map(item => this.mapPermission(item));
      const combined = [...mappedLeaves, ...mappedPermissions];
      this.requests.set(combined);
      this.applyFilter();
      this.isLoading.set(false);
    })
    .catch(err => {
      console.error('Error fetching requests:', err);
      this.isLoading.set(false);
    });
  }

  // تحويل بيانات الإجازة من Airtable إلى Request
  private mapLeave(item: any): Request {
    const f = item.fields || item; // دعم لحالتين: وجود fields أو لا
    return {
      id: item.id,
      employeeName: f.name || 'Unknown',
      type: 'leave',
      startDate: f['start time']?.substring(0, 10) || '',
      endDate: f['end time']?.substring(0, 10) || '',
      reason: f.description || '',
      status: this.mapStatus(f.status),
      submittedDate: new Date(f['start time'] || Date.now()).toISOString().substring(0, 10)
    };
  }

  // تحويل بيانات الإذن من Airtable إلى Request
  private mapPermission(item: any): Request {
    return {
      id: item.id,
      employeeName: item.name || 'Unknown',
      type: 'permission',
      permissionDate: item.Date || '',
      permissionTime: `${item.From || ''} - ${item.To || ''}`,
      reason: item.Reason || '',
      status: this.mapStatus(item.status),
      submittedDate: new Date(item.Date || Date.now()).toISOString().substring(0, 10)
    };
  }

  private mapStatus(apiStatus: string): 'pending' | 'approved' | 'rejected' {
    const lower = (apiStatus || '').toLowerCase();
    if (lower.includes('pending') || lower.includes('requested')) return 'pending';
    if (lower.includes('approved')) return 'approved';
    if (lower.includes('rejected')) return 'rejected';
    return 'pending';
  }

  // ==== الفلاتر ====
  applyFilter() {
    const status = this.filterStatus();
    if (status === 'all') {
      this.filteredRequests.set(this.requests());
    } else {
      this.filteredRequests.set(this.requests().filter(req => req.status === status));
    }
  }

  setFilter(status: 'all' | 'pending' | 'approved' | 'rejected') {
    this.filterStatus.set(status);
    this.applyFilter();
  }

  // ==== تحديث الحالة ====
  approveRequest(request: Request) {
    const token = localStorage.getItem('authToken') || '';
    this.http.put(`${this.baseUrl}/requests/${request.id}/approve`, {}, { headers: { Authorization: token } })
      .subscribe({
        next: () => this.updateRequestStatus(request.id, 'approved'),
        error: (err) => {
          console.error('Error approving request:', err);
          this.updateRequestStatus(request.id, 'approved'); // تحديث محلي مؤقت
        }
      });
  }

  rejectRequest(request: Request) {
    const token = localStorage.getItem('authToken') || '';
    this.http.put(`${this.baseUrl}/requests/${request.id}/reject`, {}, { headers: { Authorization: token } })
      .subscribe({
        next: () => this.updateRequestStatus(request.id, 'rejected'),
        error: (err) => {
          console.error('Error rejecting request:', err);
          this.updateRequestStatus(request.id, 'rejected'); // تحديث محلي مؤقت
        }
      });
  }

  updateRequestStatus(id: string, status: 'approved' | 'rejected') {
    this.requests.update(current =>
      current.map(req => req.id === id ? { ...req, status } : req)
    );
    this.applyFilter();
  }

  // ==== الإحصائيات ====
  getPendingCount(): number {
    return this.requests().filter(req => req.status === 'pending').length;
  }

  getApprovedCount(): number {
    return this.requests().filter(req => req.status === 'approved').length;
  }

  getRejectedCount(): number {
    return this.requests().filter(req => req.status === 'rejected').length;
  }
}
