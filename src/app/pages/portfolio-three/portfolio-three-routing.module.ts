import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortfolioThreePage } from './portfolio-three.page';

const routes: Routes = [
  {
    path: '',
    component: PortfolioThreePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortfolioThreePageRoutingModule {}
