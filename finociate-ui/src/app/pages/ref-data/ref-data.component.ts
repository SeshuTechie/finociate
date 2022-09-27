import { Component, OnInit } from '@angular/core';
import { RefDataService } from 'src/app/services/ref-data.service';
import { RefData } from 'src/app/shared/model/ref-data';
import { RefDataList } from 'src/app/shared/model/ref-data-list';

@Component({
  selector: 'app-ref-data',
  templateUrl: './ref-data.component.html',
  styleUrls: ['./ref-data.component.css']
})
export class RefDataComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  refDatas!: RefData[];
  filterParams: any = {
    key: '',
    valueLike: ''
  }
  constructor(public refDataService: RefDataService) { }
  
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.loadRefData();
  }

  // Get refData list
  loadRefData() {
    this.refDatas = [];
    return this.refDataService.getRefData(this.filterParams.key, this.filterParams.valueLike).subscribe((data: RefDataList) => {
      this.refDatas = data.list;
      console.log("RefDatas", data);
    });
  }

  // Delete refData
  deleteRefData(id: any) {
    if (window.confirm('Are you sure, you want to delete? ' + id)) {
      this.refDataService.deleteRefData(id).subscribe((data) => {
        this.loadRefData();
      });
    }
  }
}
