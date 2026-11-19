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

    let wateringInfo = 'Last watering date unknown';

    if (hasWateringDate) {
        wateringInfo = daysAgo === 0
            ? 'Last watered today'
            : `Last watered ${daysAgo} days ago`;
    }

    return {
        ...plant,
        image: null,
        location: plant.location?.trim() || 'No location',
        status: !hasWateringDate || !Number.isFinite(frequency) || frequency < 1
            ? 'unknown'
            : daysAgo >= frequency ? 'water' : 'healthy',
        wateringInfo
    }
}