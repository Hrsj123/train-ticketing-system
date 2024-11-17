import { Component, inject } from '@angular/core';
import { CustomerRegistration } from '../../model/class/User';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-register-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customer-register-form.component.html',
  styleUrl: './customer-register-form.component.css'
})
export class CustomerRegisterFormComponent {
  customerService = inject(CustomerService);

  customer: CustomerRegistration;

  constructor(private router: Router) {
    // Initialize the customer model
    this.customer = new CustomerRegistration();
  }

  // Handle form submission
  onSubmit() {
    if (this.customer) {
      this.customerService.postCustomer(this.customer).subscribe({
        next: (response) => {
          console.log('Customer Registered Successfully:', response);
          alert('Registration successful! Redirecting to login...');
          this.router.navigate(['user/login']);
        },
        error: (err) => {
          console.error('Error occurred during registration:', err);

          // Show an error message to the user
          alert('Registration failed. Please try again later.');
        }
      });
      console.log('Customer Registered:', this.customer);
      // TODO: redirect to login...
    } else {
      console.warn('No customer data to submit.');
      alert('Please fill in all required fields.');
    }
  }

}
