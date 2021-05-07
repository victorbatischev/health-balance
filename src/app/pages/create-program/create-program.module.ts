import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CreateProgramPage } from './create-program.page';
import { CreateProgramPageRoutingModule } from './create-program-routing.module';
import { CalendarModule } from "ion2-calendar";

@NgModule({
  imports: [
    SharedModule,
    CreateProgramPageRoutingModule,
    CalendarModule
  ],
  declarations: [
    CreateProgramPage
]
})
export class CreateProgramPageModule {}
