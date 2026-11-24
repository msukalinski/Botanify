export function getLastWatered(
    daysAgo,
    timeZone = 'Europe/Athens',
    now = new Date(),
) {
    if (daysAgo === null) {
        return null;
    }

    if (!Number.isSafeInteger(daysAgo) || daysAgo < 0) {
        throw new Error('Invalid last watered selection.');
    }

    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        calendar: 'gregory',
        numberingSystem: 'latn',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(now);

    const part = (type) => Number(parts.find((value) => value.type === type)?.value);
    const date = new Date(Date.UTC(part('year'), part('month') - 1, part('day')));

    date.setUTCDate(date.getUTCDate() - daysAgo);

    if (!Number.isFinite(date.getTime())) {
        throw new Error('Could not calculate the watering date.');
    }

    return date.toISOString().slice(0, 10);
}