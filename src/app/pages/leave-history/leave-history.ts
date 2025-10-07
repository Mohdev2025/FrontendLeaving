import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../service/leave.service';

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-history.html',
  styleUrls: ['./leave-history.scss']
})
export class LeaveHistoryComponent implements OnInit {
  leaves: any[] = [];

  constructor(private leaveService: LeaveService) {}

  ngOnInit() {
    this.leaveService.getAllLeavesWithType().subscribe({
      next: (data) => {
        // 🔄 تحويل البيانات القادمة من API إلى الشكل المطلوب
        this.leaves = data.map((leave: any) => ({
          leaveType: Array.isArray(leave.fields['type name'])
            ? leave.fields['type name'][0]
            : leave.fields['type name'],
          fromDate: leave.fields['start time'],
          toDate: leave.fields['end time'],
          status: leave.fields['status']
        }));
      },
      error: (err) => console.error('❌ Error fetching leaves:', err)
    });
  }
}
