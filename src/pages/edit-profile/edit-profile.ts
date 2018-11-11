import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  private updatedUser = {
    nickName : null,
    firstName : null,
    lastName : null,
    phone : null,
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private user: UserProvider,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  ionViewWillLoad(){
    this.updatedUser.nickName = this.user.nickName;
    this.updatedUser.firstName = this.user.firstName;
    this.updatedUser.lastName = this.user.lastName;
    this.updatedUser.phone = this.user.phone;
  }

  updateProfil(){
    this.user.nickName = this.updatedUser.nickName;
    this.user.firstName = this.updatedUser.firstName;
    this.user.lastName = this.updatedUser.lastName;
    this.user.phone = this.updatedUser.phone;

    let that=this;
    let loadin = this.loadingCtrl.create();
    loadin.present();
    this.user.updateUser().then(
      function(){
        loadin.dismiss();
        that.navCtrl.setRoot(HomePage);
      }
    )
  }

  goBack(){
    this.navCtrl.pop();
  }

}
