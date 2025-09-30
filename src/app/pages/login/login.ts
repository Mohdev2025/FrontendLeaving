import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <-- add this
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule] // <-- add CommonModule here
})
export class Login {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    const correctEmail = 'salma@g.com';
    const correctPassword = '12345';

    if (this.email.trim() === correctEmail && this.password.trim() === correctPassword) {
      this.errorMessage = '';
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Wrong email or password!';
    }
  }
}
