import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Transaction } from '../shared/model/transaction';
import { TransactionList } from '../shared/model/transaction-list';
import { FilterParams } from '../shared/model/filter-params';
import { TransactionSummary } from '../shared/model/transaction-summary';
import { AmountsData } from '../shared/model/transaction-summary copy';
import { Globals } from '../shared/global';
import { ServiceHelper } from './helper';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  apiURL = Globals.BASE_API_URL;

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // HttpClient API get() method => Fetch transactions list
  getTransactions(filterParams: FilterParams): Observable<TransactionList> {
    return this.http
      .get<TransactionList>(this.apiURL + '/transactions?' + this.getFilterString(filterParams))
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  // HttpClient API get() method => Fetch transactions summary
  getTransactionsSummary(filterParams: FilterParams): Observable<TransactionSummary> {
    return this.http
      .get<TransactionSummary>(this.apiURL + '/transactions/summary?' + this.getFilterString(filterParams))
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  // HttpClient API get() method => Fetch transactions summary
  getSpendCategoryData(filterParams: FilterParams): Observable<AmountsData> {
    return this.http
      .get<AmountsData>(this.apiURL + '/summary/categories?' + this.getFilterString(filterParams))
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  // HttpClient API get() method => Fetch transaction
  getTransaction(id: any): Observable<Transaction> {
    return this.http
      .get<Transaction>(this.apiURL + '/transaction/' + id)
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  // HttpClient API post() method => Create transaction
  createTransaction(transaction: any): Observable<Transaction> {
    return this.http
      .post<Transaction>(
        this.apiURL + '/transaction',
        JSON.stringify(transaction),
        this.httpOptions
      )
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  // HttpClient API post() method => Create transaction
  findTransaction(transactionText: string): Observable<Transaction> {
    return this.http
      .post<Transaction>(
        this.apiURL + '/text-transaction',
        JSON.stringify({ text: transactionText }),
        this.httpOptions
      )
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  // HttpClient API put() method => Update transaction
  updateTransaction(id: any, transaction: any): Observable<Transaction> {
    return this.http
      .put<Transaction>(
        this.apiURL + '/transaction/' + id,
        JSON.stringify(transaction),
        this.httpOptions
      )
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  // HttpClient API delete() method => Delete transaction
  deleteTransaction(id: any) {
    return this.http
      .delete<Transaction>(this.apiURL + '/transaction/' + id, this.httpOptions)
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }


  getFilterString(filterParams: FilterParams) {
    let filter = 'x=1';
    if (filterParams.fromDate != '') {
      filter += '&fromDate=' + filterParams.fromDate;
    }
    if (filterParams.toDate != '') {
      filter += '&toDate=' + filterParams.toDate;
    }
    console.log(filter);
    return filter;
  }
}


