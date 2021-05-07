import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebRfPage } from './web-rf.page';

const routes: Routes = [
  {
    path: '',
    component: WebRfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebRfPageRoutingModule {}
