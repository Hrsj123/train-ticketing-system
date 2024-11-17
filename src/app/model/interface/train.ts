export interface ITrain {
    trainId: number;
    trainName: string;
    trainNumber: number;
    startLocation: string;
    endLocation: string;
    status: boolean;
    startDateTime: Date;
    endDateTime: Date;
    totalSeatCount: number;
}

export interface ITrainDashboard {
    trainId: number;
    trainNumber: number;
    trainName: string;
    route: string;
    
    getDashboardRepr(): object;
}
