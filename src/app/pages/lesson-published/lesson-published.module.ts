import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import {LessonPublishedPageRoutingModule} from './lesson-published-routing.module';
import {LessonPublishedPage} from './lesson-published.page';

@NgModule({
  imports: [
    SharedModule,
    LessonPublishedPageRoutingModule,
  ],
  declarations: [
    LessonPublishedPage,
  ]
})
export class LessonPublishedPageModule {}
