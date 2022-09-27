import { throwError } from "rxjs";

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

}