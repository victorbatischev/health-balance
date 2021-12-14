import { NgModule } from '@angular/core'
import { SliderPage } from './slider.page'
import { Routes, RouterModule } from '@angular/router'

const routes: Routes = [
  {
    path: '',
    component: SliderPage
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SliderPageRoutingModule {}
