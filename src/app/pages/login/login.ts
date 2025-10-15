import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { LoginModel } from '../../Models/login.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class Login {
  // بيانات تجريبية للاختبار
  email: string = 'user3@example.com';
  password: string = 'mypassword';
  rememberMe: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  
  // لعرض تفاصيل الطلب والاستجابة
  requestDetails: string = '';
  responseDetails: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.requestDetails = '';
    this.responseDetails = '';
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      return;
    }

    this.isLoading = true;

    const credentials: LoginModel = {
      email: this.email.trim(),
      password: this.password.trim()
    };

    // عرض البيانات المرسلة
    this.requestDetails = JSON.stringify(credentials, null, 2);
   // console.log('📤 Sending Request to:', 'http://localhost:8047/api/auth/login');
   // console.log('📤 Request Body:', credentials);

    this.loginService.login(credentials).subscribe({
      next: (response) => {
       // console.log('✅ Login Successful!');
       // console.log('📥 Response:', response);
        
        this.isLoading = false;
        this.responseDetails = JSON.stringify(response, null, 2);
        this.successMessage = 'Login successful!';
        
        // حفظ التوكن
        if (response.token) {
          localStorage.setItem('authToken', response.token);
         // console.log('🔑 Token saved:', response.token.substring(0, 20) + '...');
        }
        
        // حفظ بيانات المستخدم
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
         // console.log('👤 User saved:', response.user);
        }
        

        // الانتقال للصفحة الرئيسية بعد 2 ثانية
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Login Failed!');
        console.error('📥 Error Details:', error);
        
        this.isLoading = false;
        this.responseDetails = JSON.stringify({
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        }, null, 2);
        
        // معالجة الأخطاء
        if (error.status === 0) {
          this.errorMessage = '🔴 Cannot connect to Backend! Check if server is running on http://localhost:8047';
          console.error('💡 Solutions:');
          console.error('   1. Make sure Backend is running');
          console.error('   2. Check the URL: http://localhost:8047/api/auth/login');
          console.error('   3. Enable CORS in Backend');
        } else if (error.status === 401) {
          this.errorMessage = '🔴 Wrong email or password!';
        } else if (error.status === 404) {
          this.errorMessage = '🔴 API endpoint not found! Check URL.';
        } else if (error.status === 500) {
          this.errorMessage = '🔴 Server error occurred!';
        } else {
          this.errorMessage = `🔴 Error ${error.status}: ${error.error?.message || error.message}`;
        }
      }
    });
  }

  // دالة لاختبار الاتصال بالـ Backend
  testConnection(): void {
   // console.log('🔍 Testing Backend connection...');
    
    fetch('http://localhost:8047/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.email,
        password: this.password
      })
    })
    .then(response => {
     // console.log('✅ Backend is reachable!');
      //console.log('📊 Status:', response.status);
      return response.json();
    })
    .then(data => {
     // console.log('📥 Response Data:', data);
      alert('Backend connection successful! ✅');
    })
    .catch(error => {
      console.error('❌ Backend connection failed!');
      console.error('Error:', error);
      alert('Backend connection failed! ❌\nCheck console for details.');
    });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.requestDetails = '';
    this.responseDetails = '';
  }
}