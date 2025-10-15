import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../service/leave.service';
import { Leave } from '../../Models/leave.model';
import { Permission } from '../../Models/permission.model';

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-history.html',
  styleUrls: ['./leave-history.scss']
})
export class LeaveHistoryComponent implements OnInit {
  @Input() userId: string = ''; // للفلترة حسب المستخدم
  leaves: Leave[] = [];
  permissions: Permission[] = [];
  updatingLeaveId: string | null = null;
  updatingPermissionId: string | null = null;

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    if (!this.userId) {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      this.userId = user.id;
    }

    this.loadLeavesByUser(this.userId);
    this.loadPermissionsByUser(this.userId);
  }

  loadLeavesByUser(userId: string) {
    this.leaveService.getLeavesByUser(userId).subscribe({
      next: (data: any[]) => {
        this.leaves = data.map((leave: any) => ({
          id: leave.id || '',
          leaveType: Array.isArray(leave.fields['type name'])
            ? leave.fields['type name'][0]
            : leave.fields['type name'],
          fromDate: leave.fields['start time'],
          toDate: leave.fields['end time'],
          status: leave.fields['status'] || 'Pending'
        }));
      },
      error: (err) => console.error('Error fetching leaves by user:', err)
    });
  }

  loadPermissionsByUser(userId: string) {
    this.leaveService.getPermissionsByUser(userId).subscribe({
      next: (data: any[]) => {
        this.permissions = data.map((p: any) => ({
          id: p.id || '',
          permissionType: p.PermissionType || 'N/A',
          date: p.Date || '',
          from: p.From || '',
          to: p.To || '',
          status: p.Status || 'Pending'
        }));
      },
      error: (err) => console.error('Error fetching permissions by user:', err)
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved': return 'badge bg-success';
      case 'rejected': return 'badge bg-danger';
      case 'pending': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
  }

  updateLeaveStatus(leaveId: string | undefined, newStatus: string) {
    if (!leaveId) return;
    this.updatingLeaveId = leaveId;
    this.leaveService.updateLeaveStatus(leaveId, newStatus).subscribe({
      next: () => {
        const leave = this.leaves.find(l => l.id === leaveId);
        if (leave) leave.status = newStatus;
        this.updatingLeaveId = null;
      },
      error: () => this.updatingLeaveId = null
    });
  }

  updatePermissionStatus(permissionId: string | undefined, newStatus: string) {
    if (!permissionId) return;
    this.updatingPermissionId = permissionId;
    this.leaveService.updatePermissionStatus(permissionId, newStatus).subscribe({
      next: () => {
        const perm = this.permissions.find(p => p.id === permissionId);
        if (perm) perm.status = newStatus;
        this.updatingPermissionId = null;
      },
      error: () => this.updatingPermissionId = null
    });
  }
}
