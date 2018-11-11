import * as moment from 'moment';

export class Baby {
    id: string;
    name: string;
    motherId: string;
    createDate: number;
    birthDate: number;
    allergy: Array<string> = [];
    note: string;
    avatar: string = "default";
    trustedPeople: Array<any> = [];

    isTrusted: boolean = false;

    // cares lists
    milk: Array<any> = [];
    water: Array<any> = [];
    bath: Array<any> = [];
    nappy: Array<any> = [];
    sleep: Array<any> = [];
    comment: Array<any> = [];
    weight: Array<any> = [];
    size: Array<any> = [];
    temperature: Array<any> = [];
    meal: Array<any> = [];
    calendar: Array<any> = [];

    constructor(newBaby) {
        this.id = newBaby.id;
        this.name = newBaby.name;
        this.motherId = newBaby.motherId;
        this.createDate = newBaby.createDate;
        this.birthDate = newBaby.birthDate;
        this.allergy = newBaby.allergy;
        this.note = newBaby.note;
        this.trustedPeople = newBaby.trustedPeople;
        this.calendar = newBaby.calendar
    }

    getBirhDate() {
        let birth = moment(this.birthDate);
        return birth.format('DD MM YYYY');
    }
}