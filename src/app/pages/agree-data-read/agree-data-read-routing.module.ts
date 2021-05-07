import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgreeDataReadPage } from './agree-data-read.page';

const routes: Routes = [
  {
    path: '',
    component: AgreeDataReadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgreeDataReadPageRoutingModule {}
