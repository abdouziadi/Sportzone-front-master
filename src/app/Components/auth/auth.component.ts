import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class AuthComponent {
  // Forms for registration and login
  signupForm = {
    username: '',
    email: '',
    password: '',
    adresse: '',
    roles: ['USER'] // Default role is USER, can also be 'OWNER'
  };

  loginForm = {
    username: '',
    password: ''
  };

  // Authentication status
  isLoggedIn = false;
  userDetails: any = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false; // Flag to show loading state

  showRegister = true; // Toggle between Register and Login sections

  constructor(private authService: AuthService, private router: Router) {}

  // Handle User Signup
  handleSignup() {
    if (this.signupForm.roles[0] === 'ADMIN') {
      this.errorMessage = 'You cannot register as an ADMIN!';
      return;
    }

    this.loading = true;
    this.authService.signup(this.signupForm).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.resetForms();
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = `Signup Failed: ${err.message}`;
      },
      complete: () => (this.loading = false) // Reset loading state when request is completed
    });
  }

  // Handle User Login
  handleLogin() {
    this.loading = true;
    this.authService.signin(this.loginForm).subscribe({
      next: (response) => {
        this.isLoggedIn = true;
        this.userDetails = response;

        // Save tokens to localStorage
        localStorage.setItem('accessToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);

        // Extract and save the role
        if (response.roles && response.roles.length > 0) {
          const userRole = response.roles[0];
          this.updateUserRole(userRole); // Update role in localStorage
        }

        alert('Login Successful!');
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = `Login Failed: ${err.message}`;
      },
      complete: () => (this.loading = false)
    });
  }

  // Update User Role in localStorage
  updateUserRole(role: string) {
    localStorage.setItem('userRole', role);
    console.log(`User role updated to: ${role}`);
  }

  // Example method to simulate role change (can be tied to a role management UI)
  changeRole(newRole: string) {
    if (newRole) {
      this.updateUserRole(newRole); // Update role in localStorage
      alert(`Role changed to ${newRole}`);
    } else {
      console.error('Invalid role provided!');
    }
  }

  // Handle User Logout
  handleLogout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      alert('No refresh token found!');
      return;
    }

    this.loading = true;
    this.authService.logout(refreshToken).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.resetSession();
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = `Logout Failed: ${err.message}`;
      },
      complete: () => (this.loading = false)
    });
  }

  // Helper Methods
  resetForms() {
    this.signupForm = { username: '', email: '', password: '', adresse: '', roles: ['USER'] };
    this.loginForm = { username: '', password: '' };
    this.errorMessage = null;
    this.successMessage = null;
  }

  resetSession() {
    this.isLoggedIn = false;
    this.userDetails = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    this.errorMessage = null;
    this.successMessage = null;
  }
}
