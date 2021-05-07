import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { PortfolioPage } from './portfolio.page';
import { PortfolioPageRoutingModule } from './portfolio-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PortfolioPageRoutingModule
  ],
  declarations: [
    PortfolioPage,
  ]
})
export class PortfolioPageModule {}
