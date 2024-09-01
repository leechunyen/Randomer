import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-numbers',
  templateUrl: './numbers.page.html',
  styleUrls: ['./numbers.page.scss'],
})
export class NumbersPage implements OnInit {

  constructor(public alertController: AlertController) {}

  ngOnInit() {}

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

  isInt(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
  }

  getRandom(min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
  };

  random() {
    var min=$('#ipmin').val();
    var max=$('#ipmax').val();
    
    if(min==""||max==""){
      this.presentAlert('Minimum and Maximum can\'t be blank.');
    }else if(!this.isInt(min)||!this.isInt(max)){
      this.presentAlert('Please enter a valid integer.');
    }else{
      min=parseInt(min);
      max=parseInt(max);
      if(min>max){
        this.presentAlert('Minimum can\'t grader then Maximum.');
      }else{$('#outputNum').html(this.getRandom(min,max));}
    }
  }
}
