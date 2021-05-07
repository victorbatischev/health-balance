import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndividualTaskPage } from './individual-task.page';

const routes: Routes = [
  {
    path: '',
    component: IndividualTaskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndividualTaskPageRoutingModule {}
