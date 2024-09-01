import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptionEditPageRoutingModule } from './option-edit-routing.module';

import { OptionEditPage } from './option-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptionEditPageRoutingModule
  ],
  declarations: [OptionEditPage]
})
export class OptionEditPageModule {}
