import { NgModule } from '@angular/core';
import { IndividualTaskPageRoutingModule } from './individual-task-routing.module';
import { IndividualTaskPage } from './individual-task.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    IndividualTaskPageRoutingModule
  ],
  declarations: [
    IndividualTaskPage,
  ]
})
export class IndividualTaskPageModule {}
