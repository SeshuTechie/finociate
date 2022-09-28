import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { BehaviorSubject } from 'rxjs';
import { CommonUtil } from '../shared/common-util';

@Injectable({
  providedIn: 'root'
})
export class DateRangeService {
  private dateRangeSubject = new BehaviorSubject({startDate: CommonUtil.getFY(0)?.startOf('month'), endDate: dayjs()});

  constructor() { }

  dateRange() {
    return this.dateRangeSubject.asObservable();
  }

  changeRange(range: any) {
    this.dateRangeSubject.next(range);
  }
}
