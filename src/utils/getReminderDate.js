import { getLastWatered } from "./getLastWatered";

export const REMINDER_HOUR = 9;

export function getReminderDate(plant, now = new Date()) {
    const lastWatered = plant.lastWateredAt;
    const frequency = Number(plant.wateringFrequencyDays);

    if (typeof lastWatered === 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(lastWatered)
        || !Number.isInteger(frequency) || frequency < 1 || frequency > 30) {
        return null;
    }

    const due = new Date(`${lastWatered}T00:00:00Z`);

    if (!Number.isFinite(due.getTime()) || due.toISOString().slice(0, 10) !== lastWatered
        || lastWatered > getLastWatered(0, undefined, now)) {
        return null;
    }

    due.setUTCDate(due.getUTCDate() + frequency);

    let date = new Date(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate(), REMINDER_HOUR);

    if (date <= now) {
        date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), REMINDER_HOUR);

        if (date <= now) {
            date.setDate(date.getDate() + 1);
        }
    }

    return date;
}