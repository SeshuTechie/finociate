import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
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

  constructor(public transactionService: TransactionService, public router: Router) { }
  
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
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
  }

  editTransaction(id: any) {
    this.router.navigate(['/edit-transaction/' + id]);
  }
}
