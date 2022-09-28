import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';
import { DateWindowComponent } from '../date-window/date-window.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NavbarComponent,
    DateWindowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule, 
    NgxDaterangepickerMd.forRoot()
  ],
  exports: [ 
    NavbarComponent 
  ]
})
export class NavbarModule { }
