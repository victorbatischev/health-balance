import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { TeamNewsPage } from './team-news.page';
import { TeamNewsPageRoutingModule } from './team-news-routing.module';

@NgModule({
  imports: [
    SharedModule,
    TeamNewsPageRoutingModule
  ],
  declarations: [
    TeamNewsPage
]
})
export class TeamNewsPageModule {}
