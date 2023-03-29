import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportsService } from 'src/app/services/reports.service';
import { ReportData } from 'src/app/shared/model/report-data';
import { ReportItemData } from 'src/app/shared/model/report-item-data';

@Component({
  selector: 'app-report-data',
  templateUrl: './report-data.component.html',
  styleUrls: ['./report-data.component.css']
})
export class ReportDataComponent implements OnInit {
  reportData!: ReportData;
  constructor(private reportsService: ReportsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    console.log("Trying to load report data: ", id);
    this.loadReportData(id);
  }

  loadReportData(id: string) {
    return this.reportsService.getReportData(id).subscribe((data: ReportData) => {
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
}
