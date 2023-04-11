import { throwError } from "rxjs";
import { FilterParams } from "../shared/model/filter-params";

export class ServiceHelper {
    // Error handling
    static handleError(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            console.error('error', error);
            if (error.error) {
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.description}`;
            } else {
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
        }
        window.alert(errorMessage);
        return throwError(() => {
            return errorMessage;
        });
    }

    static getFilterString(filterParams: FilterParams) {
        let filter = '';
        if (filterParams.fromDate != '') {
            filter += '&fromDate=' + filterParams.fromDate;
        }
        if (filterParams.toDate != '') {
            filter += '&toDate=' + filterParams.toDate;
        }
        console.log('Filters', filter);
        return filter;
    }
}