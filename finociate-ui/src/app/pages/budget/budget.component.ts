import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs, { Dayjs } from 'dayjs';
import { BudgetService } from 'src/app/services/budget.service';
import { Budget } from 'src/app/shared/model/budget';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  budget: Budget = {
    budgetItems: [],
    summaryItems: []
  };
  budgetMonth = '';
  showBudgetFrom = '';
  createBudgetFrom = '';

  constructor(public budgetService: BudgetService, public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.dtOptions = {
      paging: false
    };

    let fromMonth = this.route.snapshot.queryParams['budgetMonth'];
    
    if (fromMonth) {
      this.showBudgetFrom = fromMonth.substring(fromMonth.indexOf('-') + 1);
    } else {
      let month = dayjs().startOf('month');
      this.showBudgetFrom = month.month() + '-' + month.year();
    }

    console.log('fromMonth: ', fromMonth, 'showBudgetFrom', this.showBudgetFrom);
    this.loadBudget();
  }

  loadBudget() {
    return this.budgetService.getBudget('1-' + this.showBudgetFrom).subscribe((data: Budget) => {
      if (data) {
        this.budget = data;
        this.budgetMonth = this.showBudgetFrom;
      } else {
        alert('No budget available for ' + this.showBudgetFrom);
      }
      console.log("Budget", data);
    });
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
    this.router.navigate(['/new-budget-item/' + this.budgetMonth]);
  }

  getItemColor(type: string) {
    let color = 'white';
    switch(type) {
      case 'credit':
        color = '#e8f8f5';
        break;
      case 'debit':
        color = '#fdedec';
        break;
      case 'brought':
        color = '#ebf5fb';
        break;
      case 'transferTo':
        color = '#f4f6f6';
        break;
    }
    return color;
  }

  getSummaryItemColor(balance: number) {
    return balance > 0 ? '#e8f8f5' : '#fdedec';
  }
}
