import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { TransactionsComponent } from '../pages/transactions/transactions.component';
import { UserComponent } from '../pages/user/user.component';
import { SidebarModule } from '../sidebar/sidebar.module';
import { NavbarModule } from '../shared/navbar/navbar.module';
import { FooterModule } from '../shared/footer/footer.module';
import { NewTransactionComponent } from '../pages/new-transaction/new-transaction.component';
import { DashboardModule } from '../pages/dashboard/dashboard.module';
import { RefDataComponent } from '../pages/ref-data/ref-data.component';
import { NewRefDataComponent } from '../pages/new-ref-data/new-ref-data.component';
import { BudgetComponent } from '../pages/budget/budget.component';
import { BudgetItemComponent } from '../pages/budget-item/budget-item.component';
import { ReportsComponent } from '../pages/reports/reports.component';
import { ReportDataComponent } from '../pages/report-data/report-data.component';
import { NgChartsModule } from 'ng2-charts';
import { TextPatternsComponent } from '../pages/text-patterns/text-patterns.component';
import { NewTextPatternComponent } from '../pages/new-text-pattern/new-text-pattern.component';
import { NewReportComponent } from '../pages/new-report/new-report.component';
import { SharedModule } from '../shared/shared.module';
import { PatternsConfigComponent } from '../pages/patterns-config/patterns-config.component';
import { StoreMappingComponent } from '../pages/store-mapping/store-mapping.component';
import { StoreParamsComponent } from '../pages/store-params/store-params.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    TransactionsComponent,
    RefDataComponent,
    UserComponent,
    NewTransactionComponent,
    RefDataComponent,
    NewRefDataComponent,
    BudgetComponent,
    BudgetItemComponent,
    ReportsComponent,
    ReportDataComponent,
    TextPatternsComponent,
    NewTextPatternComponent,
    NewReportComponent,
    PatternsConfigComponent,
    StoreMappingComponent,
    StoreParamsComponent,
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    FormsModule,
    DashboardModule,
    NgChartsModule,
    SharedModule
  ]
})
export class AdminLayoutModule { }
