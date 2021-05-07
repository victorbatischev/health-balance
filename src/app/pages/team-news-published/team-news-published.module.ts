import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { TeamNewsPublishedPage } from './team-news-published.page';
import { TeamNewsPublishedPageRoutingModule } from './team-news-published-routing.module';

@NgModule({
  imports: [
    SharedModule,
    TeamNewsPublishedPageRoutingModule
  ],
  declarations: [
    TeamNewsPublishedPage
]
})
export class TeamNewsPublishedPageModule {}
