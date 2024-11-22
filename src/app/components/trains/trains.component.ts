import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
import { TrainService } from '../../services/train.service';
import { ITrain } from '../../model/interface/train';

@Component({
  selector: 'app-trains',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './trains.component.html',
  styleUrl: './trains.component.css',
  providers: [DatePipe]
})
export class TrainsComponent implements OnInit {
  trainService = inject(TrainService);
  datePipe = inject(DatePipe)
  isLoading: boolean = true;
  
  constructor() { }

  dataList: ITrain[] = [];

  ngOnInit(): void {
    this.trainService.getTrainsData().subscribe({
      next: (trains: ITrain[]) => {
        this.dataList = [...this.dataList, ...trains];
      },
      error: (err: any) => {
        console.error('Error occurred:', err);
      }
    });
    this.isLoading = false;
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const daySuffix = this.getDaySuffix(day);  // Get day suffix (st, nd, rd, th)
    const formattedDate = this.datePipe.transform(date, `d${daySuffix} MMMM yyyy, h:mm a`);
    return formattedDate || '';  // Return the formatted date or empty string
  }

  getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
}
