import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { IndividualLeaderboardPage } from './individual-leaderboard.page';
import { IndividualLeaderboardPageRoutingModule } from './individual-leaderboard-routing.module';

@NgModule({
  imports: [
    SharedModule,
    IndividualLeaderboardPageRoutingModule
  ],
  declarations: [
    IndividualLeaderboardPage,
  ]
})
export class IndividualLeaderboardPageModule {}
