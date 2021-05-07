import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import {LessonFormPageRoutingModule} from './lesson-form-routing.module';
import {LessonFormPage} from './lesson-form.page';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    SharedModule,
    LessonFormPageRoutingModule,
    CalendarModule,
  ],
  declarations: [
    LessonFormPage,
  ]
})
export class LessonFormPageModule {}
