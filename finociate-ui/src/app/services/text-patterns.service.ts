import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { TextPattern } from '../shared/model/text-pattern';
import { ServiceHelper } from './helper';
import { Globals } from '../shared/global';
import { StoreMappingList } from '../shared/model/store-mapping-list';
import { StoreMapping } from '../shared/model/store-mapping';
import { StoreParams } from '../shared/model/store-params';
import { StoreParamsList } from '../shared/model/store-params-list';

@Injectable({
  providedIn: 'root'
})
export class TextPatternsService {
  apiURL = Globals.BASE_API_URL;

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getAllTextPatterns(): Observable<TextPattern[]> {
    return this.http
      .get<TextPattern[]>(this.apiURL + '/transaction-text-patterns')
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  updateTextPattern(id: any, textPattern: any): Observable<TextPattern> {
    return this.http
      .put<TextPattern>(
        this.apiURL + '/transaction-text-pattern',
        JSON.stringify(textPattern),
        this.httpOptions
      )
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  deleteTextPattern(id: any) {
    return this.http
      .delete<TextPattern>(this.apiURL + '/transaction-text-pattern/' + id, this.httpOptions)
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  getTextPattern(id: string) {
    return this.http
      .get<TextPattern>(this.apiURL + '/transaction-text-pattern/' + id)
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  createTextPattern(textPattern: any): Observable<TextPattern> {
    return this.http
      .post<TextPattern>(
        this.apiURL + '/transaction-text-pattern',
        JSON.stringify(textPattern),
        this.httpOptions
      )
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  deleteStoreMapping(id: any) {
    return this.http
      .delete<TextPattern>(this.apiURL + '/store-mapping/' + id, this.httpOptions)
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  getAllStoreMappings() {
    return this.http
      .get<StoreMappingList>(this.apiURL + '/store-mappings/')
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  addStoreMapping(newMapping: StoreMapping): Observable<StoreMapping> {
    return this.http
      .post<StoreMapping>(
        this.apiURL + '/store-mapping',
        JSON.stringify(newMapping),
        this.httpOptions
      )
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  deleteStoreParams(id: any) {
    return this.http
      .delete<StoreParams>(this.apiURL + '/store-params/' + id, this.httpOptions)
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  getAllStoreParams() {
    return this.http
      .get<StoreParamsList>(this.apiURL + '/store-params/')
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  addStoreParams(newStoreParams: StoreParams): Observable<StoreParams> {
    return this.http
      .post<StoreParams>(
        this.apiURL + '/store-params',
        JSON.stringify(newStoreParams),
        this.httpOptions
      )
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }
}
