import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { Transaction } from 'src/app/shared/model/transaction';
import { first } from 'rxjs/operators';
import { RefDataService } from 'src/app/services/ref-data.service';
import { RefDataTypes } from 'src/app/shared/model/ref-data-types';

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

  accounts!: string[];
  categories!: string[];
  subcategories!: string[];
  modes!: string[];
  stores!: string[];
  descriptions!: string[];

  constructor(private transactionService: TransactionService, private refDataService: RefDataService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadRefData();
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
      if (data) {
        this.transaction = data;
      } else {
        alert('No transaction found');
        console.log("Got no transaction");
      }
    });
  }

  loadRefData() {
    this.accounts = this.refDataService.getDataItems(RefDataTypes[RefDataTypes.account]);
    this.categories = this.refDataService.getDataItems(RefDataTypes[RefDataTypes.category]);
    this.subcategories = this.refDataService.getDataItems(RefDataTypes[RefDataTypes.subcategory]);
    this.modes = this.refDataService.getDataItems(RefDataTypes[RefDataTypes.mode]);
    this.transactionService.getDistinctValues(RefDataTypes[RefDataTypes.mode]).subscribe(data => {
      this.stores = data;
      console.log("Stores", this.stores);
    });
  }

  descriptionChanged() {
    if (this.transaction.description && this.transaction.description.length >= 3) {
      this.transactionService.getDistinctValues(RefDataTypes[RefDataTypes.description]).subscribe(data => {
        this.descriptions = data;
        console.log("Descriptions", this.descriptions);
      });
    }
  }
}
