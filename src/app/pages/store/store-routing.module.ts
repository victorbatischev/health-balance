import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StorePage } from './store.page';
import { StoreItemComponent } from './store-item/store-item.component';
// import { StoreItemsComponent } from './store-items/store-items.component';

const routes: Routes = [
  {
    path: '',
    component: StorePage,

    // children: [
      // { path: '', redirectTo: '/store', pathMatch: 'full' },
      // { path: 'store-items', component: StoreItemsComponent },
      // { path: ':id', component: StoreItemComponent }
    // ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorePageRoutingModule {}
