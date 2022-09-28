import dayjs from 'dayjs';

export class CommonUtil {
    static getFY(adjYear: number) {
        if (dayjs().month() < 3) {
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
}