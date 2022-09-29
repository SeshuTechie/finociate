import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DateRangeService } from 'src/app/services/date-range.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { CommonUtil } from 'src/app/shared/common-util';
import { FilterParams } from 'src/app/shared/model/filter-params';
import { TransactionSummaryList } from 'src/app/shared/model/transaction-summary-list';

@Component({
  selector: 'app-monthly-view-chart',
  templateUrl: './monthly-view-chart.component.html',
  styleUrls: ['./monthly-view-chart.component.css']
})
export class MonthlyViewChartComponent implements OnInit {
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    datasets: []
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  filterParams: FilterParams = {
    fromDate: '',
    toDate: ''
  };

  constructor(private transactionService: TransactionService, private dateRangeService: DateRangeService) { }

  ngOnInit(): void {
    this.dateRangeService.dateRange().subscribe(value => {
      this.filterParams.fromDate = CommonUtil.getDateString(value.startDate);
      this.filterParams.toDate = CommonUtil.getDateString(value.endDate);
      this.loadMonthlyData();
    })
  }

  loadMonthlyData() {
    return this.transactionService.getMonthlyTransactionSummary(this.filterParams).subscribe((data: TransactionSummaryList) => {
      if (data) {
        console.log("Monthly Summary", data);
        let labels: any[] = [];

        let income: number[] = [];
        let spend: number[] = [];
        let savings: number[] = [];
        data.list.forEach((summary) => {
          labels.push(summary.date);
          income.push(summary.totalIncome);
          spend.push(summary.totalSpend);
          savings.push(summary.totalSavings);
        });
        let datasets = [
          { data: income, label: 'Income' },
          { data: spend, label: 'Spend' },
          { data: savings, label: 'Savings' }
        ];
        let barChartData: ChartConfiguration<'bar'>['data'] = {
          labels: labels,
          datasets: datasets
        }
        this.barChartData = barChartData;
      }
    });
  }
}
