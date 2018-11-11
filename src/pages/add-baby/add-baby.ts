import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { HomePage } from '../home/home';

import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-add-baby',
  templateUrl: 'add-baby.html',
})
export class AddBabyPage {
  private birthdate: any;

  private newBaby: any = {
    name: "",
    motherId: "",
    createDate: 0,
    birthDate: parseInt(moment().locale('fr').format('x')),
    allergy: [],
    note: "",
    avatar: 'defaut',
    trustedPeople: [],
    calendar: [],
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private user: UserProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddBabyPage');
  }
  ionViewWillEnter() {
    this.newBaby = {
      name: "",
      motherId: "",
      createDate: 0,
      birthDate: parseInt(moment().locale('fr').format('x')),
      allergy: [],
      note: "",
      avatar: 'defaut',
      trustedPeople: [],
      calendar: []
    };
    this.birthdate = moment(this.newBaby.birthDate).locale('fr').format('YYYY-MM-DDTHH:mmZ');
  }

  isNameValid() {
    if (this.newBaby.name.length < 3) {
      return false
    } else {
      return true
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  showMsg(msg: string) {
    const prompt = this.alertCtrl.create({
      message: msg,
      buttons: [
        {
          text: 'ok',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  addAllergy() {
    const prompt = this.alertCtrl.create({
      title: "Añadir alergia",
      inputs: [
        {
          name: 'allergy',
          placeholder: 'texto',
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
            if (data.allergy != "") {
              this.newBaby.allergy.push(data.allergy);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  removeAllergy(i) {
    this.newBaby.allergy.splice(i, 1);
  }

  addNewPeople() {
    const prompt = this.alertCtrl.create({
      title: "Añadir un cuidador",
      message: "escribir su email",
      inputs: [
        {
          name: 'email',
          placeholder: 'texto',
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
            if (this.validateEmail(data.email)) {
              this.addTrustedPeople(data.email);
            } else {
              this.showMsg("Email incorrecto")
            }
          }
        }
      ]
    });
    prompt.present();
  }

  addTrustedPeople(email: string) {
    let loadin = this.loadingCtrl.create();
    loadin.present();
    this.user.getUserByEmail(email).subscribe(data => {
      loadin.dismiss();
      let people: Array<any> = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          people.push(data[key]);
        }
      }
      if (people.length < 1) {
        this.showMsg("Este cuidador no está registrado en la aplicación");
        return
      }
      if (this.newBaby.trustedPeople.includes(people[0].id)) {
        this.showMsg("Este cuidador está ya en la lista de cuidadores");
      } else if (people[0].id == this.user.uid) {
        this.showMsg("Usted ya es cuidador de este bebé");
      }
      else {
        let newPeople = {
          id: people[0].id,
          nickName: people[0].nickName,
          telephone : people[0].phone,
          email: people[0].email
        }
        this.newBaby.trustedPeople.push(newPeople);
        console.log(this.newBaby.trustedPeople);
      }
    });
  }

  removeTrustedPeople(i) {
    this.newBaby.trustedPeople.splice(i, 1);
  }

  addBaby() {
    if (this.newBaby.name.length < 4) {
      console.log('invalid form');
    } else {
      let birthDate = parseInt(moment(this.birthdate).format('x'));
      let dateNow = parseInt(moment(Date.now()).format('x'));
      if (birthDate > dateNow) {
        this.showMsg("Su bebé no ha nacido aún!")
      } else {
        let loading = this.loadingCtrl.create();
        loading.present();

        this.newBaby.birthDate = birthDate;
        this.user.createBaby(this.newBaby).then(resp => {
          loading.dismiss();
          this.navCtrl.setRoot(HomePage);
        });
      }
    }
  }

  cancel() {
    this.navCtrl.pop();
  }

}
