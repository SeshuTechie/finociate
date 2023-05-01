import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry } from 'rxjs';
import { Globals } from '../shared/global';
import { RefData } from '../shared/model/ref-data';
import { RefDataList } from '../shared/model/ref-data-list';
import { ServiceHelper } from './helper';
import { RefDataTypes } from '../shared/model/ref-data-types';

interface CacheDataMap {
  [key: string]: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RefDataService {
  apiURL = Globals.BASE_API_URL;

  constructor(private http: HttpClient) { 
    // load reference data
    Object.keys(RefDataTypes).filter((v) => isNaN(Number(v))).forEach(key => this.getDataItems(key));
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  refDataCache: CacheDataMap = {};

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

  deleteRefData(id: string, key: string) {
    delete this.refDataCache[key];
    return this.http
      .delete<RefData>(this.apiURL + '/ref-data/' + id, this.httpOptions)
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  addRefData(refData: RefData): Observable<RefData> {
    delete this.refDataCache[refData.key];
    return this.http.post<RefData>(
      this.apiURL + '/ref-data',
      JSON.stringify(refData),
      this.httpOptions
    )
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  getDataItems(key: string): string[] {
    if (this.refDataCache[key]) {
      return this.refDataCache[key];
    } else {
      this.getRefData(key).subscribe((data: RefDataList) => {
        if (data) {
          console.log("Got RefDatas", key, data);
          let values = data.list.map(d => d.value);
          this.refDataCache[key] = values;
          console.log("RefDataCache updated", this.refDataCache);
        }
      });
    }
    return [];
  }
}
