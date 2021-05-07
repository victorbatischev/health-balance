import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebRfCreatedPage } from './web-rf-created.page';

const routes: Routes = [
  {
    path: '',
    component: WebRfCreatedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebRfCreatedPageRoutingModule {}
