import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DateRangeService } from 'src/app/services/date-range.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { CommonUtil } from 'src/app/shared/common-util';
import { FilterParams } from 'src/app/shared/model/filter-params';
import { Transaction } from 'src/app/shared/model/transaction';
import { TransactionList } from 'src/app/shared/model/transaction-list';
import { Globals } from 'src/app/shared/global';
import { saveAs } from 'file-saver';
import { RefDataService } from 'src/app/services/ref-data.service';
import { RefDataTypes } from 'src/app/shared/model/ref-data-types';

type RefData = {
  accounts: string[],
  categories: string[],
  subcategories: string[],
  stores: string[],
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions!: Transaction[];
  filteredTransactions!: Transaction[];
  filterParams: FilterParams = {
    fromDate: '',
    toDate: ''
  }
  dateFilters: FilterParams = {
    fromDate: '',
    toDate: ''
  }
  currencyCode = Globals.CURRENCY_CODE;

  @Input() filterTransaction: Transaction = {
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

  refData: RefData = {
    accounts: [],
    categories: [],
    subcategories: [],
    stores: []
  };

  constructor(public transactionService: TransactionService, private dateRangeService: DateRangeService,
    private refDataService: RefDataService, public router: Router) { }

  ngOnInit(): void {
    this.dateRangeService.dateRange().subscribe(value => {
      this.filterParams.fromDate = CommonUtil.getDateString(value.startDate);
      this.filterParams.toDate = CommonUtil.getDateString(value.endDate);
      this.loadTransactions(false);
    });
    this.loadRefData();
  }

  // Get transactions list
  loadTransactions(render: boolean) {
    console.log("Loading Transactions...", this.filterParams);
    this.transactions = [];
    return this.transactionService.getTransactions(this.filterParams).subscribe((data: TransactionList) => {
      this.transactions = data.transactions;
      this.filteredTransactions = this.transactions;
      this.filteredTransactions.sort(this.compareTransactions);
      console.log("Transactions count", this.transactions.length);
    });
  }

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

  compareTransactions(a: Transaction, b: Transaction) {
    if (CommonUtil.compareDates(a.date, b.date) > 0) {
      return 1;
    } else if (CommonUtil.compareDates(a.date, b.date) < 0) {
      return -1;
    }
    if (a.account > b.account) {
      return 1;
    } else if (a.account < b.account) {
      return -1;
    }
    if (a.type > b.type) {
      return 1;
    } else if (a.type < b.type) {
      return -1;
    }
    if (a.description > b.description) {
      return 1;
    } else if (a.description < b.description) {
      return -1;
    }
    return 0;
  }

  downloadTransactions() {
    console.log("Downloading Transactions...", this.filterParams);
    return this.transactionService.downloadTransactions(this.filterParams)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: 'text/csv; charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        //window.open(url);
        saveAs(blob, 'Transactions_' + CommonUtil.getCurrentDateTimeString() + '.csv');
      }), (error: any) => console.log('Error downloading the file'),
      () => console.info('File downloaded successfully');
  }


  loadRefData() {
    this.refData.accounts = this.refDataService.getDataItems(RefDataTypes[RefDataTypes.account]);
    this.refData.categories = this.refDataService.getDataItems(RefDataTypes[RefDataTypes.category]);
    this.refData.subcategories = this.refDataService.getDataItems(RefDataTypes[RefDataTypes.subcategory]);
    this.transactionService.getDistinctValues('store').subscribe(data => {
      this.refData.stores = data;
      console.log("Stores", this.refData.stores);
    });
  }

  filterTransactions() {
    this.filteredTransactions = this.transactions;
    if (this.dateFilters.fromDate != '') {
      this.filteredTransactions = this.filteredTransactions.filter(t => CommonUtil.compareDates(this.dateFilters.fromDate, t.date) <= 0);
    }
    if (this.dateFilters.toDate != '') {
      this.filteredTransactions = this.filteredTransactions.filter(t => CommonUtil.compareDates(this.dateFilters.toDate, t.date) >= 0);
    }
    if (this.filterTransaction.account != '') {
      this.filteredTransactions = this.filteredTransactions.filter(t => t.account == this.filterTransaction.account)
    }
    if (this.filterTransaction.type != '') {
      this.filteredTransactions = this.filteredTransactions.filter(t => t.type == this.filterTransaction.type)
    }
    if (this.filterTransaction.category != '') {
      this.filteredTransactions = this.filteredTransactions.filter(t => t.category == this.filterTransaction.category)
    }
    if (this.filterTransaction.subCategory != '') {
      this.filteredTransactions = this.filteredTransactions.filter(t => t.subCategory == this.filterTransaction.subCategory)
    }
    if (this.filterTransaction.description != '') {
      this.filteredTransactions = this.filteredTransactions.filter(t => t.description.toLowerCase().indexOf(this.filterTransaction.description.toLowerCase()) >= 0)
    }
    if (this.filterTransaction.store != '') {
      this.filteredTransactions = this.filteredTransactions.filter(t => t.store.toLowerCase().indexOf(this.filterTransaction.store.toLowerCase()) >= 0)
    }
    switch (this.filterTransaction.mode) {
      case 'eq':
        this.filteredTransactions = this.filteredTransactions.filter(t => t.amount == this.filterTransaction.amount);
        break;
      case 'ne':
        this.filteredTransactions = this.filteredTransactions.filter(t => t.amount != this.filterTransaction.amount);
        break;
      case 'gt':
        this.filteredTransactions = this.filteredTransactions.filter(t => t.amount > this.filterTransaction.amount);
        break;
      case 'lt':
        this.filteredTransactions = this.filteredTransactions.filter(t => t.amount < this.filterTransaction.amount);
        break;
    }
    this.filteredTransactions.sort(this.compareTransactions);
    console.log("Filtered Transactions count", this.filteredTransactions.length);
  }

  resetTransactionFilters() {
    this.dateFilters.fromDate = '';
    this.dateFilters.toDate = '';
    this.filterTransaction.account = '';
    this.filterTransaction.type = '';
    this.filterTransaction.category = '';
    this.filterTransaction.subCategory = '';
    this.filterTransaction.description = '';
    this.filterTransaction.store = '';
    this.filterTransaction.mode = ''; // used for amount
    this.filterTransaction.amount = 0;

    this.filteredTransactions = this.transactions;
  }
}
