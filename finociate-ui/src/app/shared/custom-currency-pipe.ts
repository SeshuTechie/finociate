import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

    transform(value: number, currencyCode: string): any {
        const curr = value.toLocaleString(getLocaleString(currencyCode), {
            style: 'currency',
            currency: currencyCode
        });
        return curr;
    }

}

function getLocaleString(currencyCode: string): Intl.LocalesArgument {
    let locale = 'en-US';
    switch(currencyCode) {
        case 'INR':
            locale = 'en-IN';
    }
    return locale;
}
