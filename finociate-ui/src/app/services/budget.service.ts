import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, catchError } from "rxjs";
import { Globals } from "../shared/global";
import { Budget } from "../shared/model/budget";
import { BudgetItem } from "../shared/model/budget-item";
import { BudgetParams } from "../shared/model/budget-params";
import { ServiceHelper } from "./helper";
import { FilterParams } from "../shared/model/filter-params";

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  apiURL = Globals.BASE_API_URL;

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getBudget(budgetMonth: any): Observable<Budget> {
    return this.http
      .get<Budget>(this.apiURL + '/budget?budgetMonth=' + budgetMonth)
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  createBudget(budgetParams: BudgetParams): Observable<Budget> {
    return this.http
      .post<Budget>(
        this.apiURL + '/new-budget',
        JSON.stringify(budgetParams),
        this.httpOptions
      )
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  getBudgetItem(id: any): Observable<BudgetItem> {
    return this.http
      .get<BudgetItem>(this.apiURL + '/budget-item/' + id)
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  createBudgetItem(budgetItem: any): Observable<BudgetItem> {
    return this.http
      .post<BudgetItem>(
        this.apiURL + '/budget-item',
        JSON.stringify(budgetItem),
        this.httpOptions
      )
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  // HttpClient API put() method => Update budgetItem
  updateBudgetItem(id: any, budgetItem: any): Observable<BudgetItem> {
    return this.http
      .put<BudgetItem>(
        this.apiURL + '/budget-item',
        JSON.stringify(budgetItem),
        this.httpOptions
      )
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  // HttpClient API delete() method => Delete budgetItem
  deleteBudgetItem(id: any) {
    return this.http
      .delete<BudgetItem>(this.apiURL + '/budget-item/' + id, this.httpOptions)
      .pipe(retry(1), catchError(ServiceHelper.handleError));
  }

  responseTypeOptions: Object = {
    responseType: 'text/csv'
  };

  downloadBudget(filterParams: FilterParams): any {
    let options = { undefined, responseType: "csv" };
    return this.http
      .get<BudgetItem[]>(this.apiURL + '/budget/download?' + ServiceHelper.getFilterString(filterParams),
        this.responseTypeOptions);
  }
}
