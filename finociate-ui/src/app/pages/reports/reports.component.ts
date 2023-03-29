import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/services/reports.service';
import { ReportDef } from 'src/app/shared/model/report-def';
import { ReportDefList } from 'src/app/shared/model/report-def-list';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  reportDefs!: ReportDef[];

  constructor(private reportsService: ReportsService, public router: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.loadReportDefs();
  }

  loadReportDefs() {
    this.reportDefs = [];
    return this.reportsService.getReportDefs().subscribe((data: ReportDefList) => {
      this.reportDefs = data.reportDefs;
      console.log("Report Definitions", this.reportDefs);
    });
  }

  deleteReportDef(id: any) {
    if (window.confirm('Are you sure, you want to delete? ' + id)) {
      this.reportsService.deleteReportDef(id).subscribe((data) => {
        this.loadReportDefs();
      });
    }
    return false;
  }

  editReportDef(id: any) {
    this.router.navigate(['/edit-report-def/' + id]);
  }
}
