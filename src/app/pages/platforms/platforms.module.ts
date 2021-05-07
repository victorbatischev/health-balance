import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlatformsPageRoutingModule } from './platforms-routing.module';

import { PlatformsPage } from './platforms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PlatformsPageRoutingModule
  ],
  declarations: [PlatformsPage]
})
export class PlatformsPageModule {}
