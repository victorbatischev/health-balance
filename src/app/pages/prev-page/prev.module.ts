import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { PrevPage } from './prev.page';
import { PrevPageRoutingModule } from './prev-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PrevPageRoutingModule
  ],
  declarations: [
    PrevPage,
  ]
})
export class PrevPageModule {}
