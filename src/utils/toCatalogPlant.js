export function toCatalogPlant(plant, today) {
    const lastWateredDate = plant.lastWateredAt;

    const daysAgo = lastWateredDate
        ? Math.round((
            Date.parse(`${today}T00:00:00Z`)
            - Date.parse(`${lastWateredDate}T00:00:00Z`)
        ) / 86400000)
        : null;

    const hasWateringDate = Number.isFinite(daysAgo) && daysAgo >= 0;
    const frequency = Number(plant.wateringFrequencyDays);

    const daysUntilWatering = frequency - daysAgo;

    let wateringInfo = 'Last watering date unknown';
    let lastWateredLabel = 'Not sure';
    let nextWateringLabel = 'Water once to start tracking';

    if (hasWateringDate) {
        wateringInfo = daysAgo === 0
            ? 'Last watered today'
            : `Last watered ${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;

        lastWateredLabel = daysAgo === 0
            ? 'Today'
            : `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;

        nextWateringLabel = daysUntilWatering === 0
            ? 'Due today'
            : daysUntilWatering > 0
                ? `In ${daysUntilWatering} ${daysUntilWatering === 1 ? 'day' : 'days'
                }`
                : `${Math.abs(daysUntilWatering)} ${daysUntilWatering === -1 ? 'day' : 'days'
                } overdue`;
    }

    return {
        ...plant,
        image: null,
        location: plant.location?.trim() || 'No location',
        status: !hasWateringDate || !Number.isFinite(frequency) || frequency < 1
            ? 'unknown'
            : daysAgo >= frequency ? 'water' : 'healthy',
        wateringInfo,
        lastWateredLabel,
        nextWateringLabel
    }
}