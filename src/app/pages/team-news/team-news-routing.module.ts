import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamNewsPage } from './team-news.page';

const routes: Routes = [
  {
    path: '',
    component: TeamNewsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamNewsPageRoutingModule {}
