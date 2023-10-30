import { NgModule } from "@angular/core";
import { CustomCurrencyPipe } from "./custom-currency-pipe";
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [CustomCurrencyPipe, ScrollToTopComponent],
    exports: [CustomCurrencyPipe, ScrollToTopComponent],
    imports: [CommonModule]
  })
  export class SharedModule{}