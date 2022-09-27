import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry } from 'rxjs';
import { Globals } from '../shared/global';
import { RefData } from '../shared/model/ref-data';
import { RefDataList } from '../shared/model/ref-data-list';
import { ServiceHelper } from './helper';

@Injectable({
  providedIn: 'root'
})
export class RefDataService {
  apiURL = Globals.BASE_API_URL;

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getRefData(key?: string, valueLike?: string): Observable<RefDataList> {
    return this.http
      .get<RefDataList>(this.apiURL + '/ref-data?' + this.getParams(key, valueLike))
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  getParams(key?: string, valueLike?: string) {
    let params = 'x=1';
    if (key && key != '') {
      params += '&key=' + key;
    }
    if (valueLike && valueLike != '') {
      params += '&valueLike=' + valueLike;
    }
    console.log(params);
    return params;
  }

  deleteRefData(id: any) {
    return this.http
      .delete<RefData>(this.apiURL + '/ref-data/' + id, this.httpOptions)
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  addRefData(refData: RefData): Observable<RefData> {
    return this.http.post<RefData>(
      this.apiURL + '/ref-data',
      JSON.stringify(refData),
      this.httpOptions
    )
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }
}
