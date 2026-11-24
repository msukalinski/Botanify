import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Linking, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import { notificationsSupported, requestNotificationPermission } from "../../services/notificationService";
import { colors } from "../../theme";

export default function PlantReminderToggle({
    value,
    onChange,
    hasWateringDate = true,
    disabled = false,
    onBusyChange = undefined,
}) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [permissionDenied, setPermissionDenied] = useState(false);
    const mounted = useRef(false);
    const pending = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        }
    }, []);

    const changeHandler = async (enabled) => {
        if (pending.current || disabled) {
            return;
        }

        setBusy(true);
        setError('');
        setPermissionDenied(false);
        onBusyChange?.(true);

        try {

        } catch (err) {

        } finally {

        }
    };

    const openSettings = async () => {
        try {
            await Linking.openSettings();
        } catch {
            if (mounted.current) {
                setError('Could not open phone settings. Open them manually.');
            }
        }
    }

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={styles.icon} accessible={false}>
                    <Ionicons name="notifications-outline" size={23} color={colors.primaryGreen} />
                </View>
                <View style={styles.copy}>
                    <Text style={styles.title}>Phone reminders</Text>
                    <Text style={styles.hint}>Remind me when watering is due.</Text>
                </View>
                {busy ? (
                    <ActivityIndicator size="small" color={colors.primaryGreen} />
                ) : null}
                <Switch
                    value={Boolean(value)}
                    onValueChange={changeHandler}
                    disabled={disabled || busy}
                    trackColor={{ false: '#D7DDCE', true: '#B6CC9E' }}
                    thumbColor={value ? colors.primaryGreen : '#FFFFFF'}
                    ios_backgroundColor={"#D7DDCE"}
                    accessibilityLabel="Phone reminders"
                    accessibilityState={{ disabled: disabled || busy, busy, checked: Boolean(value) }}
                />
            </View>
            {value && !hasWateringDate ? (
                <Text style={styles.hint}>Record a watering date to start scheduling reminders.</Text>
            ) : null}

            {notificationsSupported ? (
                <Text style={styles.hint}>Reminders arrive at 09:00 on this phone.</Text>
            ) : null}

            {!notificationsSupported ? (
                <Text style={styles.hint}>This preference is saved for the mobile app.</Text>
            ) : null}

            {error ? (
                <Text style={styles.error} accessibilityRole="alert">{error}</Text>
            ) : null}

            {permissionDenied ? (
                <Pressable
                    onPress={openSettings}
                    accessibilityRole="button"
                    accessibilityLabel="Open phone notification settings"
                >
                    <Text style={styles.link}>Open phone settings</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
        gap: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    icon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: colors.lightGreenBackground,
        alignItems: 'center',
        justifyContent: 'center'
    },
    copy: {
        flex: 1
    },
    title: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        color: colors.mainText
    },
    hint: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText
    },
    error: {
        fontSize: 12,
        lineHeight: 18,
        color: '#A63D32'
    },
    link: {
        fontSize: 13,
        lineHeight: 20,
        fontWeight: '600',
        color: colors.primaryGreen
    },
});