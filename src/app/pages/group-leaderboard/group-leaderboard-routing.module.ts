import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupeLeaderboardPage } from './group-leaderboard.page';

const routes: Routes = [
  {
    path: '',
    component: GroupeLeaderboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupLeaderboardPageRoutingModule {}
