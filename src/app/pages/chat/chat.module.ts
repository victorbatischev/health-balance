import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import {ChatPageRoutingModule} from './chat-routing.module';
import {ChatPage} from './chat.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    SharedModule,
    ChatPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  declarations: [
    ChatPage,
  ]
})
export class ChatPageModule {}
