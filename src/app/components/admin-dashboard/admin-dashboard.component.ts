import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrainService } from '../../services/train.service';
import { ITrain } from '../../model/interface/train';
import { IUser } from '../../model/interface/user';
import { AdminService } from '../../services/admin.service';
import { FilterPipe } from './filter.pipe';
import { IBooking } from '../../model/interface/booking';
import { TrainRegister } from '../../model/class/Train';
import { HttpResponse } from '@angular/common/http';
import { TrainUpdateComponent } from '../train-update/train-update.component';
import { RouterLinkActive } from '@angular/router';
import { SidebarPositionDirective } from '../../directives/sidebar-position.directive';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [TrainUpdateComponent, FormsModule, JsonPipe, CommonModule, FilterPipe, RouterLinkActive, SidebarPositionDirective],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  // Services
  AdminService = inject(AdminService);
  trainService = inject(TrainService);

  // Registering new Train
  newTrain: TrainRegister;
  isModalOpen = false;

  // Updating train   TODO: Fix BUG!
  isUpdateModalOpen: boolean = false; // Modal visibility
  selectedTrain: TrainRegister = new TrainRegister(); // Train data to pass

  // API data
  trains: ITrain[] = [];
  users: IUser[] = [];
  bookings: any[] = [];
  reportData: any;

  // Helper variables
  searchQuery: string = '';
  bookingQuery: string = '';

  constructor() {
    this.newTrain = new TrainRegister();
  }

  ngOnInit(): void {
    this.loadTrains();
    this.loadUsers();
    this.loadBookings();
  }

  loadTrains() {
    this.trainService.getTrainsData().subscribe({
      next: (trains: ITrain[]) => {
        const newTrains: ITrain[] = trains.map(train => {
          train.trainNumber = parseInt(train.trainName.split(' ')[1]);
          return train;
        });
        this.trains = [...this.trains, ...newTrains];
      },
      error: (err: any) => {
        console.error('Error occurred:', err);
      }
    });
  }

  loadUsers() {
    this.AdminService.getDashboardUsers().subscribe({
      next: (users: IUser[]) => {
        this.users = [...this.users, ...users];
      },
      error: (err: any) => {
        console.error('Error occurred:', err);
      }
    });
  }

  loadBookings() {
    this.AdminService.getDashboardBookings().subscribe({
      next: (bookings: IBooking[]) => {
        this.bookings = [...this.bookings, ...bookings];
      },
      error: (err: any) => {
        console.error('Error occurred:', err);
      }
    });
  }

  registerTrain() {
    this.AdminService.postReisterTrain(this.newTrain).subscribe({
      next: (response: HttpResponse<any>) => {

        if (response.ok) {
          let newTrainCopy: any = {
            trainId: response.body.trainId,
            trainName: this.newTrain.trainName + " " + this.newTrain.trainNumber,
            route: this.newTrain.startLocation + " to " + this.newTrain.endLocation,
          }
          this.trains.push({ ...newTrainCopy });
          this.newTrain = new TrainRegister();
          this.closeModal();
        } else {
          alert("Failed to register train");
        }
      },
      error: (error) => {
        console.error('Error posting booking:', error);
      }
    });
  }

  deleteTrain(train: ITrain) {
    console.log('Deleting train:', train);
    this.AdminService.deleteTrain(train.trainId).subscribe({
      next: (response) => {
        if (response.status === 204) {
          this.trains = this.trains.filter(t => t.trainId !== train.trainId);
          console.log(this.trains);
        } else {
          this.showAlert("Failed to Remove Train");
        }
      },
      error: (error) => {
        console.error('Error posting booking:', error);
      }
    });

  }

  blockUser(user: any) {   // TODO
    console.log('Blocking user:', user);
    // API call to block user
  }
  
  cancelBooking(booking: any) {   // TODO
    console.log('Cancelling booking:', booking);
    this.bookings = this.bookings.filter(b => b.pnr !== booking.pnr);
    // API call to cancel booking
  }


  // Helper methods
  showAlert(message: string) {
    alert(message);
  }

  openModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = '';
  }

  openUpdateModal(train: any) {
    let { trainId, ...putData } = train;
    this.selectedTrain = { ...putData }; // Set the train data
    this.isUpdateModalOpen = true; // Open modal
    console.log(this.isUpdateModalOpen);
  }

  // Closes the modal
  closeUpdateModal(): void {
    this.isUpdateModalOpen = false;
  }

}
