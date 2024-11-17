import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserLogin } from '../../model/class/User';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login-form.component.html',
  styleUrl: './admin-login-form.component.css'
})
export class AdminLoginFormComponent {
  adminLogin: UserLogin = new UserLogin();
  loginError: boolean = false;

  constructor(private router: Router) { }

  // Handle form submission
  onSubmit() {  // TODO: API Call here!
    // Normally, you would call a service to verify the credentials
    // If credentials are correct, navigate to the admin dashboard
    if (this.adminLogin.userName === 'admin' && this.adminLogin.password === 'admin123') {
      console.log("User and Password matched!!!");
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.loginError = true; // Show error message
    }
  }
}
