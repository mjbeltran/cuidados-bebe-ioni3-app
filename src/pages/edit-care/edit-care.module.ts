import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditCarePage } from './edit-care';

@NgModule({
  declarations: [
    EditCarePage,
  ],
  imports: [
    IonicPageModule.forChild(EditCarePage),
  ],
})
export class EditCarePageModule {}
