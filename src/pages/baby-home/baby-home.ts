import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';

import { CalendarPage } from '../calendar/calendar';


import * as moment from 'moment';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-baby-home',
  templateUrl: 'baby-home.html',
})
export class BabyHomePage {

  careList = ['milk', 'water', 'bath', 'nappy', 'sleep', 'comment', 'size', 'meal', 'temperature', 'weight'];
  loadedCare:number = 0;
  motherName:string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private user: UserProvider,
    private actionSheetCtrl: ActionSheetController
  ) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BabyHomePage');
  }

  ionViewWillEnter() {
    this.getAllCares(this.careList);
    this.user.getMumName().then(resp=>{
      console.log(resp.data());
      this.motherName = resp.data().nickName;
    })
  }

  /******************** Utilities *********************************************/
  getDateFromNow(date) {
    let displayDate = moment(date).locale('es').fromNow();
    return displayDate
  }

  getDuration(duration) {
    let minutes = moment.duration(duration).locale('es').minutes();
    let hours = moment.duration(duration).locale('es').hours();
    return ` ${hours}h${minutes}m`
  }

  getAvatar(){
    return "assets/imgs/default.jpg"
  }

  accordion(){
    $('.accordion').toggle(300);
    $('.turning').toggle();
  }

  /******************** Cares management *********************************************/

  getAllCares(careList){
    this.user.loadedCares = 0;
    careList.forEach(element => {
      this.user.getCares(element);
    });
  }


  newCare() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Acción sobre el bebé',
      buttons: [
        {
          text: "Biberón de leche",
          handler: () => {
            this.newMilk();
          }
        },
        {
          icon: 'flaticon-water',
          text: "Biberon de agua",
          handler: () => {
            this.newWater();
          }
        },
        {
          text: 'Comida sólida',
          handler: () => {
            this.newMeal();
          }
        },
        {
          text: 'Cambio',
          handler: () => {
            this.newNappy();
          }
        },
        {
          text: 'Baño',
          handler: () => {
            this.newBath();
          }
        },
        {
          text: 'Horas de sueño',
          handler: () => {
            this.newSleep();
          }
        },
        {
          text: 'Peso',
          handler: () => {
            this.newWeight();
          }
        },
        {
          text: 'Altura',
          handler: () => {
            this.newSize();
          }
        },
        {
          text: 'Temperatura',
          handler: () => {
            this.newTemperature();
          }
        },
        {
          text: 'Comentario',
          handler: () => {
            this.newComment();
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();

  }

  newMilk() {
    const prompt = this.alertCtrl.create({
      title: 'Biberon de leche',
      message: "Cantidad  en ml",
      inputs: [
        {
          name: 'qte',
          placeholder: 'Cantidad en ml',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if (data.qte != "") {
              data.qte = parseInt(data.qte);
              this.user.newCare('milk', data);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  newWater() {
    const prompt = this.alertCtrl.create({
      title: "Biberon de agua",
      message: "Cantidad en ml",
      inputs: [
        {
          name: 'qte',
          placeholder: 'Cantidad en ml',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if (data.qte != "") {
              data.qte = parseInt(data.qte);
              this.user.newCare('water', data);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  newBath() {
    const prompt = this.alertCtrl.create({
      title: "Nuevo baño",
      inputs: [],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            data = {}
            this.user.newCare('bath', data);
          }
        }
      ]
    });
    prompt.present();
  }

  newNappy() {
    let newNappy = {
      urine: false,
      stool: false,
      diarrhoea: false
    }
    const prompt = this.alertCtrl.create();
    prompt.setTitle('Presencia en el cambio:');
    prompt.addInput({
      type: 'checkbox',
      label: 'horina',
      value: 'horina',
      checked: false
    });
    prompt.addInput({
      type: 'checkbox',
      label: 'caca',
      value: 'caca',
      checked: false
    });
    prompt.addInput({
      type: 'checkbox',
      label: 'diarreas',
      value: 'diarreas',
      checked: false
    });
    prompt.addButton('Annuler');
    prompt.addButton({
      text: 'Ok',
      handler: data => {
        if (data.indexOf('horina') > -1) {
          newNappy.urine = true
        };
        if (data.indexOf('caca') > -1) {
          newNappy.stool = true
        };
        if (data.indexOf('diarreas') > -1) {
          newNappy.diarrhoea = true
        };
        this.user.newCare('panal', newNappy);
      }
    });
    prompt.present();
  }

  newSleep() {
    const prompt = this.alertCtrl.create({
      title: 'Sueño',
      message: "Duración",
      inputs: [
        {
          name: 'hour',
          placeholder: 'horas',
          type: 'number'
        },
        {
          name: 'minute',
          placeholder: 'minutos',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            data.hour = parseInt(data.hour);
            data.minute = parseInt(data.minute);
            let duration = moment.duration(data.hour, 'hours');
            duration.add(data.minute, 'minutes');
            let newSleep = { duration: moment.duration(duration).asMilliseconds() };
            console.log(newSleep);
            this.user.newCare('sleep', newSleep);
          }
        }
      ]
    });
    prompt.present();
  }

  newComment() {
    const prompt = this.alertCtrl.create({
      title: "Comentarios",
      message: "Anotaciones diversas",
      inputs: [
        {
          name: 'content',
          placeholder: 'Comentarios',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if (data.content != "") {
              this.user.newCare('comment', data);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  newMeal() {
    const prompt = this.alertCtrl.create({
      title: "Comida sólida",
      message: "Contenido de la comida",
      inputs: [
        {
          name: 'content',
          placeholder: 'Contenido',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if (data.content != "") {
              this.user.newCare('meal', data);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  newWeight() {
    const prompt = this.alertCtrl.create({
      title: 'Peso',
      message: "Peso en kg",
      inputs: [
        {
          name: 'qte',
          placeholder: 'kg',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if (data.qte != "") {
              console.log(data.qte);
              data.qte = parseFloat(data.qte);
              console.log(data.qte);
              this.user.newCare('weight', data);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  newSize() {
    const prompt = this.alertCtrl.create({
      title: 'Altura',
      message: "Altura en cm",
      inputs: [
        {
          name: 'qte',
          placeholder: 'cm',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if (data.qte != "") {
              data.qte = parseInt(data.qte);
              this.user.newCare('size', data);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  newTemperature() {
    const prompt = this.alertCtrl.create({
      title: 'Temperatura',
      message: "en °C",
      inputs: [
        {
          name: 'qte',
          placeholder: '°C',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if (data.qte != "") {
              data.qte = parseFloat(data.qte);
              this.user.newCare('temperature', data);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  /******************** Navigation *********************************************/

  goDisplayCares(careType) {
    this.navCtrl.push('DisplayCaresPage', { careType: careType });
  }

  goEditBaby() {
    this.navCtrl.push('EditBabyPage');
  }

  goCalendar(){
    console.log(this.user.currentBaby);
    this.navCtrl.push(CalendarPage);
  }
}
