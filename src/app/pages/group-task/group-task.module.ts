import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GroupTaskPage } from './group-task.page';
import { GroupTaskPageRoutingModule } from './group-task-routing.module';

@NgModule({
  imports: [
    SharedModule,
    GroupTaskPageRoutingModule
  ],
  declarations: [
    GroupTaskPage,
  ]
})
export class GroupTaskPageModule {}
