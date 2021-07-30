import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HealthIndexReportPage } from './health-index-report.page'

const routes: Routes = [
  {
    path: '',
    component: HealthIndexReportPage
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HealthIndexReportPageRoutingModule {}
