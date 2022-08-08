import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/shared/shared.module'
import { GroupLeaderboardPageRoutingModule } from './group-leaderboard-routing.module'
import { GroupeLeaderboardPage } from './group-leaderboard.page'

@NgModule({
  imports: [SharedModule, GroupLeaderboardPageRoutingModule],
  declarations: [GroupeLeaderboardPage]
})
export class GroupLeaderboardPageModule {}
