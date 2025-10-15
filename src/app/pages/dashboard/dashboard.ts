import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { LeaveApplyComponent } from '../leave-apply/leave-apply';
import { LeaveHistoryComponent } from '../leave-history/leave-history';
import { PermissionApplyComponent } from '../permission-apply/permission-apply';
import { ManagerRequestsComponent } from '../manager-requests/manager-requests';

import { Leave } from '../../Models/leave.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LeaveApplyComponent,
    LeaveHistoryComponent,
    PermissionApplyComponent,
    ManagerRequestsComponent
  ],
  templateUrl:'./dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  activeTab = signal<'apply' | 'history' | 'permission' | 'manager'>('apply');
  leaves = signal<Leave[]>([]);
  employee = { name:'', position:'', department:'', contract:'', photo:'assets/profile.png' };
  isManager = false;
  userId: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
  
      this.userId = user.id;
  
      // Map API fields including employeeImage
      this.employee = {
        name: user.name || '',
        position: user.position || '',
        department: user.department || '—',
        contract: user.contracttype || '—',
        photo: user.employeeImage || 'assets/profile.png' // <-- use API image here
      };
  
      this.isManager = user.role === 'Manager' || user.position === 'Manager';
  
      if (this.isManager) this.activeTab.set('manager');
    }
  }
  

  selectTab(tab: 'apply' | 'history' | 'permission' | 'manager') {
    this.activeTab.set(tab);
  }

  addLeave(newLeave: Leave) {
    this.leaves.update(current => [...current, newLeave]);
    this.activeTab.set('history');
  }

  addPermission(newPermission: any) {
    this.activeTab.set('history');
  }

  logout() {
    const token = localStorage.getItem('authToken');
    this.http.post('http://localhost:8047/api/auth/logout', {}, { headers: { Authorization: token || '' } })
      .subscribe({
        next: () => this.clearAndNavigate(),
        error: () => this.clearAndNavigate()
      });
  }

  private clearAndNavigate() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
