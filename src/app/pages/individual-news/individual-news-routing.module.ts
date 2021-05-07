import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndividualNewsPage } from './individual-news.page';

const routes: Routes = [
  {
    path: '',
    component: IndividualNewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndividualNewsRoutingModule {}
