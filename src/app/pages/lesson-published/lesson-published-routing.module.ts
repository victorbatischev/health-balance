import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LessonPublishedPage} from './lesson-published.page';


const routes: Routes = [
  {
    path: '',
    component: LessonPublishedPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonPublishedPageRoutingModule {}
