import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';
import { BudgetService } from 'src/app/services/budget.service';
import { Budget } from 'src/app/shared/model/budget';
import { DateRangeService } from 'src/app/services/date-range.service';
import { CommonUtil } from 'src/app/shared/common-util';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Globals } from 'src/app/shared/global';
import { BudgetSummaryItem } from 'src/app/shared/model/budget-summary-item';
import { BudgetItem } from 'src/app/shared/model/budget-item';
import { saveAs } from 'file-saver';
import { FilterParams } from 'src/app/shared/model/filter-params';

dayjs.extend(customParseFormat);

interface ParticularsSummaryMap {
  [key: string]: number;
}

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  budget: Budget = {
    budgetItems: [],
    summaryItems: []
  };
  totalSummary: BudgetSummaryItem = {
    account: 'Total',
    balance: 0,
    brought: 0,
    inflow: 0,
    outflow: 0,
    transferIn: 0,
    transferOut: 0
  };
  particularSummary: ParticularsSummaryMap = {};
  budgetMonth = '';
  showBudgetFrom = '';
  createBudgetFrom = '';
  currencyCode = Globals.CURRENCY_CODE;
  filterParams: FilterParams = {
    fromDate: '',
    toDate: ''
  }
  constructor(public budgetService: BudgetService, private dateRangeService: DateRangeService, public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let fromMonth = this.route.snapshot.queryParams['budgetMonth'];
    
    if (fromMonth) {
      if (fromMonth.split('-').length == 3) {
        this.showBudgetFrom = fromMonth.substring(fromMonth.indexOf('-') + 1);
      } else {
        this.showBudgetFrom = fromMonth;
      }
    } else {
      let month = dayjs().startOf('month');
      this.showBudgetFrom = (month.month() + 1) + '-' + month.year();
    }

    console.log('fromMonth: ', fromMonth, 'showBudgetFrom', this.showBudgetFrom);
    this.dateRangeService.dateRange().subscribe(value => {
      this.filterParams.fromDate = CommonUtil.getDateString(value.startDate);
      this.filterParams.toDate = CommonUtil.getDateString(value.endDate);
    });
    this.loadBudget();
  }

  loadBudget() {
    return this.budgetService.getBudget('1-' + this.showBudgetFrom).subscribe((data: Budget) => {
      if (data) {
        this.budget = data;
        this.sortData();
        this.computeTotalSummary();
        this.computeParticularsSummary();
      } else {
        this.budget = {budgetItems: [], summaryItems: []};
        this.initializeSummary();
        this.particularSummary = {};
        alert('No budget available for ' + this.showBudgetFrom);
      }
      this.budgetMonth = this.showBudgetFrom;
      console.log("Budget", data);
    });
  }

  initializeSummary() {
    this.totalSummary = {
      account: 'Total',
      balance: 0,
      brought: 0,
      inflow: 0,
      outflow: 0,
      transferIn: 0,
      transferOut: 0,
    };
  }

  createBudget() {
    let budgetParams = {budgetMonth: '1-' + this.showBudgetFrom, fromMonth: '1-' + this.createBudgetFrom};
    return this.budgetService.createBudget(budgetParams).subscribe((data: Budget) => {
      if (data) {
        this.budget = data;
        this.budgetMonth = this.showBudgetFrom;
      } else {
        alert('No budget available for ' + this.createBudgetFrom);
      }
      console.log("Budget", data);
    });
  }

  deleteBudgetItem(id: any) {
    if (window.confirm('Are you sure, you want to delete? ' + id)) {
      this.budgetService.deleteBudgetItem(id).subscribe((data) => {
        this.loadBudget();
      });
    }
    return false;
  }

  editBudgetItem(id: any) {
    this.router.navigate(['/edit-budget-item/' + id]);
  }

  addBudgetItem() {
    let uri = '/new-budget-item/' + (this.budgetMonth == '' ? this.showBudgetFrom : this.budgetMonth);
    console.log('trying to load', uri);
    this.router.navigate([uri]);
  }

  computeTotalSummary() {
    this.initializeSummary();
    this.budget.summaryItems.forEach(item => {
      this.totalSummary.balance += item.balance;
      this.totalSummary.brought += item.brought;
      this.totalSummary.inflow += item.inflow;
      this.totalSummary.outflow += item.outflow;
    });
  }

  computeParticularsSummary() {
    this.particularSummary = {};
    this.budget.budgetItems.forEach(item => {
      let value = 0;
      if (this.particularSummary[item.particulars]) {
        value = this.particularSummary[item.particulars];
      }
      value += item.amount;
      this.particularSummary[item.particulars] = value;
    });
  }

  sortData() {
    this.budget.summaryItems.sort((a, b) => (a.account > b.account) ? 1 : 0)
    this.budget.budgetItems.sort(this.compareBudgetItems)
  }

  compareBudgetItems(a: BudgetItem, b: BudgetItem ) {
    if ( a.account > b.account ){
      return 1;
    } else if ( a.account < b.account ){
      return -1;
    }
    if ( a.type > b.type ){
      return 1;
    } else if ( a.type < b.type ){
      return -1;
    }
    if ( a.description > b.description ){
      return 1;
    } else if ( a.description < b.description ){
      return -1;
    }
    return 0;
  }

  getKeys(object: any) {
    // retrun all keys except empty string
    return Object.keys(object).filter(key => key != '').sort();
  }

  downloadBudget() {
    console.log("Downloading Budget...", this.filterParams);
    return this.budgetService.downloadBudget(this.filterParams)
      .subscribe((response: any) => {
        let blob: any = new Blob([response], { type: 'text/csv; charset=utf-8' });
        const url = window.URL.createObjectURL(blob);

        saveAs(blob, 'Budget_' + CommonUtil.getCurrentDateTimeString() + '.csv');
      }), (error: any) => console.log('Error downloading the file'),
      () => console.info('File downloaded successfully');
  }
}
