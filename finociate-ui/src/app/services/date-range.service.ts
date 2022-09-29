import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { CommonUtil } from '../shared/common-util';

@Injectable({
  providedIn: 'root'
})
export class DateRangeService {
  private dateRangeSubject: Subject<any>; 

  constructor() { 
    this.dateRangeSubject = new BehaviorSubject({startDate: CommonUtil.getFY(0)?.startOf('month'), endDate: dayjs()}); 
  }

  dateRange() {
    return this.dateRangeSubject.asObservable();
  }

  changeRange(range: any) {
    this.dateRangeSubject.next(range);
  }
}
