import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { NewRefDataComponent } from '../pages/new-ref-data/new-ref-data.component';
import { NewTransactionComponent } from '../pages/new-transaction/new-transaction.component';
import { RefDataComponent } from '../pages/ref-data/ref-data.component';
import { TransactionsComponent } from '../pages/transactions/transactions.component';
import { UserComponent } from '../pages/user/user.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user', component: UserComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'new-transaction', component: NewTransactionComponent },
  { path: 'ref-data', component: RefDataComponent },
  { path: 'new-ref-data', component: NewRefDataComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
