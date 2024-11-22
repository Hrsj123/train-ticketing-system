export class CustomerRegistration {
    userName: string;
    address: string;
    phoneNumber: string;
    age: number;
    gender: string;
    password: string;

    constructor() {
        this.userName = "";
        this.address = "";
        this.phoneNumber = "";
        this.age = 0;
        this.gender = "";
        this.password = "";
    }
}

export class UserLogin {
    userName: string;
    password: string;

    constructor() {
        this.userName = "";
        this.password = "";
    }
}