import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf directive
import { AuthService } from '../../Services/auth.service';  // Import AuthService for authentication
import { Router } from '@angular/router';  // Import Router to navigate after logout

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],  // Ensure CommonModule is imported for *ngIf to work
  templateUrl: './header.component.html',  // External template for the header
  styleUrls: ['./header.component.css']  // External styles for the header
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;  // Default assumption: user is not logged in
  userRoles: string[] = [];  // To store the user's roles (Admin, Owner, User)
  
  constructor(private authService: AuthService, private router: Router) {}

  // Method to handle user logout
  handleLogout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      alert('No refresh token found!');
      return;
    }

    this.authService.logout(refreshToken).subscribe({
      next: (response) => {
        alert(response.message);  // Display a success message after logout
        this.resetSession();
        this.router.navigate(['/']);  // Navigate to the home page after logout
      },
      error: (err) => {
        console.error('Logout Failed:', err);
        alert(`Logout Failed: ${err.message}`);
      }
    });
  }

  // Method to reset the session (remove tokens and roles)
  resetSession() {
    this.isLoggedIn = false;
    this.userRoles = [];
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roles');
  }

  // Method to check the login status and roles of the user
  checkLoginStatus() {
    const accessToken = localStorage.getItem('accessToken');
    const roles = localStorage.getItem('roles');
    this.isLoggedIn = !!accessToken;  // If accessToken exists, the user is logged in

    // Parse the roles stored in localStorage (assuming it's a comma-separated string)
    if (roles) {
      this.userRoles = roles.split(',');
    }
  }

  // Method to redirect to the salle de sport page
  goToSalleDeSport() {
    this.router.navigate(['/salledesport']);  // Redirect to the /salledesport page
  }

  ngOnInit() {
    this.checkLoginStatus();  // Check login status when the component is initialized
  }
}
