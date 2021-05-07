import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AgreeDataReadPage } from './agree-data-read.page';
import { AgreeDataReadPageRoutingModule } from './agree-data-read-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgreeDataReadPageRoutingModule
  ],
  declarations: [
    AgreeDataReadPage,
  ]
})
export class AgreeReadDataPageModule {}
