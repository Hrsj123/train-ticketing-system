import { ITrainDashboard } from "../interface/train";

export class TrainRegister {
    trainId: number;
    trainName: string;
    trainNumber: number;
    startLocation: string;
    endLocation: string;
    status: boolean;
    startDateTime: Date;
    endDateTime: Date;
    totalSeatCount: number;

    constructor(
        trainId: number = 0,
        trainName: string = '',
        startLocation: string = '',
        endLocation: string = '',
        status: boolean = true,
        startDateTime: Date = new Date(),
        endDateTime: Date = new Date(),
        totalSeatCount: number = 0
    ) {
        this.trainId = trainId;
        this.trainName = trainName.split(" ")[0];
        this.trainNumber = parseInt(trainName.split(" ")[1]);
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.status = status;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.totalSeatCount = totalSeatCount;
    }
}

export class TrainDashboard implements ITrainDashboard {
    trainId: number;
    trainNumber: number;
    trainName: string;
    route: string;
    constructor(
        trainId: number = 0,
        trainNumber: number = 0,
        trainName: string = "",
        route: string = "",
    ) {
        this.trainId = trainId;
        this.trainNumber = trainNumber;
        this.trainName = trainName;
        this.route = route;
    }

    getDashboardRepr(): object {
        return {
            trainId: this.trainId,
            trainNumber: this.trainNumber,
            trainName: this.trainName,
            route: this.route,
        };
    }

}