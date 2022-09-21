import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpendCategoryChartComponent } from '../spend-category-chart/spend-category-chart.component';
import { DashboardComponent } from './dashboard.component';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    DashboardComponent,
    SpendCategoryChartComponent
  ],
  imports: [
    CommonModule,
    NgChartsModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
