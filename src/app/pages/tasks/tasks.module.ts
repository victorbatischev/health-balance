import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TasksPageRoutingModule } from './tasks-routing.module';
import { TasksPage } from './tasks.page';

@NgModule({
  imports: [
    SharedModule,
    TasksPageRoutingModule
  ],
  declarations: [TasksPage]
})
export class TasksPageModule {}
