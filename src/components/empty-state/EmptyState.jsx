import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import { colors } from "../../theme";

export default function EmptyState({
    title = 'No plants yet',
    message = 'Add your first plant to start your collection',
    icon = 'leaf-outline',
    actionLabel,
    onAction,
    fullScreen = false,
    style,
}) {
    const hasAction = typeof onAction === 'function';

    return (
        <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
            <View style={styles.card}>
                <View style={styles.iconBackground}>
                    <Ionicons name={icon} size={34} color={colors.primaryGreen} />
                </View>
                <Text style={styles.title} accessibilityRole="header">{title}</Text>
                {message ? <Text style={styles.message}>{message}</Text> : null}

                {actionLabel ? (
                    <Pressable
                        style={({ pressed }) => [
                            styles.actionButton,
                            !hasAction && styles.disabled,
                            pressed && styles.pressed,
                        ]}
                        onPress={hasAction ? onAction : undefined}
                        disabled={!hasAction}
                        accessibilityRole="button"
                        actionLabel={actionLabel}
                        accessibilityState={{ disabled: !hasAction }}
                    >
                        <Text style={styles.actionText}>{actionLabel}</Text>
                        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                    </Pressable>
                ) : null}
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    fullScreen: {
        flex: 1,
        justifyContent: 'center',
        padding: 18,
        backgroundColor: colors.screenBackground,
    },
    card: {
        width: '100%',
        maxWidth: 560,
        paddingHorizontal: 23,
        paddingVertical: 28,
        alignItems: 'center',
        gap: 10,
        borderRadius: 23,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    iconBackground: {
        width: 72,
        height: 72,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E7EFDD',
        marginBottom: 5,
    },
    title: {
        fontSize: 20,
        lineHeight: 27,
        fontWeight: '700',
        letterSpacing: -0.3,
        color: colors.mainText,
        textAlign: 'center',
    },
    message: {
        maxWidth: 320,
        fontSize: 13,
        lineHeight: 20,
        color: colors.secondaryText,
        textAlign: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        minHeight: 48,
        paddingHorizontal: 17,
        paddingVertical: 13,
        borderRadius: 15,
        backgroundColor: colors.primaryGreen,
        gap: 8,
        marginTop: 8,
    },
    actionText: {
        flexShrink: 1,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
    pressed: {
        opacity: 0.75,
    },
});