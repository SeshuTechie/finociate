import { NgModule } from "@angular/core";
import { CustomCurrencyPipe } from "./custom-currency-pipe";

@NgModule({
    declarations: [CustomCurrencyPipe],
    exports: [CustomCurrencyPipe]
  })
  export class SharedModule{}