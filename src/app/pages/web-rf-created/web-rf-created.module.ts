import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { WebRfCreatedPage } from './web-rf-created.page';
import { WebRfCreatedPageRoutingModule } from './web-rf-created-routing.module';

@NgModule({
  imports: [
    SharedModule,
    WebRfCreatedPageRoutingModule
  ],
  declarations: [
    WebRfCreatedPage,
  ]
})
export class WebRfCreatedPageModule {}
