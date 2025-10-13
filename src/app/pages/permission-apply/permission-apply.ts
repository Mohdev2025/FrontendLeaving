import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface Permission {
  permissionType: 'before-work' | 'during-work' | 'leave-early';
  date: string;
  from: string;
  to: string;
  reason: string;
  userId?: string;
}

@Component({
  selector: 'app-permission-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './permission-apply.html',
  styleUrls: ['./permission-apply.scss']
})
export class PermissionApplyComponent implements OnInit {
  permissionForm: FormGroup;
  calculatedDuration: number = 0;

  @Output() permissionApplied = new EventEmitter<Permission>();

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.permissionForm = this.fb.group({
      permissionType: ['', Validators.required],
      date: ['', Validators.required],
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.permissionForm.get('fromTime')?.valueChanges.subscribe(() => this.calculateDuration());
    this.permissionForm.get('toTime')?.valueChanges.subscribe(() => this.calculateDuration());
  }

  calculateDuration() {
    const fromTime = this.permissionForm.get('fromTime')?.value;
    const toTime = this.permissionForm.get('toTime')?.value;

    if (fromTime && toTime) {
      const from = this.timeToMinutes(fromTime);
      const to = this.timeToMinutes(toTime);
      this.calculatedDuration = to > from ? (to - from) / 60 : 0;
    }
  }

  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  applyPermission() {
    if (!this.permissionForm.valid) {
      alert('Please fill in all fields!');
      return;
    }

    if (this.calculatedDuration <= 0) {
      alert('End time must be after start time!');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('User not found! Please log in again.');
      return;
    }
    const user = JSON.parse(storedUser);

    const apiPayload = {
      permissionType: this.permissionForm.value.permissionType,
      date: this.permissionForm.value.date,
      from: this.permissionForm.value.fromTime,
      to: this.permissionForm.value.toTime,
      reason: this.permissionForm.value.reason,
      userId: user.id
    };

    const apiUrl = 'http://localhost:8047/api/permission/create';
    const token = localStorage.getItem('authToken');
    const headers = token
      ? new HttpHeaders({ Authorization: token, 'Content-Type': 'application/json' })
      : new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(apiUrl, apiPayload, { headers })
      .pipe(
        catchError(err => {
          console.error('Error applying permission', err);
          alert('Failed to submit permission. Check console for details.');
          return throwError(() => err);
        })
      )
      .subscribe((response: any) => {
        alert('Permission submitted successfully!');
        this.permissionApplied.emit(apiPayload);
        this.permissionForm.reset();
        this.calculatedDuration = 0;
        console.log('API Response:', response);
      });
  }

  getPermissionTypeLabel(type: string): string {
    const labels: any = {
      'before-work': 'Before Work',
      'during-work': 'During Work',
      'leave-early': 'Leave Early'
    };
    return labels[type] || type;
  }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             