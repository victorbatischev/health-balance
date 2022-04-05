import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatisticPageRoutingModule } from './statistic-routing.module';

import { StatisticPage } from './statistic.page';
import {ProgramNamePageModule} from "../program-name/program-name.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        StatisticPageRoutingModule,
        ProgramNamePageModule
    ],
  declarations: [StatisticPage]
})
export class StatisticPageModule {}
