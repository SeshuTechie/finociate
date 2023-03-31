import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DateRangeService } from 'src/app/services/date-range.service';
import { ReportsService } from 'src/app/services/reports.service';
import { CommonUtil } from 'src/app/shared/common-util';
import { Globals } from 'src/app/shared/global';
import { AggregationTypes } from 'src/app/shared/model/aggregation-types';
import { FilterParams } from 'src/app/shared/model/filter-params';
import { ReportData } from 'src/app/shared/model/report-data';
import { ReportItemData } from 'src/app/shared/model/report-item-data';
import { ReportItemEntry } from 'src/app/shared/model/report-item-entry';
import { ValueTypes } from 'src/app/shared/model/value-types';

@Component({
  selector: 'app-report-data',
  templateUrl: './report-data.component.html',
  styleUrls: ['./report-data.component.css']
})
export class ReportDataComponent implements OnInit {
  reportData!: ReportData;
  constructor(private reportsService: ReportsService, private dateRangeService: DateRangeService, private router: Router, private route: ActivatedRoute) { }
  currencySymbl = Globals.CURRENCY_SYMBOL;
  currencyCode = Globals.CURRENCY_CODE;
  filterParams: FilterParams = {
    fromDate: '',
    toDate: ''
  }
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
  public pieChartLegend = true;
  public pieChartPlugins = [];

  // Bar
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };


  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    console.log("Trying to load report data: ", id);
    this.dateRangeService.dateRange().subscribe(value => {
      this.filterParams.fromDate = CommonUtil.getDateString(value.startDate);
      this.filterParams.toDate = CommonUtil.getDateString(value.endDate);
      this.loadReportData(id);
    })

  }

  loadReportData(id: string) {
    console.log("Loading reportdata for ", id, " with filer ", this.filterParams);
    return this.reportsService.getReportData(id, this.filterParams).subscribe((data: ReportData) => {
      this.reportData = data;
      console.log("Report Data", this.reportData);
    });
  }

  getKeys(object: any) {
    return Object.keys(object);
  }

  isSimpleItem(itemData: ReportItemData) {
    if (!itemData.valueType || "Simple" == itemData.valueType) {
      return true;
    }
    return false;
  }

  isCreditDebitSavingsItem(itemData: ReportItemData) {
    if ("CreditDebitSavings" == itemData.valueType) {
      return true;
    }
    return false;
  }

  getPieChartLabels(itemData: ReportItemData): string[] {
    if (itemData.aggregationType == AggregationTypes[AggregationTypes.Overall]) {
      if (itemData.valueType == ValueTypes[ValueTypes.CreditDebitSavings]) {
        return ['Credit', 'Debit', 'Savings'];
      }
      if (itemData.valueType == ValueTypes[ValueTypes.Simple] &&
        itemData.groupByFields && itemData.groupByFields.length == 1) {
        let itemEntries = itemData.itemEntries[AggregationTypes[AggregationTypes.Overall]];
        return itemEntries.map(entry => entry.fieldValues[0])
      };
    }
    return [];
  }

  getPieChartDatasets(itemData: ReportItemData) {
    let values: number[] = [];
    if (itemData.aggregationType == AggregationTypes[AggregationTypes.Overall]) {
      let itemEntries = itemData.itemEntries[AggregationTypes[AggregationTypes.Overall]];
      if (itemData.valueType == ValueTypes[ValueTypes.CreditDebitSavings]) {
        values.push(itemEntries[0].credit);
        values.push(itemEntries[0].debit);
        values.push(itemEntries[0].savings);
      } else if (itemData.valueType == ValueTypes[ValueTypes.Simple] &&
        itemData.groupByFields && itemData.groupByFields.length == 1) {
        itemEntries.forEach(entry => values.push(entry.amount));
      }
    }
    return [{ data: values }];
  }

  getBarChartData(itemData: ReportItemData) {
    let labels: any[] = [];
    let datasets: any[] = [];

    if (itemData.aggregationType == AggregationTypes[AggregationTypes.Overall]) {
      let itemEntries = itemData.itemEntries[AggregationTypes[AggregationTypes.Overall]];
      if (itemData.groupByFields && itemData.groupByFields.length > 0) {
        if (itemData.valueType == ValueTypes[ValueTypes.Simple]) {
          let amounts: number[] = [];
          itemEntries.forEach(entry => {
            labels.push(entry.fieldValues.toString());
            amounts.push(entry.amount);
          });
          datasets = [
            { data: amounts, label: 'Amount' }
          ];
        } else if (itemData.valueType == ValueTypes[ValueTypes.CreditDebitSavings]) {
          let credits: number[] = [];
          let debits: number[] = [];
          let savings: number[] = [];
          itemEntries.forEach(entry => {
            labels.push(entry.fieldValues.toString());
            credits.push(entry.credit);
            debits.push(entry.debit);
            savings.push(entry.savings);
          });
          datasets = [
            { data: credits, label: 'Credit' },
            { data: debits, label: 'Debit' },
            { data: savings, label: 'Savings' }
          ];

        }
      } else {
        if (itemData.valueType == ValueTypes[ValueTypes.Simple]) {
          let amounts: number[] = [];
            labels.push('Amount');
            amounts.push(itemEntries[0].amount);
          datasets = [
            { data: amounts, label: 'Amount' }
          ];
        } else if (itemData.valueType == ValueTypes[ValueTypes.CreditDebitSavings]) {
          let credits: number[] = [];
          let debits: number[] = [];
          let savings: number[] = [];
            labels.push('Amount');
            credits.push(itemEntries[0].credit);
            debits.push(itemEntries[0].debit);
            savings.push(itemEntries[0].savings);
          datasets = [
            { data: credits, label: 'Credit' },
            { data: debits, label: 'Debit' },
            { data: savings, label: 'Savings' }
          ];

        }
      }
    } else if (itemData.aggregationType == AggregationTypes[AggregationTypes.Monthly]) {
      if (!itemData.groupByFields || itemData.groupByFields.length == 0) {
        if (itemData.valueType == ValueTypes[ValueTypes.Simple]) {
          let amounts: number[] = [];
          Object.entries(itemData.itemEntries).forEach(([key, entries]) => {
            labels.push(key);
            if (entries.length > 0) {
              amounts.push(entries[0].amount);
            }
          });
          datasets = [
            { data: amounts, label: 'Amount' }
          ];
        } else if (itemData.valueType == ValueTypes[ValueTypes.CreditDebitSavings]) {
          let credits: number[] = [];
          let debits: number[] = [];
          let savings: number[] = [];
          Object.entries(itemData.itemEntries).forEach(([key, entries]) => {
            labels.push(key);
            if (entries.length > 0) {
              credits.push(entries[0].credit);
              debits.push(entries[0].debit);
              savings.push(entries[0].savings);
            }
          });
          datasets = [
            { data: credits, label: 'Credit' },
            { data: debits, label: 'Debit' },
            { data: savings, label: 'Savings' }
          ];
        }
      }
    }

    let barChartData: ChartConfiguration<'bar'>['data'] = {
      labels: labels,
      datasets: datasets
    }
    return barChartData;
  }
}
