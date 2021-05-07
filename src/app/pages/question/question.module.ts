import { NgModule } from '@angular/core';

import { QuestionPageRoutingModule } from './question-routing.module';
import { QuestionPage } from './question.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    QuestionPageRoutingModule
  ],
  declarations: [
    QuestionPage
  ]
})
export class QuestionPageModule {}
