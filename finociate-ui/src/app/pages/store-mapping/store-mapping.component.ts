import { Component, OnInit } from '@angular/core';
import { TextPatternsService } from 'src/app/services/text-patterns.service';
import { StoreMapping } from 'src/app/shared/model/store-mapping';
import { StoreMappingList } from 'src/app/shared/model/store-mapping-list';

@Component({
  selector: 'store-mapping',
  templateUrl: './store-mapping.component.html',
  styleUrls: ['./store-mapping.component.css']
})
export class StoreMappingComponent implements OnInit {
  storeMappings!: StoreMapping[];
  newMapping: StoreMapping = {
    storeFound: '',
    mapToStore: ''
  }
  constructor(public textPatternService: TextPatternsService) { }
  
  ngOnInit(): void {
    this.loadStoreMappings();
  }

  loadStoreMappings() {
    this.storeMappings = [];
    return this.textPatternService.getAllStoreMappings().subscribe((data: StoreMappingList) => {
      this.storeMappings = data.list;
      this.storeMappings.sort(this.compareStoreMappings);
      console.log("Store Mappings", this.storeMappings);
    });
  }

  addStoreMapping() {
    this.textPatternService.addStoreMapping(this.newMapping).subscribe(() => {
      this.loadStoreMappings();
    });
  }

  deleteStoreMapping(id: any, store: string) {
    if (window.confirm('Are you sure, you want to delete? ' + store)) {
      this.textPatternService.deleteStoreMapping(id).subscribe(() => {
        this.loadStoreMappings();
      });
    }
  }

  compareStoreMappings(a: StoreMapping, b: StoreMapping) {
    if (a.storeFound > b.storeFound) {
      return 1;
    } else if (a.storeFound < b.storeFound) {
      return -1;
    }
    return 0;
  }
}
