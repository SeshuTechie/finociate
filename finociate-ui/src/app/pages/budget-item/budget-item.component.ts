import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetService } from 'src/app/services/budget.service';
import { RefDataService } from 'src/app/services/ref-data.service';
import { BudgetItem } from 'src/app/shared/model/budget-item';
import { RefDataTypes } from 'src/app/shared/model/ref-data-types';

@Component({
  selector: 'app-budget-item',
  templateUrl: './budget-item.component.html',
  styleUrls: ['./budget-item.component.css']
})
export class BudgetItemComponent implements OnInit {
  isNewMode!: boolean;
  id!: string;
  @Input() budgetItem: BudgetItem = {
    description: '',
    amount: 0,
    date: '',
    type: '',
    account: '',
    category: '',
    particulars: ''
  };
  accounts!: string[];

  constructor(private budgetService: BudgetService, private refDataService: RefDataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.accounts = this.refDataService.getDataItems(RefDataTypes[RefDataTypes.account]);

    console.debug('Reached budget item');
    let id = this.route.snapshot.params['id'];
    if (id) {
      this.isNewMode = false;
      this.budgetService.getBudgetItem(id).subscribe(data => {
        this.budgetItem = data;
      });
    } else {
      this.isNewMode = true;
      let month = this.route.snapshot.params['month'];
      this.budgetItem.date = month;
    }
    console.log('NewMode:', this.isNewMode, 'BudgetItem:', this.budgetItem);
    
  }

  addBudgetItem(budgetItem: BudgetItem) {
    budgetItem.id = undefined;
    this.budgetItem.date = '1-' + this.budgetItem.date;
    this.budgetService.createBudgetItem(this.budgetItem).subscribe((data: {}) => {
      this.router.navigate(['/budget'], {queryParams: {budgetMonth: budgetItem.date}});
    });
  }

  editBudgetItem(budgetItem: BudgetItem) {
    this.budgetService.updateBudgetItem(budgetItem.id, this.budgetItem).subscribe((data: {}) => {
      this.router.navigate(['/budget'], {queryParams: {budgetMonth: budgetItem.date}});
    });
  }

  cancelBudgetItem(budgetItem: BudgetItem) {
    this.router.navigate(['/budget'], {queryParams: {budgetMonth: budgetItem.date}});
  }
}
