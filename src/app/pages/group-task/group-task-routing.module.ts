import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupTaskPage } from './group-task.page';

const routes: Routes = [
  {
    path: '',
    component: GroupTaskPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupTaskPageRoutingModule {}
