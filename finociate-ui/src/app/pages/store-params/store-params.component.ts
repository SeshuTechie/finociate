import { Component, OnInit } from '@angular/core';
import { TextPatternsService } from 'src/app/services/text-patterns.service';
import { StoreParams } from 'src/app/shared/model/store-params';
import { StoreParamsList } from 'src/app/shared/model/store-params-list';

@Component({
  selector: 'store-params',
  templateUrl: './store-params.component.html',
  styleUrls: ['./store-params.component.css']
})
export class StoreParamsComponent implements OnInit {
  storeParamsList!: StoreParams[];
  newStoreParams: StoreParams = {
    store: '',
    description: '',
    category: '',
    subcategory: '',
  }
  constructor(public textPatternService: TextPatternsService) { }
  
  ngOnInit(): void {
    this.loadStoreParams();
  }

  loadStoreParams() {
    this.storeParamsList = [];
    return this.textPatternService.getAllStoreParams().subscribe((data: StoreParamsList) => {
      this.storeParamsList = data.list;
      this.storeParamsList.sort(this.compareStoreMappings);
      console.log("Store Mappings", this.storeParamsList);
    });
  }

  addStoreParams() {
    this.textPatternService.addStoreParams(this.newStoreParams).subscribe(() => {
      this.loadStoreParams();
    });
  }

  deleteStoreParams(id: any, store: string) {
    if (window.confirm('Are you sure, you want to delete? ' + store)) {
      this.textPatternService.deleteStoreParams(id).subscribe(() => {
        this.loadStoreParams();
      });
    }
  }

  compareStoreMappings(a: StoreParams, b: StoreParams) {
    if (a.store > b.store) {
      return 1;
    } else if (a.store < b.store) {
      return -1;
    }
    return 0;
  }
}
