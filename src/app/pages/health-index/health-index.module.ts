import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { SharedModule } from 'src/app/shared/shared.module'
import { IonicModule } from '@ionic/angular'

import { HealthIndexPageRoutingModule } from './health-index-routing.module'

import { HealthIndexPage } from './health-index.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    HealthIndexPageRoutingModule
  ],
  declarations: [HealthIndexPage]
})
export class HealthIndexPageModule {}
