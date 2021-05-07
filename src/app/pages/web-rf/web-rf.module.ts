import { NgModule } from '@angular/core';

import { WebRfPage } from './web-rf.page';
import { WebRfPageRoutingModule } from './web-rf-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    WebRfPageRoutingModule
  ],
  declarations: [
    WebRfPage,
  ]
})
export class SliderPageModule {}
