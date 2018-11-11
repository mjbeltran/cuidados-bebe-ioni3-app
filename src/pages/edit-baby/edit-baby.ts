import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';

import { HomePage } from '../home/home';

import * as moment from 'moment';



@IonicPage()
@Component({
  selector: 'page-edit-baby',
  templateUrl: 'edit-baby.html',
})
export class EditBabyPage {

  private newBaby: any = {}
  private birthdate: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private user: UserProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditBabyPage');
  }

  ionViewWillEnter() {
    this.newBaby = {
      name: this.user.currentBaby.name,
      motherId: this.user.currentBaby.motherId,
      createDate: this.user.currentBaby.createDate,
      birthDate: this.user.currentBaby.birthDate,
      allergy: this.user.currentBaby.allergy,
      note: this.user.currentBaby.note,
      avatar: this.user.currentBaby.avatar,
      trustedPeople: this.user.currentBaby.trustedPeople,
      calendar: this.user.currentBaby.calendar
    };
    this.birthdate = moment(this.newBaby.birthDate).locale('fr').format('YYYY-MM-DDTHH:mmZ');
    console.log(this.newBaby);
  }

  getAvatar(){
    return "assets/imgs/default.jpg"
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
      title: "Añadir una alergia",
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
      message: "Introduzuzca su email",
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
              this.showMsg("Email inválido");
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
        this.showMsg("Cuidador presente en la lista ya");
      } else if (people[0].id == this.user.uid) {
        this.showMsg("ya es cuidador del bebe");
      }
      else {
        let newPeople = {
          id: people[0].id,
          nickName: people[0].nickName,
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

  updateBaby() {
    if (this.newBaby.name.length < 4) {
      console.log('invalid form');
    } else {
      let birthDate = parseInt(moment(this.birthdate).format('x'));
      if (birthDate > Date.now()) {
        this.showMsg("Vuestro bebé no ha nacido aún")
      } else {
        let loading = this.loadingCtrl.create();
        loading.present();

        this.newBaby.birthDate = birthDate;
        this.user.updateBaby(this.user.currentBaby.id, this.newBaby).then(resp => {
          this.user.currentBaby.name = this.newBaby.name;
          this.user.currentBaby.motherId = this.newBaby.motherId;
          this.user.currentBaby.createDate = this.newBaby.createDate;
          this.user.currentBaby.birthDate = this.newBaby.birthDate;
          this.user.currentBaby.allergy = this.newBaby.allergy;
          this.user.currentBaby.note = this.newBaby.note;
          this.user.currentBaby.avatar = this.newBaby.avatar;
          this.user.currentBaby.trustedPeople = this.newBaby.trustedPeople;
          this.user.currentBaby.calendar = this.newBaby.calendar;
          loading.dismiss();
          this.navCtrl.pop();
        });
      }
    }
  }

  confirmDeleteBaby() {
    const prompt = this.alertCtrl.create({
      title: "Dsea eliminar el bebé?",
      message: "Cuidado, esta operación es irreversible !",
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
            this.deleteBaby();
          }
        }
      ]
    });
    prompt.present();
  }

  deleteBaby() {
    let loading = this.loadingCtrl.create();
    loading.present();

    this.newBaby.motherId = "none";
    this.newBaby.trustedPeople = [];
    this.user.updateBaby(this.user.currentBaby.id, this.newBaby).then(resp => {
      loading.dismiss();
      this.user.getBabies();
      this.navCtrl.setRoot(HomePage);
    });
  }

  cancel() {
    this.navCtrl.pop();
  }

}
