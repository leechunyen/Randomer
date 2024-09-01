import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OptionEditPage } from './option-edit.page';

const routes: Routes = [
  {
    path: '',
    component: OptionEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptionEditPageRoutingModule {}
