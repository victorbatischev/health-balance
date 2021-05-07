import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { FoodProgramPageRoutingModule } from './food-program-routing.module';
import { FoodProgramPage } from './food-program.page';

import { LessonOneComponent } from './lesson-one/lesson-one.component';
import { LessonTwoComponent } from './lesson-two/lesson-two.component';
import { LessonThreeComponent } from './lesson-three/lesson-three.component';
import { LessonFourComponent } from './lesson-four/lesson-four.component';
import { LessonFiveComponent } from './lesson-five/lesson-five.component';

@NgModule({
  imports: [
    SharedModule,
    FoodProgramPageRoutingModule
  ],
  declarations: [
    FoodProgramPage,
    LessonOneComponent,
    LessonTwoComponent,
    LessonThreeComponent,
    LessonFourComponent,
    LessonFiveComponent
  ]
})
export class FoodProgramPageModule {}
