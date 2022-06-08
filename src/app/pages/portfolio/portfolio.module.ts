import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { PortfolioPage } from './portfolio.page';
import { PortfolioPageRoutingModule } from './portfolio-routing.module';
import {FlatTabsComponent} from "../../shared/components/flat-tabs/flat-tabs.component";

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
