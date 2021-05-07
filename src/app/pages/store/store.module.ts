import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { StorePageRoutingModule } from './store-routing.module';
import { StorePage } from './store.page';
import { StoreItemComponent } from './store-item/store-item.component';
// import { StoreItemsComponent } from './store-items/store-items.component';

@NgModule({
  imports: [
    SharedModule,
    StorePageRoutingModule
  ],
  declarations: [
    StorePage,
    StoreItemComponent,
    // StoreItemsComponent,
  ]
})
export class StorePageModule {}
