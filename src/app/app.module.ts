import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SQLite } from '@ionic-native/sqlite/ngx';
import { HttpClientModule } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [DeviceMotion, Shake, Vibration,SQLite, SQLitePorter, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}