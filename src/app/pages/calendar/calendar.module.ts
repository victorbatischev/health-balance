import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarPage } from './calendar.page';
import { CalendarPageRoutingModule } from './calendar-routing.module';
import { CalendarModule } from "ion2-calendar";

@NgModule({
  imports: [
    SharedModule,
    CalendarPageRoutingModule,
    CalendarModule
  ],
  declarations: [
    CalendarPage
]
})
export class CalendarPageModule {}
