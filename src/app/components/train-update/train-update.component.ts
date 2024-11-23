import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { TrainDashboard, TrainRegister } from '../../model/class/Train';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ITrain } from '../../model/interface/train';

@Component({
  selector: 'app-train-update',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './train-update.component.html',
  styleUrl: './train-update.component.css'
})
export class TrainUpdateComponent implements OnInit {

  @Input() trainData!: ITrain; // Receives the train data
  @Input() isUpdateModalOpen!: boolean; // Recieves modal visibility
  @Output() closeUpdateModal = new EventEmitter<any>();

  AdminService = inject(AdminService);

  updatedTrain: TrainRegister;

  constructor() {
    this.updatedTrain = new TrainRegister();
  }
  ngOnInit(): void {
    const day = 24 * 60 * 60 * 1000;
    this.updatedTrain = new TrainRegister(
      this.trainData.trainId,
      this.trainData.trainName,
      this.trainData.startLocation,
      this.trainData.endLocation,
      this.trainData.status,
      this.trainData.startDateTime,
      this.trainData.endDateTime,
      this.trainData.totalSeatCount,
    );
  }

  // Opens the modal and populates train data
  openUpdateModal(train: TrainRegister): void {
    this.isUpdateModalOpen = true;
    this.updatedTrain = { ...train }; // Clone train object to prevent mutation
  }

  // Closes the modal
  closeUpdateModalHandler(): void {
    this.isUpdateModalOpen = false;
    this.closeUpdateModal.emit();
  }


  // Updates the train
  updateTrain(): void {
    this.AdminService.updateTrain(this.updatedTrain.trainId, this.updatedTrain).subscribe({
      next: (response) => {
        console.log('Train updated successfully:', response);
        this.closeUpdateModalHandler();
        // this.refreshTrainList(); // Refresh train list after update
      },
      error: (error) => {
        console.error('Error updating train:', error);
      },
    });
  }

}
