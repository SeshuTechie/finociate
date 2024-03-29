import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TextPatternsService } from 'src/app/services/text-patterns.service';
import { TextPattern } from 'src/app/shared/model/text-pattern';

@Component({
  selector: 'patterns-config',
  templateUrl: './patterns-config.component.html',
  styleUrls: ['./patterns-config.component.css']
})
export class PatternsConfigComponent {
  textPatterns!: TextPattern[];

  constructor(public textPatternService: TextPatternsService, public router: Router) {}

  ngOnInit(): void {
    this.loadTextPatterns();
  }

  loadTextPatterns() {
    this.textPatterns = [];
    return this.textPatternService.getAllTextPatterns().subscribe((data: TextPattern[]) => {
      this.textPatterns = data;
      this.textPatterns.sort((a, b) => a.name < b.name ? -1 : 1);
      console.log("Text Patterns", this.textPatterns);
    });
  }

  deleteTextPattern(id: any) {
    if (window.confirm('Are you sure, you want to delete? ' + id)) {
      this.textPatternService.deleteTextPattern(id).subscribe((data) => {
        this.loadTextPatterns();
      });
    }
    return false;
  }

  editTextPattern(id: any) {
    this.router.navigate(['/edit-text-pattern/' + id]);
  }
}
