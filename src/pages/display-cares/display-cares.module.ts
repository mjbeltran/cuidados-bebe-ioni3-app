import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisplayCaresPage } from './display-cares';

@NgModule({
  declarations: [
    DisplayCaresPage,
  ],
  imports: [
    IonicPageModule.forChild(DisplayCaresPage),
  ],
})
export class DisplayCaresPageModule {}
