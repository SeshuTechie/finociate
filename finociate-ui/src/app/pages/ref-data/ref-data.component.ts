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
  refDatas!: RefData[];
  filterParams: any = {
    key: '',
    valueLike: ''
  }
  constructor(public refDataService: RefDataService) { }
  
  ngOnInit(): void {
    this.loadRefData();
  }

  // Get refData list
  loadRefData() {
    this.refDatas = [];
    return this.refDataService.getRefData(this.filterParams.key, this.filterParams.valueLike).subscribe((data: RefDataList) => {
      this.refDatas = data.list;
      this.refDatas.sort(this.compareRefData);
      console.log("RefDatas", data);
    });
  }

  // Delete refData
  deleteRefData(id: any, key: string) {
    if (window.confirm('Are you sure, you want to delete? ' + id)) {
      this.refDataService.deleteRefData(id, key).subscribe((data) => {
        this.loadRefData();
      });
    }
  }

  compareRefData(a: RefData, b: RefData) {
    if (a.key > b.key) {
      return 1;
    } else if (a.key < b.key) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    } else if (a.value < b.value) {
      return -1;
    }
    if (a.description > b.description) {
      return 1;
    } else if (a.description < b.description) {
      return -1;
    }
    return 0;
  }
}
