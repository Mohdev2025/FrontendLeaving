import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { LeaveApplyComponent } from '../leave-apply/leave-apply';
import { LeaveHistoryComponent } from '../leave-history/leave-history';
import {  Leave } from '../../Models/leave.model ';
import { HttpClient } from '@angular/common/http';



  @Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, LeaveApplyComponent, LeaveHistoryComponent],
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss']
  })
  export class DashboardComponent implements OnInit {
  
    leaves = signal<Leave[]>([]);
    activeTab = signal<'apply' | 'history'>('apply');
  
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
  
    selectTab(tab: 'apply' | 'history') {
      this.activeTab.set(tab);
    }
  
    addLeave(newLeave: Leave) {
      this.leaves.update(current => [...current, newLeave]);
      this.activeTab.set('history');
    }
  

  
// تحديث دالة logout
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
      // حتى لو فشل الطلب، قم بتسجيل الخروج محليًا
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    }
  });
}

  }
  