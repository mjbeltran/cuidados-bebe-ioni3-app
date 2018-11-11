import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

// Providers
import { UserProvider } from '../../providers/user/user';

// Pages
import { BabyHomePage } from '../baby-home/baby-home';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public authProvider: AuthProvider,
    public navCtrl: NavController,
    public user:UserProvider
  ) {

  }

  logout() {
    this.authProvider.logoutUser();
    this.user.resetUser();
    this.navCtrl.setRoot('LoginPage');
  }

  goEditProfil(){
    this.navCtrl.push('EditProfilePage');
  }

  goAddBaby(){
    this.navCtrl.push('AddBabyPage');
  }

  goBabyHome(i){
    this.user.currentBaby = this.user.babies[i];
    this.navCtrl.push(BabyHomePage);
  }

  goCgu(){
    this.navCtrl.push('CguPage');
  }

}
