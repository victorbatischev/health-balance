import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndividualNewsRoutingModule } from './individual-news-routing.module';
import { IndividualNewsPage } from './individual-news.page';

@NgModule({
  imports: [
    SharedModule,
    IndividualNewsRoutingModule
  ],
  declarations: [
    IndividualNewsPage,
  ]
})
export class IndividualNewsPageModule {}
