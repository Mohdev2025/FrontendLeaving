 import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Leave {
  leaveType: string;
  fromDate: string;
  toDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-history.html',
  styleUrls: ['./leave-history.scss']
})
export class LeaveHistoryComponent {
  @Input() leaves: Leave[] = [
    { leaveType: 'Annual Leave', fromDate: '2025-09-01', toDate: '2025-09-05', status: 'Approved' },
    { leaveType: 'Sick Leave', fromDate: '2025-09-10', toDate: '2025-09-12', status: 'Rejected' },
    { leaveType: 'Casual Leave', fromDate: '2025-09-15', toDate: '2025-09-16', status: 'Pending' }
  ];
}
