import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetService } from 'src/app/services/budget.service';
import { BudgetItem } from 'src/app/shared/model/budget-item';

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

  constructor(private budgetService: BudgetService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
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
    console.log('NewMode:', this.isNewMode);
    
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

}
