import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { LeaveApplyComponent } from '../leave-apply/leave-apply';
import { LeaveHistoryComponent } from '../leave-history/leave-history';
import { PermissionApplyComponent } from '../permission-apply/permission-apply'; // أضف هذا
import { Leave } from '../../Models/leave.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    LeaveApplyComponent, 
    LeaveHistoryComponent,
    PermissionApplyComponent  // أضف هذا
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  leaves = signal<Leave[]>([]);
  activeTab = signal<'apply' | 'history' | 'permission'>('apply');

  employee = {
    name: '',
    position: '',
    department: '',
    contract: '',
    photo: 'https://i.pravatar.cc/150?img=2'
  };

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.employee = {
        ...this.employee,
        name: user.name || '',
        contract: user.contracttype || ''
      };
    }
  }

  selectTab(tab: 'apply' | 'history' | 'permission') {
    this.activeTab.set(tab);
  }

  addLeave(newLeave: Leave) {
    this.leaves.update(current => [...current, newLeave]);
    this.activeTab.set('history');
  }

  addPermission(newPermission: any) {
    // يمكنك التعامل مع الـ permission هنا
    console.log('New permission:', newPermission);
    this.activeTab.set('history');
  }

  logout(): void {
    const token = localStorage.getItem('authToken');
    this.http.post('http://localhost:8047/api/auth/logout', {}, {
      headers: { Authorization: token || '' }
    }).subscribe({
      next: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
      }
    });
  }
}