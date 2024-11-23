import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserLogin } from '../../model/class/User';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'app-customer-login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customer-login-form.component.html',
  styleUrl: './customer-login-form.component.css'
})
export class CustomerLoginFormComponent {
  customerService = inject(CustomerService)
  authService = inject(AuthService)
  loginModel: UserLogin;

  constructor(private router: Router) {
    // Initialize the login model
    this.loginModel = new UserLogin();
  }

  // Handle form submission
  onSubmit() {
    if (this.loginModel) {
      this.authService.login('user', this.loginModel).subscribe({
        next: (response) => {
          console.log('Customer Logged In Successfully:', response);
          // Redirect
          alert('Successful logged In! Redirecting to Dashboard...');
          this.router.navigate(['user/dashboard']);
        },
        error: (err) => {
          console.error('Error occurred during login:', err);
          // Show an error message to the user
          alert('Login failed. Please try again later.');
        }
      });
    }
  }
}
