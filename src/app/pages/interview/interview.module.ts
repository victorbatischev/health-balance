import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { IonicModule } from '@ionic/angular';

import { InterviewPageRoutingModule } from './interview-routing.module';

import { InterviewPage } from './interview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    InterviewPageRoutingModule
  ],
  declarations: [InterviewPage]
})
export class InterviewPageModule {}
