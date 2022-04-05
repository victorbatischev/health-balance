import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProgramNamePage } from './program-name.page';
import { ProgramNamePageRoutingModule } from './program-name-routing.module';
import {FlatTabsComponent} from "../../shared/components/flat-tabs/flat-tabs.component";

@NgModule({
    imports: [
        SharedModule,
        ProgramNamePageRoutingModule
    ],
    exports: [
        FlatTabsComponent
    ],
    declarations: [
        ProgramNamePage,
        FlatTabsComponent
    ]
})
export class ProgramNamePageModule {}
