import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RefDataService } from 'src/app/services/ref-data.service';
import { RefData } from 'src/app/shared/model/ref-data';
import { RefDataTypes } from 'src/app/shared/model/ref-data-types';

@Component({
  selector: 'app-new-ref-data',
  templateUrl: './new-ref-data.component.html',
  styleUrls: ['./new-ref-data.component.css']
})
export class NewRefDataComponent implements OnInit {
  @Input() refData: RefData = {
    key: '',
    value: '',
    description: ''
  }
  dataKeys: string[] = [];

  constructor(public refDataService: RefDataService, public router: Router) { }

  ngOnInit(): void {
    Object.keys(RefDataTypes).filter((v) => isNaN(Number(v))).forEach(key => this.dataKeys.push(key));
  }

  addRefData(refData: RefData) {
    refData.id = undefined;
    this.refDataService.addRefData(refData).subscribe((data: {}) => {
      this.router.navigate(['/ref-data']);
    });;
  }
}
