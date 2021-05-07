import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { PortfolioThreePageRoutingModule } from './portfolio-three-routing.module';
import { PortfolioThreePage } from './portfolio-three.page';

@NgModule({
  imports: [
    SharedModule,
    PortfolioThreePageRoutingModule
  ],
  declarations: [
    PortfolioThreePage,
  ]
})
export class PortfolioThreePageModule {}
