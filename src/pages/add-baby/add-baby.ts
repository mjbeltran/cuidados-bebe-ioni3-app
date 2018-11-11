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
      title: "Ajouter une allergie",
      inputs: [
        {
          name: 'allergy',
          placeholder: 'texte',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
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
      title: "Ajouter une personne de confiance",
      message: "Entrez son email",
      inputs: [
        {
          name: 'email',
          placeholder: 'texte',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
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
              this.showMsg("Adresse mail invalide")
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
        this.showMsg("Cette personne ne possede pas l'application");
        return
      }
      if (this.newBaby.trustedPeople.includes(people[0].id)) {
        this.showMsg("Cette personne est déjà dans la liste");
      } else if (people[0].id == this.user.uid) {
        this.showMsg("vous êtes déjà responsable de ce bébé");
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

  addBaby() {
    if (this.newBaby.name.length < 4) {
      console.log('invalid form');
    } else {
      let birthDate = parseInt(moment(this.birthdate).format('x'));
      let dateNow = parseInt(moment(Date.now()).format('x'));
      if (birthDate > dateNow) {
        this.showMsg("Votre bébé n'est pas encore né !")
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
