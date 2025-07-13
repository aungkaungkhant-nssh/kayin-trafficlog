import { format } from 'date-fns';

function excelDateToJSDate(serial: number): string {
    const utc_days = serial - 25569;
    const utc_value = utc_days * 86400 * 1000; // milliseconds in day
    const date = new Date(utc_value);

    // Format date as 'yyyy-MM-dd'
    return format(date, 'yyyy-MM-dd');
}

export default excelDateToJSDate;