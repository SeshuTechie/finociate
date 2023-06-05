import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ReportsService } from 'src/app/services/reports.service';
import { ReportDef } from 'src/app/shared/model/report-def';
import { ReportItemDef } from 'src/app/shared/model/report-item-def';
import { ReportRowDef } from 'src/app/shared/model/report-row-def';
import { TransactionCriteria } from 'src/app/shared/model/transaction-criteria';

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.css']
})
export class NewReportComponent implements OnInit {
  @Input() reportDef: ReportDef = {
    name: '',
    description: '',
    rowDefList: []
  };

  isNewMode!: boolean;
  id!: string;

  constructor(private reportsService: ReportsService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isNewMode = !this.id;
    console.log('NewMode', this.isNewMode, 'Id', this.id);
    if (!this.isNewMode) {
      this.reportsService.getReportDef(this.id).pipe(first()).subscribe(data => {
        this.reportDef = data;
        let i = 1;
        this.reportDef.rowDefList.forEach(rowDef => rowDef.rowNum = i++);
        console.log('reportDef', this.reportDef);
      });
    }
  }

  addReportDef() {
    this.reportDef.id = undefined;
    this.prepareReportDefData();
    this.reportsService.addReportDef(this.reportDef).subscribe((data: {}) => {
      this.router.navigate(['/reports']);
    });
  }

  editReportDef() {
    this.prepareReportDefData();
    this.reportsService.updateReportDef(this.reportDef.id, this.reportDef).subscribe((data: {}) => {
      this.router.navigate(['/reports']);
    });
  }

  addNewRow() {
    let rowDef: ReportRowDef = {
      rowNum: this.reportDef.rowDefList.length + 1,
      itemDefList: []
    };
    this.reportDef.rowDefList.push(rowDef);
  }

  deleteRowDef(rowIndex: number) {
    this.reportDef.rowDefList.splice(rowIndex, 1);
  }

  addNewItem(rowDef: ReportRowDef) {
    let itemDef: ReportItemDef = {
      title: '',
      criteriaList: [],
      groupByFields: [],
      aggregationType: '',
      valueType: '',
      displayType: ''
    }
    rowDef.itemDefList.push(itemDef);
  }

  deleteItemDef(rowDef: ReportRowDef, itemIndex: number) {
    rowDef.itemDefList.splice(itemIndex, 1);
  }

  deleteGroupByField(itemDef: ReportItemDef, index: number) {
    itemDef.groupByFields.splice(index, 1);
  }

  addGroupByField(itemDef: ReportItemDef) {
    itemDef.groupByFields.push('');
  }

  addCriteriaDef(itemDef: ReportItemDef) {
    let critriaDef: TransactionCriteria = {
      field: '',
      value: '',
      condition: ''
    }
    itemDef.criteriaList.push(critriaDef);
  }

  deleteCriteriaDef(itemDef: ReportItemDef, index: number) {
    itemDef.criteriaList.splice(index, 1);
  }

  prepareReportDefData() {
    this.reportDef.rowDefList.sort((a, b) => (a.rowNum - b.rowNum));
    this.reportDef.rowDefList.forEach(rowDef => {
      rowDef.itemDefList.forEach(itemDef => {
        itemDef.criteriaList.forEach(criteriaDef => {
          if (criteriaDef.field == 'amount') {
            criteriaDef.value = +criteriaDef.value;
          }
        })
      })
    })
  }
}

