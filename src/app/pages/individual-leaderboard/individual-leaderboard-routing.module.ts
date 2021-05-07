import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndividualLeaderboardPage } from './individual-leaderboard.page';

const routes: Routes = [
  {
    path: '',
    component: IndividualLeaderboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndividualLeaderboardPageRoutingModule {}
