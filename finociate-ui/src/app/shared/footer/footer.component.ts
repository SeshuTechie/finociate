import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'comp-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  today : Date = new Date();

  constructor() { }

  ngOnInit(): void {
  }
}
