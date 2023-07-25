import dayjs from 'dayjs';

export class CommonUtil {
    static getFYStart(adjYear: number) {
        if (dayjs().month() < 3) {
            adjYear -= 1;
        }
        return dayjs().add(adjYear, 'year').set('month', 3);
    }

    static getFYEnd(adjYear: number) {
        if (dayjs().month() > 3) {
            adjYear += 1;
        }
        return dayjs().add(adjYear, 'year').set('month', 3);
    }

    static getDateString(date: dayjs.Dayjs): string {
        if (date) {
            return date.date() + '-' + (date.month() + 1) + '-' + date.year();
        }
        return '';
    }

    static getMonthStart(date: string): string {
        if (date) {
            return '1-' + date.substring(date.indexOf('-') + 1);
        }
        return '';
    }

    static compareDates(d1: string, d2: string) {
        let n1 = this.getDateNumber(d1);
        let n2 = this.getDateNumber(d2);
        return n1 - n2;
    }

    static getDateNumber(date: string) {
        let parts = date.split('-');
        return Number(parts[2] + (parts[1].length < 2 ? '0' : '') + parts[1] + (parts[0].length < 2 ? '0' : '') + parts[0]);
    }

    static getCurrentDateTimeString() {
        let currentdate = new Date();
        let datetime = currentdate.getFullYear() +
                this.getString((currentdate.getMonth()+1), 2) +
                this.getString(currentdate.getDate(), 2) +
                this.getString(currentdate.getHours(), 2) +
                this.getString(currentdate.getMinutes(), 2) +
                this.getString(currentdate.getSeconds(), 2);
        return datetime;
    }

    static getString(value: any, minLength: number) {
        let str = '' + value;
        if (str.length < minLength) {
            str = str.padStart(minLength, '0');
        }
        return str;
    }
}
