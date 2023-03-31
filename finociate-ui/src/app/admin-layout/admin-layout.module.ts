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
import { DataTablesModule } from 'angular-datatables';
import { NewTransactionComponent } from '../pages/new-transaction/new-transaction.component';
import { DashboardModule } from '../pages/dashboard/dashboard.module';
import { RefDataComponent } from '../pages/ref-data/ref-data.component';
import { NewRefDataComponent } from '../pages/new-ref-data/new-ref-data.component';
import { BudgetComponent } from '../pages/budget/budget.component';
import { BudgetItemComponent } from '../pages/budget-item/budget-item.component';
import { ReportsComponent } from '../pages/reports/reports.component';
import { ReportDataComponent } from '../pages/report-data/report-data.component';
import { NgChartsModule } from 'ng2-charts';

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
    ReportDataComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    DataTablesModule,
    FormsModule,
    DashboardModule,
    NgChartsModule
  ]
})
export class AdminLayoutModule { }
