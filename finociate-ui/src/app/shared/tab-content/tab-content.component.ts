import { Component, Input } from '@angular/core';

@Component({
  selector: 'tab-content',
  templateUrl: './tab-content.component.html',
  styleUrls: ['./tab-content.component.css']
})
export class TabContentComponent {
  @Input('tabTitle') title: string = '';
  @Input('tabLink') link: string = '#';
  @Input() active = false;
}
