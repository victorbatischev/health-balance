import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NutritionPage } from './nutrition.page';
import { NutritionPageRoutingModule } from './nutrition-routing.module';
import {LeaderboardListComponent} from "../../shared/components/leaderboard-list/leaderboard-list.component";

@NgModule({
  imports: [
    SharedModule,
    NutritionPageRoutingModule
  ],
    declarations: [
        NutritionPage,
        LeaderboardListComponent
    ]
})
export class NutritionPageModule {}
