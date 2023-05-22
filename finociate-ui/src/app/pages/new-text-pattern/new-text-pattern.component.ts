import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TextPatternsService } from 'src/app/services/text-patterns.service';
import { TextPattern } from 'src/app/shared/model/text-pattern';
import { first } from 'rxjs/operators';
import { RefDataService } from 'src/app/services/ref-data.service';
import { RefDataTypes } from 'src/app/shared/model/ref-data-types';

@Component({
  selector: 'app-new-text-pattern',
  templateUrl: './new-text-pattern.component.html',
  styleUrls: ['./new-text-pattern.component.css']
})
export class NewTextPatternComponent {
  isNewMode!: boolean;
  id!: string;
  textPattern: TextPattern = {
    name: '',
    identifier: '',
    pattern: '',
    datePattern: '',
    otherValues: {
      account: '',
      type: '',
      mode: '',
      store: '',
      description: '',
      amount: 0,
      category: '',
      date: '',
      notes: '',
      particulars: '',
      subCategory: '',
      tags: [],
    }
  };

  accounts!: string[];
  modes!: string[];

  constructor(private textPatternService: TextPatternsService, private refDataService: RefDataService,
    private router: Router, private route: ActivatedRoute) { }
  
    ngOnInit() {
      this.id = this.route.snapshot.params['id'];
      this.isNewMode = !this.id;
      this.loadRefData();
      console.log('NewMode', this.isNewMode, 'Id', this.id);
      if (!this.isNewMode) {
        this.textPatternService.getTextPattern(this.id).pipe(first()).subscribe(data => {
          this.textPattern = data;
          console.log('text pattern', this.textPattern);
        });
      }

    }

    loadRefData() {
      this.accounts = this.refDataService.getDataItems(RefDataTypes[RefDataTypes.account]);
      this.modes = this.refDataService.getDataItems(RefDataTypes[RefDataTypes.mode]);
    }

    addTextPattern() {
      this.textPattern.id = undefined;
      this.textPatternService.createTextPattern(this.textPattern).subscribe((data: {}) => {
        this.router.navigate(['/text-patterns']);
      });
    }
  
    editTextPattern() {
      this.textPatternService.updateTextPattern(this.textPattern.id, this.textPattern).subscribe((data: {}) => {
        this.router.navigate(['/text-patterns']);
      });
    }
}
