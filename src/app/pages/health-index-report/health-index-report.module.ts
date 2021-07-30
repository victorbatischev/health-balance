import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { SharedModule } from 'src/app/shared/shared.module'
import { IonicModule } from '@ionic/angular'

import { HealthIndexReportPageRoutingModule } from './health-index-report-routing.module'

import { HealthIndexReportPage } from './health-index-report.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    HealthIndexReportPageRoutingModule
  ],
  declarations: [HealthIndexReportPage]
})
export class HealthIndexReportPageModule {}
