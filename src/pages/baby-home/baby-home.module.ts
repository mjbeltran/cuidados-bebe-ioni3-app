import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BabyHomePage } from './baby-home';

@NgModule({
  declarations: [
    BabyHomePage,
  ],
  imports: [
    IonicPageModule.forChild(BabyHomePage),
  ],
})
export class BabyHomePageModule {}
