import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { Transaction } from 'src/app/shared/model/transaction';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css']
})
export class NewTransactionComponent implements OnInit {
  @Input() transaction: Transaction = {
    id: '',
    date: '',
    description: '',
    amount: 0,
    category: '',
    type: '',
    store: '',
    subCategory: '',
    particulars: '',
    tags: [],
    notes: ''
  };

  @Input() transactionText = '';

  constructor(public transactionService: TransactionService, public router: Router) { }

  ngOnInit() { }

  addTransaction(transaction: Transaction) {
    transaction.id = undefined;
    this.transactionService.createTransaction(this.transaction).subscribe((data: {}) => {
      this.router.navigate(['/transactions']);
    });
  }

  findTransaction() {
    this.transactionService.findTransaction(this.transactionText).subscribe((data: Transaction) => {
      this.transaction = data;
    });
  }
}
