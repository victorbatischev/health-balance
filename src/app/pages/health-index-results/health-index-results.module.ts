import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { SharedModule } from 'src/app/shared/shared.module'
import { IonicModule } from '@ionic/angular'

import { HealthIndexResultsPageRoutingModule } from './health-index-results-routing.module'

import { HealthIndexResultsPage } from './health-index-results.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    HealthIndexResultsPageRoutingModule
  ],
  declarations: [HealthIndexResultsPage]
})
export class HealthIndexResultsPageModule {}
