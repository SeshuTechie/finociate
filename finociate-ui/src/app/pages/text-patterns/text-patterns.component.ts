import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-text-patterns',
  templateUrl: './text-patterns.component.html',
  styleUrls: ['./text-patterns.component.css']
})
export class TextPatternsComponent implements OnInit {
  selectedTab: string = 'patterns';

  constructor(public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.selectedTab = this.route.snapshot.queryParams['tab'];
  }

  getTabActive(value: string): boolean {
    return value == this.selectedTab;
  } 
}
