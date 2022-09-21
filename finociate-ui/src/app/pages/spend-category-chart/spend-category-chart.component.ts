import { Component } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { TransactionService } from 'src/app/services/transaction.service';
import { FilterParams } from 'src/app/shared/model/filter-params';
import { AmountsData } from 'src/app/shared/model/transaction-summary copy';

@Component({
  selector: 'app-spend-category-chart',
  templateUrl: './spend-category-chart.component.html',
  styleUrls: ['./spend-category-chart.component.css']
})
export class SpendCategoryChartComponent {
  title = 'ng2-charts-demo';

  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels : string[] = [];
  public pieChartDatasets = [ { data: [ 1, 2, 3 ]  } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(public transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    let filterParams: FilterParams = {
      fromDate: '',
      toDate: ''
    }
    return this.transactionService.getSpendCategoryData(filterParams).subscribe((data: AmountsData) => {
      console.log(data);
      this.pieChartLabels = [];
      let values: number[] = [];
      for (const [k, v] of Object.entries(data.data)) {
        this.pieChartLabels.push(k);
        values.push(v);
      }
      this.pieChartDatasets = [{ data: values }];
    });
  }
}
