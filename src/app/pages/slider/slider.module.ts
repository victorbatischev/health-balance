import { NgModule } from '@angular/core'

import { SliderPageRoutingModule } from './slider-routing.module'
import { SliderPage } from './slider.page'

import { SharedModule } from 'src/app/shared/shared.module'

@NgModule({
  imports: [SharedModule, SliderPageRoutingModule],
  declarations: [SliderPage]
})
export class SliderPageModule {}
