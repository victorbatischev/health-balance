import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProgramNamePage } from './program-name.page';
import { ProgramNamePageRoutingModule } from './program-name-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ProgramNamePageRoutingModule
],
declarations: [
    ProgramNamePage
  ]
})
export class ProgramNamePageModule {}
