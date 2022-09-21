import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';
import { FilterParams } from 'src/app/shared/model/filter-params';
import { TransactionSummary } from 'src/app/shared/model/transaction-summary';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  summary: TransactionSummary = {
    totalIncome: 0,
    totalSpend: 0,
    totalSavings: 0,
    savingsPercent: 0
  };
  currencySymbl = "₹";
  currencyCode = "INR";

  constructor(public transactionService: TransactionService) { }

  ngOnInit(): void {
    this.getSummary();
  }

  getSummary() {
    let filterParams: FilterParams = {
      fromDate: '',
      toDate: ''
    }
    return this.transactionService.getTransactionsSummary(filterParams).subscribe((data: TransactionSummary) => {
      this.summary = data;
      console.log("Transactions", data);
    });
  }
}
