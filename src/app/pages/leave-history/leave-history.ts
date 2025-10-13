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
  @Input() leaves: Leave[] = [];
  permissions: Permission[] = [];
  userRole: string = '';
  updatingLeaveId: string | null = null;
  updatingPermissionId: string | null = null;

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    this.userRole = user.role || '';

    // Load leaves if empty
    if (this.leaves.length === 0) this.loadLeaves();

    // Load permissions
    if (this.isManager()) this.loadAllPermissions();
    else this.loadPermissions(user.id);
  }

  // -------------------- LEAVES --------------------
  loadLeaves() {
    this.leaveService.getAllLeavesWithType().subscribe({
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
      error: (err) => console.error('Error fetching leaves:', err)
    });
  }

  updateLeaveStatus(leaveId: string | undefined, newStatus: string) {
    if (!leaveId) {
      console.warn('Cannot update leave, ID is undefined');
      return;
    }

    this.updatingLeaveId = leaveId;
    console.log('Updating leave', leaveId, 'to', newStatus);

    this.leaveService.updateLeaveStatus(leaveId, newStatus).subscribe({
      next: () => {
        const leave = this.leaves.find(l => l.id === leaveId);
        if (leave) leave.status = newStatus;
        this.updatingLeaveId = null;
      },
      error: (err) => {
        console.error('Error updating leave status:', err);
        alert('Failed to update leave status');
        this.updatingLeaveId = null;
      }
    });
  }

  // -------------------- PERMISSIONS --------------------
  loadPermissions(userId: string) {
    this.leaveService.getPermissionsByUser(userId).subscribe({
      next: (data: any[]) => {
        this.permissions = data.map((p: any) => ({
          id: p.id || p.fields?.id || '',
          permissionType: p.PermissionType || 'N/A',
          date: p.Date || '',
          from: p.From || '',
          to: p.To || '',
          status: p.Status || 'Pending'
        }));
      },
      error: (err) => {
        console.error('Error fetching permissions:', err);
        this.permissions = [];
      }
    });
  }

  loadAllPermissions() {
    this.leaveService.getAllPermissions().subscribe({
      next: (data: any[]) => {
        this.permissions = data.map((p: any) => ({
          id: p.id || p.fields?.id || '',
          permissionType: p.PermissionType || 'N/A',
          date: p.Date || '',
          from: p.From || '',
          to: p.To || '',
          status: p.Status || 'Pending'
        }));
      },
      error: (err) => {
        console.error('Error fetching all permissions:', err);
        this.permissions = [];
      }
    });
  }

  updatePermissionStatus(permissionId: string | undefined, newStatus: string) {
    if (!permissionId) {
      console.warn('Cannot update permission, ID is undefined');
      return;
    }

    this.updatingPermissionId = permissionId;
    console.log('Updating permission', permissionId, 'to', newStatus);

    this.leaveService.updatePermissionStatus(permissionId, newStatus).subscribe({
      next: (res: any) => {
        const perm = this.permissions.find(p => p.id === permissionId);
        if (perm) perm.status = newStatus;
        this.updatingPermissionId = null;
        console.log(res.message || 'Permission updated successfully');
      },
      error: (err) => {
        console.error('Error updating permission status:', err);
        alert('Failed to update permission status');
        this.updatingPermissionId = null;
      }
    });
  }

  // -------------------- UTILS --------------------
  isManager(): boolean {
    return this.userRole.toLowerCase() === 'manager';
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved': return 'badge bg-success';
      case 'rejected': return 'badge bg-danger';
      case 'pending': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
  }
}
