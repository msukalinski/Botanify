import { Alert, Platform } from 'react-native';

export function confirmAction({ title, message, confirmText, destructive = false }) {
    if (Platform.OS === 'web') {
        return Promise.resolve(
            typeof globalThis.confirm === 'function'
                && globalThis.confirm(`${title}\n\n${message}`),
        );
    }

    return new Promise((resolve) => {
        Alert.alert(title, message, [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            {
                text: confirmText,
                style: destructive ? 'destructive' : 'default',
                onPress: () => resolve(true),
            },
        ], { cancelable: true, onDismiss: () => resolve(false) });
    });
}
