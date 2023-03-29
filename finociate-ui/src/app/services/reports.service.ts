import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Globals } from '../shared/global';
import { ReportData } from '../shared/model/report-data';
import { ReportDef } from '../shared/model/report-def';
import { ReportDefList } from '../shared/model/report-def-list';
import { ServiceHelper } from './helper';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  apiURL = Globals.BASE_API_URL;

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // HttpClient API get() method => Fetch transactions list
  getReportDefs(): Observable<ReportDefList> {
    return this.http
      .get<ReportDefList>(this.apiURL + '/report-def/all')
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  updateReportDef(id: any, transaction: any): Observable<ReportDef> {
    return this.http
      .put<ReportDef>(
        this.apiURL + '/report-def',
        JSON.stringify(transaction),
        this.httpOptions
      )
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  deleteReportDef(id: any) {
    return this.http
      .delete<ReportDef>(this.apiURL + '/report-def/' + id, this.httpOptions)
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  getReportData(id: string): Observable<ReportData> {
    return this.http
      .get<ReportData>(this.apiURL + '/report/' + id)
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }
}
