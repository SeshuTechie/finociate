import { NgModule } from "@angular/core";
import { CustomCurrencyPipe } from "./custom-currency-pipe";
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { CommonModule } from '@angular/common';
import { TabGroupComponent } from './tab-group/tab-group.component';
import { TabContentComponent } from './tab-content/tab-content.component';

@NgModule({
    declarations: [CustomCurrencyPipe, ScrollToTopComponent, TabGroupComponent, TabContentComponent],
    exports: [CustomCurrencyPipe, ScrollToTopComponent, TabGroupComponent, TabContentComponent],
    imports: [CommonModule]
  })
  export class SharedModule{}