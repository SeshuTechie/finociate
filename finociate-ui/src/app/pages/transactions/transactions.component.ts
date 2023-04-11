import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DateRangeService } from 'src/app/services/date-range.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { CommonUtil } from 'src/app/shared/common-util';
import { FilterParams } from 'src/app/shared/model/filter-params';
import { Transaction } from 'src/app/shared/model/transaction';
import { TransactionList } from 'src/app/shared/model/transaction-list';
import {DataTableDirective} from 'angular-datatables';
import { Globals } from 'src/app/shared/global';

// declare var $:any;

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {  
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  transactions!: Transaction[];
  filterParams: FilterParams = {
    fromDate: '',
    toDate: ''
  }
  currencyCode = Globals.CURRENCY_CODE;
  
  constructor(public transactionService: TransactionService, private dateRangeService: DateRangeService, public router: Router) { }
  
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.dateRangeService.dateRange().subscribe(value => {
      this.filterParams.fromDate = CommonUtil.getDateString(value.startDate);
      this.filterParams.toDate = CommonUtil.getDateString(value.endDate);
      this.loadTransactions(false);
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
       dtInstance.destroy();
       this.dtTrigger.next(0);
   });
  }

  // Get transactions list
  loadTransactions(render: boolean) {
    this.transactions = [];
    return this.transactionService.getTransactions(this.filterParams).subscribe((data: TransactionList) => {
      this.transactions = data.transactions;
      console.log("Transactions", data);
      if (render) {
        this.rerender();
      }
    });
  }
  // Delete transaction
  deleteTransaction(id: any) {
    if (window.confirm('Are you sure, you want to delete? ' + id)) {
      this.transactionService.deleteTransaction(id).subscribe((data) => {
        this.loadTransactions(true);
      });
    }
    return false;
  }

  editTransaction(id: any) {
    this.router.navigate(['/edit-transaction/' + id]);
  }

  getTransactionColor(transaction: Transaction) {
    return transaction.type == 'credit' ? '#e8f8f5' : transaction.category == 'Savings' ? '#f4ecf7' : '#fdedec';
  }
}
