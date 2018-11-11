import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';


import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {
  eventsList = [];
  viewTitle: string;
  selectedDay = new Date();

  calendar = {
    mode: 'month',
    noEventsLabel: "Pas d'évènement",
    allDayLabel: "Toute la journée",
    currentDate: new Date()
  };

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private user: UserProvider,
    private loadingCtrl: LoadingController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
  }

  ionViewWillEnter(){
    //this.eventsList=this.user.currentBaby.calendar;
  }

  addEvent() {
    let modal = this.modalCtrl.create('EventModalPage', { selectedDay: this.selectedDay });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);

        let events = this.user.currentBaby.calendar;
        events.push(eventData);
        this.user.currentBaby.calendar = [];

        let loadin = this.loadingCtrl.create();
        loadin.present();

        setTimeout(() => {
          this.user.currentBaby.calendar = events;
          this.user.saveCalendar().then(resp => {
            loadin.dismiss()
          });
        });
        
      }
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    console.log(event);
    let start = moment(event.startTime).locale('fr').format('DD MMM à HH:mm');
    let end = moment(event.endTime).locale('fr').format('DD MMM à HH:mm');

    const prompt = this.alertCtrl.create({
      title: '' + event.title,
      message: 'Du: ' + start + '<br>au: ' + end,
      buttons: [
        {
          text: 'Supprimer',
          handler: data => {
            this.deleteEvent(event)
          }
        },
        {
          text: 'Ok',
          handler: data => {
            console.log('ok');
          }
        }
      ]
    });
    prompt.present();
  }

  deleteEvent(event) {
    let index = this.user.currentBaby.calendar.indexOf(event);
    let events = this.user.currentBaby.calendar;
    this.user.currentBaby.calendar.splice(index, 1);
    this.user.currentBaby.calendar = [];

    let loadin = this.loadingCtrl.create();
    loadin.present();

    setTimeout(() => {
      this.user.currentBaby.calendar = events;
      this.user.saveCalendar().then(resp => {
        loadin.dismiss()
      });
    });
    console.log(index);
    
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }


}
