import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateRangeService } from 'src/app/services/date-range.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { CommonUtil } from 'src/app/shared/common-util';
import { FilterParams } from 'src/app/shared/model/filter-params';
import { Transaction } from 'src/app/shared/model/transaction';
import { TransactionList } from 'src/app/shared/model/transaction-list';

// declare var $:any;

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {  
  dtOptions: DataTables.Settings = {};
  transactions!: Transaction[];
  filterParams: FilterParams = {
    fromDate: '',
    toDate: ''
  }

  constructor(public transactionService: TransactionService, private dateRangeService: DateRangeService, public router: Router) { }
  
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.dateRangeService.dateRange().subscribe(value => {
      this.filterParams.fromDate = CommonUtil.getDateString(value.startDate);
      this.filterParams.toDate = CommonUtil.getDateString(value.endDate);
    })
    this.loadTransactions();
  }

  // Get transactions list
  loadTransactions() {
    this.transactions = [];
    return this.transactionService.getTransactions(this.filterParams).subscribe((data: TransactionList) => {
      this.transactions = data.transactions;
      console.log("Transactions", data);
    });
  }
  // Delete transaction
  deleteTransaction(id: any) {
    if (window.confirm('Are you sure, you want to delete? ' + id)) {
      this.transactionService.deleteTransaction(id).subscribe((data) => {
        this.loadTransactions();
      });
    }
    return false;
  }

  editTransaction(id: any) {
    this.router.navigate(['/edit-transaction/' + id]);
  }
}
