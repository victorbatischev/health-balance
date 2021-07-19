import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HealthIndexResultsPage } from './health-index-results.page'

const routes: Routes = [
  {
    path: '',
    component: HealthIndexResultsPage
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthIndexResultsPageRoutingModule {}
