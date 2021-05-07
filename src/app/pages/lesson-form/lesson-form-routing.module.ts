import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LessonFormPage} from './lesson-form.page';


const routes: Routes = [
  {
    path: '',
    component: LessonFormPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonFormPageRoutingModule {}
