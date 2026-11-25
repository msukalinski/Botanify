import { Platform } from "react-native";
import { getReminderDate } from '../utils/getReminderDate';

export const notificationsSupported = Platform.OS === 'ios' || Platform.OS === 'android';
const PREFIX = 'botanify';
const CHANNEL = 'watering';
let notifications;
let reminderUserId = null;
let sessionNumber = 0;

/** @returns {typeof import('expo-notifications')} */
function getNotifications() {
    if (!notifications) {
        notifications = require('expo-notifications');
        notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowBanner: true,
                shouldShowList: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });
    }
    return notifications;
}

const reminderId = (ownerId, plantId) => `${PREFIX}watering:${ownerId}:${plantId}`;
const isAllowed = (permission) => permission.granted
    || permission.ios?.status === getNotifications().IosAuthorizationStatus.PROVISIONAL;

async function prepareAndroidChannel() {
    if (Platform.OS === 'android') {
        await getNotifications().setNotificationChannelAsync(CHANNEL, {
            name: 'Watering reminders',
            importance: getNotifications().AndroidImportance.DEFAULT,
            sound: 'default',
        });
    }
}

export async function requestNotificationPermission() {
    if (!notificationsSupported) {
        return false;
    }

    const sdk = getNotifications();
    await prepareAndroidChannel();

    let permission = await sdk.getPermissionsAsync();

    if (!isAllowed(permission) && permission.canAskAgain) {
        permission = await sdk.requestPermissionsAsync({
            ios: {
                allowAlert: true,
                allowSound: true,
                allowBadge: false,
            },
        });
    }
    return isAllowed(permission);
}

export function setReminderUser(userId) {
    reminderUserId = userId;
    sessionNumber += 1;
}

async function cancelReminder(identifier) {
    const sdk = getNotifications();

    await sdk.cancelScheduledNotificationAsync(identifier);
    await sdk.dismissNotificationAsync(identifier);
}

export async function cancelPlantReminder(plantId, ownerId) {
    if (!notificationsSupported) {
        return null;
    }

    try {
        await cancelReminder(reminderId(ownerId, plantId));
        return null;
    } catch {
        return 'The plant was deleted, but its phone reminder could not be cancelled. Reopen the app to retry.';
    }
}

export async function schedulePlantReminder(plant) {
    if (!notificationsSupported || !plant?.ownerId || plant.ownerId !== reminderUserId) {
        return null;
    }

    const startedInSession = sessionNumber;
    const isCurrent = () => startedInSession === sessionNumber && plant.ownerId === reminderUserId;

    try {
        const sdk = getNotifications();
        const identifier = reminderId(plant.ownerId, plant.id);
        await cancelReminder(identifier);

        if (!isCurrent() || !plant.remindersEnabled) {
            return null;
        }

        const date = getReminderDate(plant);

        if (!date) {
            return null;
        }

        if (!isAllowed(await sdk.getPermissionsAsync())) {
            return 'The plant was saved. Allow phone notifications in your settings to receive watering reminders.';
        }

        await prepareAndroidChannel();

        if (!isCurrent()) {
            return null;
        }

        await sdk.scheduleNotificationAsync({
            identifier,
            content: {
                title: `${plant.name} needs water`,
                body: 'Check your plant and water it if needed.',
                sound: 'default',
                data: { app: 'botanify', ownerId: plant.ownerId, plantId: plant.id },
            },
            trigger: { type: sdk.SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL }
        });

        if (!isCurrent()) {
            await cancelReminder(identifier);
        }

        return null;
    } catch {
        return 'The plant was saved, but its phone reminder could not be scheduled. Reopen the app to retry.';
    }
}

export async function clearPlantReminders() {
    if (!notificationsSupported) {
        return;
    }

    const startedInSession = sessionNumber;
    const sdk = getNotifications();
    const pending = await sdk.getAllScheduledNotificationsAsync();
    const presented = await sdk.getPresentedNotificationsAsync();

    for (const request of [...pending, ...presented.map((item) => item.request)]) {
        if (startedInSession !== sessionNumber) {
            return;
        }

        if (request.identifier.startsWith(PREFIX)) {
            await cancelReminder(request.identifier);
        }
    }
}