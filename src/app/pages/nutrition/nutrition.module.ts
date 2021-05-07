import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NutritionPage } from './nutrition.page';
import { NutritionPageRoutingModule } from './nutrition-routing.module';

@NgModule({
  imports: [
    SharedModule,
    NutritionPageRoutingModule
  ],
  declarations: [
    NutritionPage
  ]
})
export class NutritionPageModule {}
