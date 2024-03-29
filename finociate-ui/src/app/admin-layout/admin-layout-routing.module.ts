import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetItemComponent } from '../pages/budget-item/budget-item.component';
import { BudgetComponent } from '../pages/budget/budget.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { NewRefDataComponent } from '../pages/new-ref-data/new-ref-data.component';
import { NewTransactionComponent } from '../pages/new-transaction/new-transaction.component';
import { RefDataComponent } from '../pages/ref-data/ref-data.component';
import { ReportDataComponent } from '../pages/report-data/report-data.component';
import { ReportsComponent } from '../pages/reports/reports.component';
import { TransactionsComponent } from '../pages/transactions/transactions.component';
import { UserComponent } from '../pages/user/user.component';
import { TextPatternsComponent } from '../pages/text-patterns/text-patterns.component';
import { NewTextPatternComponent } from '../pages/new-text-pattern/new-text-pattern.component';
import { NewReportComponent } from '../pages/new-report/new-report.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user', component: UserComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'new-transaction', component: NewTransactionComponent },
  { path: 'edit-transaction/:id', component: NewTransactionComponent },
  { path: 'budget', component: BudgetComponent },
  { path: 'new-budget-item/:month', component: BudgetItemComponent },
  { path: 'edit-budget-item/:id', component: BudgetItemComponent },
  { path: 'ref-data', component: RefDataComponent },
  { path: 'new-ref-data', component: NewRefDataComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'report-data/:id', component: ReportDataComponent },
  { path: 'text-patterns', component: TextPatternsComponent },
  { path: 'new-text-pattern', component: NewTextPatternComponent },
  { path: 'edit-text-pattern/:id', component: NewTextPatternComponent },
  { path: 'new-report-def', component: NewReportComponent },
  { path: 'edit-report-def/:id', component: NewReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
