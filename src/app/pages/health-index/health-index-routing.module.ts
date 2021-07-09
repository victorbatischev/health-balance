import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HealthIndexPage } from './health-index.page'

const routes: Routes = [
  {
    path: '',
    component: HealthIndexPage
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthIndexPageRoutingModule {}
