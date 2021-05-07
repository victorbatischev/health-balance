import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SupportPageRoutingModule } from './support-routing.module';

import { SupportPage } from './support.page';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SupportPageRoutingModule
  ],
  declarations: [SupportPage]
})
export class SupportPageModule {}
