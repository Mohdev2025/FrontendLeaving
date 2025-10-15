import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Leave interface
export interface Leave {
  leaveType: string;  // Airtable recordId
  fromDate: string;
  toDate: string;
  description: string;
  status: string;
  userId?: string;
}

@Component({
  selector: 'app-leave-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leave-apply.html',
  styleUrls: ['./leave-apply.scss']
})
export class LeaveApplyComponent implements OnInit {
  leaveForm: FormGroup;

  // Array of leave types fetched from API
  leaveTypes: { name: string; id: string }[] = [];

  @Output() leaveApplied = new EventEmitter<Leave>();

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Fetch leave types from API
    this.http.get<{ name: string; id: string }[]>('http://localhost:8047/api/leave/types')
      .pipe(
        catchError(err => {
          console.error('Error fetching leave types', err);
          alert('Failed to load leave types.');
          return throwError(err);
        })
      )
      .subscribe(types => {
        this.leaveTypes = types.filter(t => t.name); // استبعد null
      });
  }

  applyLeave() {
    if (!this.leaveForm.valid) {
      alert('Please fill all fields!');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('User not found! Please login again.');
      return;
    }
    const user = JSON.parse(storedUser);

    const newLeave: Leave = {
      ...this.leaveForm.value,
      status: 'Requested',
      userId: user.id,
      name: user.name
    };

    const apiUrl = 'http://localhost:8047/api/leave/apply';
    const token = localStorage.getItem('authToken');
    const headers = token
      ? new HttpHeaders({ Authorization: token, 'Content-Type': 'application/json' })
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(apiUrl, newLeave, { headers })
      .pipe(
        catchError(err => {
          console.error('Error applying leave', err);
          alert('Failed to apply leave. See console for details.');
          return throwError(err);
        })
      )
      .subscribe((response: any) => {
        alert('Leave Applied Successfully!');
        this.leaveApplied.emit(newLeave); // إرسالها للـ Dashboard
        this.leaveForm.reset();
        console.log('API Response:', response);
      });
  }
}
