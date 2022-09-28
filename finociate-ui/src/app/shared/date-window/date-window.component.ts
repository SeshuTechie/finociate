import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import { DateRangeService } from 'src/app/services/date-range.service';
import { CommonUtil } from '../common-util';

@Component({
  selector: 'app-date-window',
  templateUrl: './date-window.component.html',
  styleUrls: ['./date-window.component.css']
})
export class DateWindowComponent implements OnInit {
  selected: any;// = {startDate: CommonUtil.getFY(0)?.startOf('month'), endDate: dayjs()};
  ranges: any = {
    'This FY': [CommonUtil.getFY(0)?.startOf('month'), dayjs()],
    'Last FY': [CommonUtil.getFY(-1)?.startOf('month'), CommonUtil.getFY(0)?.startOf('month').subtract(1, 'day')],
    'This Year': [dayjs().startOf('year'), dayjs()],
    'Last Year': [dayjs().subtract(1, 'year').startOf('year'), dayjs().subtract(1, 'year').endOf('year')],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }
  constructor(private dateRangeService: DateRangeService) { }

  ngOnInit(): void {
    this.dateRangeService.dateRange().subscribe(value => this.selected = value);
  }

  onDateWindowChanged(range: any) {
    console.log('Date Range Changed', range.startDate, range.endDate);
    this.dateRangeService.changeRange(range);
  }
}

