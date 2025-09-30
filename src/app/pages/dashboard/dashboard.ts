import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveApplyComponent,Leave } from '../leave-apply/leave-apply';
import { LeaveHistoryComponent } from '../leave-history/leave-history';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LeaveApplyComponent, LeaveHistoryComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  leaves = signal<Leave[]>([]);
  activeTab = signal<'apply' | 'history'>('apply'); // active tab

  // change tab
  selectTab(tab: 'apply' | 'history') {
    this.activeTab.set(tab);
  }

  addLeave(newLeave: Leave) {
    this.leaves.update(current => [...current, newLeave]);
    this.activeTab.set('history'); // switch to history after applying
  }

  // mock employee info
  employee = {
    name: 'Salma Alalawi',
    position: 'Software Developer',
    department: 'IT Department',
    contract: 'Sub-Contract',
    photo: 'https://i.pravatar.cc/150?img=2'
  };
}
