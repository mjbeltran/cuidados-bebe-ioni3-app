import { Injectable } from '@angular/core';
import { FirestoreProvider } from '../firestore/firestore';
import {
  Loading,
  LoadingController
} from 'ionic-angular';

import * as moment from 'moment';

import { Baby } from '../../classes/baby';


import { Observable } from 'rxjs';

@Injectable()
export class UserProvider {

  nickName: string = "";
  firstName: string = "";
  lastName: string = "";
  phone: number = null;
  uid: string = "";
  email: string;
  signupDate: number;

  loading;
  loadedCares: number = 0;
  babies: Array<Baby> = [];
  trustedBabies: Array<Baby> = [];
  currentBaby: Baby;


  constructor(
    private fireStore: FirestoreProvider,
    private loadingCtrl: LoadingController

  ) {
    console.log('UserProvider');
  }

  // Getter **********************************************

  getSignupDate() {
    let date = moment(this.signupDate);
    return date.format('DD MM YYYY')
  }

  /*******************************************************************/
  /*           USER PROFILE                                          */
  /*******************************************************************/

  saveNewUser() {
    let date = Date.now();
    let newUser = {
      nickName: this.nickName,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      email: this.email,
      signupDate: date
    };
    this.fireStore.createUser(newUser, this.uid)
      .then(resp => {
        console.log(resp);
      });
  }

  updateUser(): Promise<any> {
    let newUser = {
      nickName: this.nickName,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      email: this.email
    };
    return this.fireStore.updateUser(newUser, this.uid);
  }


  loadUser(): Promise<any> {
    return this.fireStore.loadUser(this.uid)
      .then(user => {
        if (!user) {
          console.log('error: bad uid')
        } else {
          this.nickName = user.data().nickName;
          this.firstName = user.data().firstName;
          this.lastName = user.data().lastName;
          this.phone = user.data().phone;
          this.email = user.data().email;
          this.signupDate = user.data().signupDate;
          this.getBabies();
        }
      });
  }

  resetUser() {
    this.nickName = "";
    this.firstName = "";
    this.lastName = "";
    this.phone = null;
    this.uid = "";
    this.email = "";
    this.signupDate = 0;
    this.babies = [];
    this.currentBaby = null;
  }

  getUserByEmail(email) {
    let that = this;
    return new Observable(observer => {
      this.fireStore.getCarerByEmail(email).then(resp => {
        let responce: Array<any> = [];
        if (!resp.empty) {
          resp.forEach(element => {
            let user = element.data();
            user.id = element.id;
            responce.push(user);
          });
        }
        observer.next(responce);
        observer.complete();
      })
    })
  }

  /*******************************************************************/
  /*           BABIES MANAGEMENT                                     */
  /*******************************************************************/

  createBaby(newBaby): Promise<any> {
    let createDate = Date.now();
    newBaby.motherId = this.uid;
    newBaby.createDate = createDate;
    newBaby.trustedPeople.forEach(element => {
      newBaby[element.id] = true;
    });
    return this.fireStore.createBaby(newBaby).then(resp => {
      this.getBabies();
    })
  }

  getBabies() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.babies = [];
    this.fireStore.getBabies(this.uid).then(resp => {
      loading.dismiss();
      if (!resp.empty) {
        resp.forEach(element => {
          let newBabyData = element.data();
          newBabyData.id = element.id;

          newBabyData.calendar.forEach(element => {
            element.startTime = new Date(element.startTime);
            element.endTime = new Date(element.endTime);
          });

          let newBaby = new Baby(newBabyData);
          this.babies.push(newBaby);
        });
      } else {
        console.log('pas de bébé')
      }
      console.log(this.babies);
      this.getTrustedBabies();
    })
  }

  getTrustedBabies() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.fireStore.getTrustedBabies(this.uid).then(resp => {
      loading.dismiss();
      if (!resp.empty) {
        resp.forEach(element => {
          let newBabyData = element.data();
          newBabyData.id = element.id;
          let newBaby = new Baby(newBabyData);
          this.babies.push(newBaby);
        });
      } else {
        console.log('pas de bébé')
      }
    })
  }

  updateBaby(babyId, baby): Promise<any> {
    baby.trustedPeople.forEach(element => {
      baby[element.id] = true;
    });
    return this.fireStore.updateBaby(babyId, baby)
  }

  getMumName(): Promise<any> {
    return this.fireStore.getCarer(this.currentBaby.motherId)
  }

  /*******************************************************************/
  /*            CARES MANAGEMENT                                     */
  /*******************************************************************/

  getCarerName(id): Promise<any> {
    return this.fireStore.getCarer(id)
  }

  newCare(type, content): Promise<any> {
    let createDate = parseInt(moment().locale('fr').format('x'));
    content.createDate = createDate;
    content.carerId = this.uid;
    return this.fireStore.newCare(type, this.currentBaby.id, content).then(resp => {
      this.getCares(type);
    });
  }

  editCare(careId, type, content): Promise<any> {
    return this.fireStore.updateCare(type, careId, this.currentBaby.id, content).then(resp => {
      this.getCares(type);
    });
  }

  deleteCare(careId, type): Promise<any> {
    return this.fireStore.deleteCare(type, careId, this.currentBaby.id).then(resp => {
      this.getCares(type);
    });
  }

  getCares(type) {
    this.fireStore.getCares(type, this.currentBaby.id).then(resp => {
      this.currentBaby[type] = [];
      if (!resp.empty) {
        resp.forEach(element => {
          let newCare: any = element.data();
          newCare.id = element.id;
          newCare.carerName = "";
          this.currentBaby[type].push(newCare);
          this.currentBaby[type].sort((a, b) => {
            return b.createDate - a.createDate;
          });
        });
        // get carer name and add it to object        
        this.currentBaby[type].forEach(element => {
          this.getCarerName(element.carerId).then(resp => {
            element.carerName = resp.data().nickName;
          })
        });
        console.log(type + ' loaded')
      } else {
        console.log('no ' + type + ' today...')
      }
      this.loadedCares += 1;
    })
  }

  /*******************************************************************/
  /*            CALENDAR MANAGEMENT                                  */
  /*******************************************************************/

  saveCalendar(): Promise<any>{
    console.log(this.currentBaby.calendar);
    return this.fireStore.saveCalendar(this.currentBaby.id, this.currentBaby.calendar);
  }

}
