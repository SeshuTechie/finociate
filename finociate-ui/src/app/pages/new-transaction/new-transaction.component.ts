import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { Transaction } from 'src/app/shared/model/transaction';
import { first } from 'rxjs/operators';

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
    account: '',
    store: '',
    subCategory: '',
    mode: '',
    particulars: '',
    tags: [],
    notes: ''
  };

  @Input() transactionText = '';
  
  isNewMode!: boolean;
  id!: string;

  constructor(public transactionService: TransactionService, public router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isNewMode = !this.id;
    console.log('NewMode', this.isNewMode, 'Id', this.id);
    if (!this.isNewMode) {
      this.transactionService.getTransaction(this.id).pipe(first()).subscribe(data => {
        this.transaction = data;
        console.log('transaction', this.transaction);
      });
    }
  }

  addTransaction(transaction: Transaction) {
    transaction.id = undefined;
    this.transactionService.createTransaction(this.transaction).subscribe((data: {}) => {
      this.router.navigate(['/transactions']);
    });
  }

  editTransaction(transaction: Transaction) {
    this.transactionService.updateTransaction(transaction.id, this.transaction).subscribe((data: {}) => {
      this.router.navigate(['/transactions']);
    });
  }

  findTransaction() {
    this.transactionService.findTransaction(this.transactionText).subscribe((data: Transaction) => {
      this.transaction = data;
    });
  }
}
