import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBabyPage } from './add-baby';

@NgModule({
  declarations: [
    AddBabyPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBabyPage),
  ],
})
export class AddBabyPageModule {}
