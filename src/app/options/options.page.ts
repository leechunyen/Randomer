import { Component, OnInit } from '@angular/core';
import { AlertController, Platform, ToastController} from '@ionic/angular';
import * as $ from 'jquery';

import { DbService } from './../services/db.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { NavigationExtras, Router } from "@angular/router";
import { Vibration } from '@ionic-native/vibration/ngx';
import { Shake } from '@ionic-native/shake/ngx';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  mainForm: FormGroup;Data: any[] = [];os:string;shakeWatch:any;lastAcc={x:null,y:null,z:null};

  constructor(
    private alertController: AlertController,
    private db: DbService,
    private formBuilder: FormBuilder,
    private toast: ToastController,
    private router: Router,
    private plt: Platform,
    private vibration: Vibration,
    private shake: Shake,
    private deviceMotion: DeviceMotion) {}

  ngOnInit() {
    if(this.plt.is("ios")){this.os='ios'}
    else if(this.plt.is("android")){this.os='android'}
    else{this.os='other'}

    this.db.dbState().subscribe((res) => {
      if(res){
        this.db.fetchItems().subscribe(item => {
          this.Data = item
        })
      }
    });

    this.mainForm=this.formBuilder.group({
      title: [''],
      detail: ['']
    })
  }

  ionViewDidEnter(){
    if(this.os=="ios"){
      this.shakeWatch=this.shake.startWatch(40).subscribe(() => {
        this.vibration.vibrate(1000);
        this.random();
      });
    }else{
      let timer=1;let countdown=0;
      setInterval (function(){
        if(countdown>0){countdown--;}
      },1000);
      const option: DeviceMotionAccelerometerOptions={
        frequency: 300
      };
      this.shakeWatch=this.deviceMotion.watchAcceleration(option).subscribe((acceleration: DeviceMotionAccelerationData) => {
        const changeAcc={x:null,y:null,z:null};
        if(this.lastAcc.x&&this.lastAcc.y&&this.lastAcc.z){
          changeAcc.x=Math.abs(acceleration.x-this.lastAcc.x);
          changeAcc.y=Math.abs(acceleration.y-this.lastAcc.y);
          changeAcc.z=Math.abs(acceleration.z-this.lastAcc.z);
        }
        if(changeAcc.x+changeAcc.y+changeAcc.z>30&&countdown==0){
          countdown=timer;
          this.vibration.vibrate(1000);
          this.random();
        }else{
          this.lastAcc={x:acceleration.x,y:acceleration.y,z:acceleration.z}
        }
      });
    }
  }
  
  ionViewWillLeave(){
    this.shakeWatch.unsubscribe();
    this.lastAcc={x:null,y:null,z:null}
  }

  getRandom(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
  }

  async addNewOptionAlertPrompt() {
    const alert = await this.alertController.create({
      mode: "ios",
      header: 'Add',
      subHeader: "New option",
      inputs: [
        {
          id: 'ipAddTitle',
          type: 'text',
          placeholder: 'Title',
        },
        {
          id: 'ipAddDetail',
          type: 'text',
          placeholder: 'Detail',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        }, {
          text: 'Add',
          handler: () => {
            this.addNewOption();
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlert(mg) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mg,
      mode: 'ios',
      buttons: ['OK']
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async deleteOption(id) {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Delete '+(await this.db.getItem(id)).title+'?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Delete',
          handler: () => {
            this.db.deleteItem(id);
          }
        }
      ]
    });
    await alert.present();
    return false;
  }

  addNewOption(){
    const ipt=$('#ipAddTitle').val();
    const ipd=$('#ipAddDetail').val();
    if(ipt==""||ipd==""){
      this.presentAlert("Title and Detail can't be blank.");
    }else{
      this.db.addItem(ipt,ipd);
    }
  }

  random(){
    let itemsLength=this.Data.length;
    if(itemsLength<=1){
      this.presentAlert('Please add more option then try again.');
    }else{
      let rn=this.getRandom(0,itemsLength-1);
      $('#rtt').html(this.Data[rn]['title']);
      $('#rdt').html(this.Data[rn]['detail']);
    }
  }

  editOption(id) {
    let navigationExtras: NavigationExtras = { state: { id: id } };
    this.router.navigate(['/option-edit/'], navigationExtras);
  }
}