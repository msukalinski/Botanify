import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { colors } from '../../theme';

export default function ReminderEmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction,
}) {
    return (
        <View style={styles.emptyState}>
            <View style={styles.emptyIcon} accessible={false}>
                <Ionicons
                    name={icon}
                    size={29}
                    color={colors.primaryGreen}
                />
            </View>

            <Text
                style={styles.emptyTitle}
                accessibilityRole="header"
            >
                {title}
            </Text>

            <Text style={styles.emptyText}>{description}</Text>

            {actionLabel && (
                <Pressable
                    style={({ pressed }) => [
                        styles.emptyButton,
                        pressed && styles.pressed,
                    ]}
                    onPress={onAction}
                    accessibilityRole="button"
                >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                    <Text style={styles.emptyButtonText}>
                        {actionLabel}
                    </Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    emptyState: {
        paddingHorizontal: 22,
        paddingVertical: 26,
        alignItems: 'center',
        gap: 10,
        borderRadius: 21,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    emptyIcon: {
        width: 58,
        height: 58,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E7EFDD',
        marginBottom: 2
    },
    emptyTitle: {
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '700',
        color: colors.mainText,
        textAlign: 'center',
    },
    emptyText: {
        maxWidth: 320,
        fontSize: 13,
        lineHeight: 20,
        color: colors.secondaryText,
        textAlign: 'center',
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        minHeight: 48,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: colors.primaryGreen,
        gap: 7,
        marginTop: 7,
    },
    emptyButtonText: {
        flexShrink: 1,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.7,
    },
});