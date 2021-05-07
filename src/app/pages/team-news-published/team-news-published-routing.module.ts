import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamNewsPublishedPage } from './team-news-published.page';

const routes: Routes = [
  {
    path: '',
    component: TeamNewsPublishedPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamNewsPublishedPageRoutingModule {}
