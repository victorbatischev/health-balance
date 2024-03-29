import {NgModule} from '@angular/core'

import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'
import {IonicModule} from '@ionic/angular'

import {ListComponent} from './components/list/list.component'
import {HeaderComponent} from './components/header/header.component'
import {AdviceComponent} from './components/advice/advice.component'
import {RouterModule} from '@angular/router'
import {SearchComponent} from './components/search/search.component'
import {StepCounterComponent} from './components/step-counter/step-counter.component'
import {TabsComponent} from './components/tabs/tabs.component'
import {PopupOneComponent} from './components/popup-one/popup-one.component'
import {PopupTwoComponent} from './components/popup-two/popup-two.component'
import {FlatTabsComponent} from './components/flat-tabs/flat-tabs.component'
import {HeaderMainComponent} from "./components/header-main/header-main.component";
import {LeaderboardListComponent} from "./components/leaderboard-list/leaderboard-list.component";
import {ListTasksComponent} from "./components/list-tasks/list-tasks.component";
import {PollListComponent} from "./components/poll-list/poll-list.component";
import {PopupThreeComponent} from "./components/popup-three/popup-three.component";

@NgModule({
    declarations: [
        ListComponent,
        HeaderComponent,
        AdviceComponent,
        SearchComponent,
        StepCounterComponent,
        TabsComponent,
        PopupOneComponent,
        PopupTwoComponent,
        PopupThreeComponent,
        FlatTabsComponent,
        HeaderMainComponent,
        LeaderboardListComponent,
        ListTasksComponent,
        PollListComponent
    ],
    imports: [CommonModule, FormsModule, IonicModule, RouterModule],
    exports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule,
        ListComponent,
        HeaderComponent,
        AdviceComponent,
        SearchComponent,
        StepCounterComponent,
        TabsComponent,
        PopupOneComponent,
        PopupTwoComponent,
        PopupThreeComponent,
        FlatTabsComponent,
        HeaderMainComponent,
        LeaderboardListComponent,
        ListTasksComponent,
        PollListComponent

    ]
})
export class SharedModule {
}
