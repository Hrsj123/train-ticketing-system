import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrainService } from '../../services/train.service';
import { ITrain } from '../../model/interface/train';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  trainService = inject(TrainService);

  currentFeature: string = 'dashboard';
  searchCriteria = { origin: '', destination: '', travelDate: '' };
  trains: any[] = []; // Trains data will populate here
  bookings: any[] = []; // Bookings data will populate here
  customerDetails: any = {}; // Customer profile data
  bookingDetails: any = {}; // Booking form data
  cancelDetails: any = {}; // Cancellation form data

  username: string;

  constructor() {
    const userData = localStorage.getItem("userData");
    if (userData !== null) {
      this.username = JSON.parse(userData).userName;
    } else {
      this.username = "User"
    }
  }

  ngOnInit(): void {
    // Dummy data for testing
    this.customerDetails = {
      userId: 1,
      userName: 'testUser',
      address: '123 Test Lane',
      phoneNumber: '1234567890',
      age: 30,
      gender: 'Male'
    };

    this.bookings = [
      {
        bookingId: 1,
        trainName: 'Express Train 101',
        origin: 'City A',
        destination: 'City B',
        travelDate: '2024-11-20',
        seatNumbers: ['A1', 'A2'],
        status: 'Confirmed'
      },
      {
        bookingId: 2,
        trainName: 'Local Train 202',
        origin: 'City C',
        destination: 'City D',
        travelDate: '2024-12-01',
        seatNumbers: ['B1'],
        status: 'Cancelled'
      }
    ];

    this.trainService.getTrainsData().subscribe({
      next: (trains: ITrain[]) => {
        this.trains = [...this.trains, ...trains];
      },
      error: (err: any) => {
        console.error('Error occurred:', err);
      }
    });
    // this.trains = [
    //   {
    //     trainId: 1,
    //     trainName: 'Express Train 101',
    //     startLocation: 'City A',
    //     endLocation: 'City B',
    //     departureTime: '08:00 AM',
    //     arrivalTime: '12:00 PM',
    //     availableSeats: 50
    //   },
    //   {
    //     trainId: 2,
    //     trainName: 'Local Train 202',
    //     startLocation: 'City C',
    //     endLocation: 'City D',
    //     departureTime: '02:00 PM',
    //     arrivalTime: '06:00 PM',
    //     availableSeats: 25
    //   }
    // ];
  }

  showFeature(feature: string): void {
    this.currentFeature = feature;
  }

  searchTrains(): void {
    console.log('Search Criteria:', this.searchCriteria);
    // Filter dummy data based on criteria
    this.trains = this.trains.filter(
      (train) =>
        train.startLocation.toLowerCase() ===
          this.searchCriteria.origin.toLowerCase() &&
        train.endLocation.toLowerCase() ===
          this.searchCriteria.destination.toLowerCase()
    );
  }

  proceedToBooking(train: any): void {
    console.log('Proceeding to booking for:', train);
    this.currentFeature = 'bookTicket';
    this.bookingDetails = {
      trainId: train.trainId,
      trainName: train.trainName,
      origin: train.startLocation,
      destination: train.endLocation,
      travelDate: this.searchCriteria.travelDate
    };
  }

  bookTicket(): void {
    console.log('Booking Details:', this.bookingDetails);
    // Simulate successful booking
    this.bookings.push({
      ...this.bookingDetails,
      bookingId: Math.random(), // Replace with real ID from API
      seatNumbers: ['C1', 'C2'], // Dummy seats
      status: 'Confirmed'
    });
    this.currentFeature = 'dashboard';
  }

  cancelTicket(): void {
    console.log('Cancellation Details:', this.cancelDetails);
    // Simulate cancellation
    const booking = this.bookings.find(
      (b) => b.bookingId === this.cancelDetails.bookingId
    );
    if (booking) booking.status = 'Cancelled';
  }

  updateProfile(): void {
    console.log('Updated Customer Details:', this.customerDetails);
    // Simulate update
  }
}
