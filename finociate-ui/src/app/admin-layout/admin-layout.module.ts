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

@NgModule({
  declarations: [
    AdminLayoutComponent,
    TransactionsComponent,
    UserComponent,
    NewTransactionComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    DataTablesModule,
    FormsModule,
    DashboardModule
  ]
})
export class AdminLayoutModule { }