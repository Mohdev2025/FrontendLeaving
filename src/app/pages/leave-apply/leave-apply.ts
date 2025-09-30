import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Define and export Leave interface
export interface Leave {
  leaveType: string;
  fromDate: string;
  toDate: string;
  description: string;
}

@Component({
  selector: 'app-leave-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leave-apply.html',
  styleUrls: ['./leave-apply.scss']
})
export class LeaveApplyComponent {
  leaveForm: FormGroup;
  leaveTypes = ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Other'];

  // Emit leave to parent component (Dashboard)
  @Output() leaveApplied = new EventEmitter<Leave>();

  constructor(private fb: FormBuilder) {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  applyLeave() {
    if (this.leaveForm.valid) {
      const newLeave: Leave = this.leaveForm.value;
      this.leaveApplied.emit(newLeave); // send leave to dashboard
      alert('Leave Applied Successfully!');
      this.leaveForm.reset();
    } else {
      alert('Please fill all fields!');
    }
  }
}
