import { Component } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { DateRangeService } from 'src/app/services/date-range.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { CommonUtil } from 'src/app/shared/common-util';
import { FilterParams } from 'src/app/shared/model/filter-params';
import { AmountsData } from 'src/app/shared/model/amounts-data';

@Component({
  selector: 'app-spend-category-chart',
  templateUrl: './spend-category-chart.component.html',
  styleUrls: ['./spend-category-chart.component.css']
})
export class SpendCategoryChartComponent {
  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      }
    }
  };

  public pieChartLabels: string[] = [];
  public pieChartDatasets = [{ data: [1, 2, 3] }];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  filterParams: FilterParams = {
    fromDate: '',
    toDate: ''
  }
  constructor(public transactionService: TransactionService, private dateRangeService: DateRangeService) { }

  ngOnInit(): void {
    this.dateRangeService.dateRange().subscribe(value => {
      this.filterParams.fromDate = CommonUtil.getDateString(value.startDate);
      this.filterParams.toDate = CommonUtil.getDateString(value.endDate);
      this.loadData();
    })
  }

  loadData() {
    return this.transactionService.getSpendCategoryData(this.filterParams).subscribe((data: AmountsData) => {
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
