import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Modules
import { NgCalendarModule  } from 'ionic2-calendar';

// Components
import { MyApp } from './app.component';

// Pages
import { HomePage } from '../pages/home/home';
import { BabyHomePage } from '../pages/baby-home/baby-home';
import { CalendarPage } from '../pages/calendar/calendar';


// Providers
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { FirestoreProvider } from '../providers/firestore/firestore';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BabyHomePage,
    CalendarPage
  ],
  imports: [
    BrowserModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: 'Volver'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BabyHomePage,
    CalendarPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    AuthProvider,
    UserProvider,
    FirestoreProvider
  ]
})
export class AppModule { }
