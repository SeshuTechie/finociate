import { Component, OnInit } from '@angular/core';
import { DateRangeService } from 'src/app/services/date-range.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { CommonUtil } from 'src/app/shared/common-util';
import { FilterParams } from 'src/app/shared/model/filter-params';
import { TransactionSummary } from 'src/app/shared/model/transaction-summary';
import { Globals } from 'src/app/shared/global';
import { BudgetService } from 'src/app/services/budget.service';
import { Budget } from 'src/app/shared/model/budget';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  summary: TransactionSummary = {
    date: '',
    totalIncome: 0,
    totalSpend: 0,
    totalSavings: 0,
    savingsPercent: 0
  };
  budget = {
    balance: 0
  };
  filterParams: FilterParams = {
    fromDate: '',
    toDate: ''
  }
  currencySymbl = Globals.CURRENCY_SYMBOL;
  currencyCode = Globals.CURRENCY_CODE;

  constructor(public transactionService: TransactionService, private dateRangeService: DateRangeService, private budgetService: BudgetService,) { }

  ngOnInit(): void {
    this.dateRangeService.dateRange().subscribe(value => {
      console.log('Date changed for dashboard', value);
      this.filterParams.fromDate = CommonUtil.getDateString(value.startDate);
      this.filterParams.toDate = CommonUtil.getDateString(value.endDate);
      console.log('Dashboard filterParams', this.filterParams);
      this.getSummary();
      this.loadBudget();
    })
  }

  getSummary() {
    return this.transactionService.getTransactionsSummary(this.filterParams).subscribe((data: TransactionSummary) => {
      if (isNaN(data.savingsPercent)) {
        data.savingsPercent = 0;
      }
      this.summary = data;
      console.log("Transactions", data);
    });
  }

  loadBudget() {
    let date = CommonUtil.getMonthStart(this.filterParams.toDate);
    console.debug('Budget Date', date);
    this.budgetService.getBudget(date).subscribe((data: Budget) => {
      if (data) {
        this.budget.balance = this.getBudgetBalance(data);
      } else {
        this.budget.balance = 0;
      }
    });
  }

  getBudgetBalance(budget: Budget): number {
    let balance: number = 0;
    budget.summaryItems.forEach(item => balance += item.balance);
    return balance;
  }
}
