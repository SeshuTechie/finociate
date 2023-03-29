import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../services/reports.service';
import { ReportDef } from '../shared/model/report-def';
import { ReportDefList } from '../shared/model/report-def-list';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon:'bi-pie-chart', class: '' },
  { path: '/transactions', title: 'Transactions', icon:'bi-cash-stack', class: '' },
  { path: '/budget', title: 'Budget', icon:'bi-file-earmark-bar-graph', class: '' },
  { path: '/user', title: 'User Profile', icon:'bi-person', class: '' },
];

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public menuItems!: any[];
  public reportDefs!: ReportDef[];

  constructor(private reportsService: ReportsService) {
  }

  ngOnInit(): void {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.loadReportDefs();
  }

  loadReportDefs() {
    this.reportDefs = [];
    return this.reportsService.getReportDefs().subscribe((data: ReportDefList) => {
      this.reportDefs = data.reportDefs;
      console.log("Report Definitions", this.reportDefs);
    });
  }
}
