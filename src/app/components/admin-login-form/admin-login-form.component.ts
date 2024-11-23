import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserLogin } from '../../model/class/User';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'app-admin-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login-form.component.html',
  styleUrl: './admin-login-form.component.css'
})
export class AdminLoginFormComponent {
  // Service
  adminService = inject(AdminService);
  authService = inject(AuthService);

  adminLogin: UserLogin = new UserLogin();
  loginError: boolean = false;

  constructor(private router: Router) { }

  // Handle form submission
  onSubmit() {
    this.authService.login('admin', this.adminLogin).subscribe({
      next: (res) => {
        alert("Login Successfull, Redirecting to Dashboard");
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.loginError = true;
        console.error("Error Occured " + err);
      }
    });
  }
}
