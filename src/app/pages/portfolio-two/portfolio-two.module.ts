import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { PortfolioTwoPageRoutingModule } from './portfolio-two-routing.module';
import { PortfolioTwoPage } from './portfolio-two.page';

@NgModule({
  imports: [
    SharedModule,
    PortfolioTwoPageRoutingModule
  ],
  declarations: [
    PortfolioTwoPage,
  ]
})
export class PortfolioTwoPageModule {}
