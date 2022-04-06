import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatisticPageRoutingModule } from './statistic-routing.module';

import { StatisticPage } from './statistic.page';
import {ProgramNamePageModule} from "../program-name/program-name.module";
import {HeaderMainComponent} from "../../shared/components/header-main/header-main.component";
import {FlatTabsComponent} from "../../shared/components/flat-tabs/flat-tabs.component";
import {ProgramNamePage} from "../program-name/program-name.page";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        StatisticPageRoutingModule,
        ProgramNamePageModule,
        SharedModule
    ],
    declarations: [StatisticPage]
})
export class StatisticPageModule {}
