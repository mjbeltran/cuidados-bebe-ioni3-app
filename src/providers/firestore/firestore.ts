import { Injectable } from '@angular/core';
import firebase from 'firebase';

import * as moment from 'moment';


@Injectable()
export class FirestoreProvider {

  private config = {
    apiKey: "AIzaSyC_tAI785GspXB2-f48mf-ORYZ4knpa6go",
    authDomain: "bebe-care.firebaseapp.com",
    databaseURL: "https://bebe-care.firebaseio.com",
    projectId: "bebe-care",
    storageBucket: "",
    messagingSenderId: "712164253810"
  };
  private db: any;


  constructor() {
    console.log('Hello FirestoreProvider Provider');
  }

  getConfig() {
    return this.config;
  }

  initDb() {
    this.db = firebase.firestore();
    const settings = { timestampsInSnapshots: true };
    this.db.settings(settings);
  }

  /******************************************************************* */
  /* User Management */
  /******************************************************************* */

  createUser(newUser, id): Promise<any> {
    this.initDb();
    return this.db.collection('users')
      .doc(id)
      .set(newUser)
  }

  updateUser(newUser, id): Promise<any> {
    this.initDb();
    return this.db.collection('users')
      .doc(id)
      .update(newUser)
  }

  loadUser(uid): Promise<any> {
    this.initDb();
    return this.db.collection('users')
      .doc(uid)
      .get()
  }

  getCarer(id): Promise<any> {
    this.initDb();
    return this.db.collection('users')
      .doc(id)
      .get()
  }

  getCarerByEmail(email): Promise<any> {
    this.initDb();
    return this.db.collection('users')
      .where('email', '==', email).get()
  }
  /******************************************************************* */
  /* Babies Management */
  /******************************************************************* */

  createBaby(newBaby): Promise<any> {
    this.initDb();
    return this.db.collection('babies')
      .add(newBaby);
  }

  updateBaby(babyId, baby): Promise<any> {
    this.initDb();
    return this.db.collection('babies')
      .doc(babyId).set(baby);
  }

  getBabies(motherId): Promise<any> {
    this.initDb();
    return this.db.collection('babies')
      .where('motherId', '==', motherId)
      .get()
  }

  getTrustedBabies(userId): Promise<any> {
    this.initDb();
    return this.db.collection('babies')
      .where(userId, '==', true)
      .get()
  }

  /******************************************************************* */
  /* Cares Management */
  /******************************************************************* */


  newCare(careType, babyId, content): Promise<any> {
    this.initDb();
    return this.db.collection('babies')
      .doc(babyId).collection(careType)
      .add(content);
  }

  getCares(careType, babyId): Promise<any> {
    this.initDb();
    return this.db.collection('babies')
      .doc(babyId).collection(careType)
      .get()
  }

  getLastCare(careType, babyId): Promise<any> {
    this.initDb();
    return this.db.collection('babies')
      .doc(babyId).collection(careType)
      .get().orderBy('careDate', "desc").limit(1)
  }

  updateCare(careType, careId, babyId, content) {
    this.initDb();
    return this.db.collection('babies')
      .doc(babyId).collection(careType)
      .doc(careId).update(content);
  }

  deleteCare(careType, careId, babyId): Promise<any> {
    this.initDb();
    return this.db.collection('babies')
      .doc(babyId).collection(careType)
      .doc(careId).delete();
  }

  /******************************************************************* */
  /* Calendar Management */
  /******************************************************************* */

  saveCalendar(babyId, calendarContent: Array<any>): Promise<any> {
    this.initDb();
    let  calendarToSend=[];

    calendarContent.forEach(element => {
      calendarToSend.push(Object.assign({}, element));
    });

    calendarToSend.forEach(element => {
      element.startTime = parseInt(moment(element.startTime).format('x'));
      element.endTime = parseInt(moment(element.startTime).format('x'));
    });

    return this.db.collection('babies')
      .doc(babyId).update({calendar: calendarToSend});

  }

}
