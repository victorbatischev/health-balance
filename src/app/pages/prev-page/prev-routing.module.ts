import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrevPage } from './prev.page';

const routes: Routes = [
  {
    path: '',
    component: PrevPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrevPageRoutingModule {}
