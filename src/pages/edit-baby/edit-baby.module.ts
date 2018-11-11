import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditBabyPage } from './edit-baby';

@NgModule({
  declarations: [
    EditBabyPage,
  ],
  imports: [
    IonicPageModule.forChild(EditBabyPage),
  ],
})
export class EditBabyPageModule {}
