import { NgModule } from '@angular/core'

import { HealthIndexPageRoutingModule } from './health-index-routing.module'
import { HealthIndexPage } from './health-index.page'
import { SharedModule } from 'src/app/shared/shared.module'

@NgModule({
  imports: [SharedModule, HealthIndexPageRoutingModule],
  declarations: [HealthIndexPage]
})
export class HealthIndexPageModule {}
