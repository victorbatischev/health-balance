import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortfolioTwoPage } from './portfolio-two.page';

const routes: Routes = [
  {
    path: '',
    component: PortfolioTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioTwoPageRoutingModule {}
