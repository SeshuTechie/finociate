import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpendCategoryChartComponent } from '../spend-category-chart/spend-category-chart.component';
import { DashboardComponent } from './dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { MonthlyViewChartComponent } from '../monthly-view-chart/monthly-view-chart.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    DashboardComponent,
    SpendCategoryChartComponent,
    MonthlyViewChartComponent
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    SharedModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
