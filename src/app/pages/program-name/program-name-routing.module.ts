import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramNamePage } from './program-name.page';

const routes: Routes = [
  {
    path: '',
    component: ProgramNamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramNamePageRoutingModule {}
