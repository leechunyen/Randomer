import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import * as $ from 'jquery';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-option-edit',
  templateUrl: './option-edit.page.html',
  styleUrls: ['./option-edit.page.scss'],
})
export class OptionEditPage implements OnInit {

  id:any;data:any;

  constructor(private alertController: AlertController,
    private route: ActivatedRoute, private router: Router,
    private navCtrl:NavController,
    private db: DbService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.id= this.router.getCurrentNavigation().extras.state.id;
      }
    });
  }
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

  async ionViewWillEnter(){
    this.data=await this.db.getItem(this.id);
    $('#iptt').val(this.data.title);
    $('#ipdt').val(this.data.detail);
  }

  async delete() {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'Delete '+this.data.title+'?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Delete',
          handler: () => {
            this.db.deleteItem(this.id);
            this.navCtrl.pop();
          }
        }
      ]
    });
    await alert.present();
    return false;
  }

  cancel(){
    this.navCtrl.pop();
  }

  save(){
    const tt=$('#iptt').val();
    const dt=$('#ipdt').val();
    if(tt==""||dt==""){
      this.presentAlert("Title and Detail can't be blank.");
    }else{
      this.db.updateItem(this.id,{
        id: this.id,
        title: tt,
        detail: dt
    });
      this.navCtrl.pop();
    }
  }
}
