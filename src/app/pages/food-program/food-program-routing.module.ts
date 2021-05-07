import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FoodProgramPage } from './food-program.page';
import { LessonOneComponent } from './lesson-one/lesson-one.component';
import { LessonTwoComponent } from './lesson-two/lesson-two.component';
import { LessonThreeComponent } from './lesson-three/lesson-three.component';
import { LessonFourComponent } from './lesson-four/lesson-four.component';
import { LessonFiveComponent } from './lesson-five/lesson-five.component';

const routes: Routes = [
  {
    path: '',
    component: FoodProgramPage,

    children: [
      { path: '', redirectTo: '/food-program/lesson-1', pathMatch: 'full'},
      { path: 'lesson-1', component: LessonOneComponent },
      { path: 'lesson-2', component: LessonTwoComponent },
      { path: 'lesson-3', component: LessonThreeComponent },
      { path: 'lesson-4', component: LessonFourComponent },
      { path: 'lesson-5', component: LessonFiveComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodProgramPageRoutingModule {}
