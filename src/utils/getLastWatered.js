import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function getLastWatered(
    daysAgo,
    timeZone = 'Europe/Athens'
) {
    if (daysAgo === null) {
        return null;
    }

    return dayjs()
        .tz(timeZone)
        .subtract(daysAgo, 'day')
        .format('YYYY-MM-DD');
}