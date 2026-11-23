import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { colors } from '../../theme';

export default function ReminderCard({
    reminder,
    wateredToday = false,
    updating = false,
    disabled = false,
    highlighted = false,
    error = undefined,
    onOpen,
    onMarkWatered,
}) {
    const isDue = reminder.group === 'today';
    const isOverdue = reminder.group === 'overdue';
    const isUnknown = reminder.group === 'unknown';
    const wateringDisabled = disabled || updating || wateredToday;

    const statusColor = wateredToday ? colors.primaryGreen
        : isOverdue ? colors.overdueText
            : isDue ? colors.waterText : colors.secondaryText;

    const statusBackground = wateredToday ? colors.lightGreenBackground
        : isOverdue ? colors.overdueBackground
            : isDue ? colors.waterBackground : '#F0F2EB';

    const wateringCycle = reminder.wateringFrequencyDays === 1
        ? 'Every day'
        : `Every ${reminder.wateringFrequencyDays} days`;

    return (
        <View
            testID={`reminder-card-${reminder.id}`}
            style={[
                styles.reminderCard,
                wateredToday && styles.completedCard,
                highlighted && styles.highlightedCard
            ]}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.plantRow,
                    pressed && styles.pressed,
                    pressed && !disabled && styles.pressed
                ]}
                onPress={onOpen}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={`Open ${reminder.name} in ${reminder.location}`}
                accessibilityHint={highlighted ? 'Selected from plant details.' : undefined}
                accessibilityState={{ disabled }}
            >
                {reminder.image ? (
                    <Image source={reminder.image} style={styles.plantImage} accessible={false} />
                ) : (
                    <View style={[styles.plantImage, styles.imagePlaceholder]} accessible={false}>
                        <Ionicons name="leaf-outline" size={29} color={colors.primaryGreen} />
                    </View>
                )}

                <View style={styles.plantInfo}>
                    <Text style={styles.plantName}>
                        {reminder.name}
                    </Text>

                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={13} color={colors.secondaryText} />
                        <Text style={styles.locationText}>
                            {reminder.location}
                        </Text>
                    </View>

                    <Text style={styles.lastWateredText}>
                        {reminder.wateringInfo}
                    </Text>

                    <Text style={styles.lastWateredText}>
                        {wateringCycle}
                    </Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
            </Pressable>

            <View style={styles.cardFooter}>
                <View
                    style={[
                        styles.dueBadge,
                        { backgroundColor: statusBackground },
                    ]}
                >
                    <Ionicons
                        name={
                            isUnknown
                                ? 'help-circle-outline'
                                : isDue || isOverdue
                                    ? 'water-outline'
                                    : 'calendar-outline'
                        }
                        size={15}
                        color={statusColor}
                    />

                    <Text
                        style={[
                            styles.dueText,
                            { color: statusColor },
                        ]}
                    >
                        {isUnknown
                            ? 'Date unknown'
                            : reminder.dueLabel
                        }
                    </Text>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.waterButton,
                        wateredToday && styles.wateredButton,
                        wateringDisabled && styles.disabled,
                        pressed && !wateringDisabled && styles.pressed,
                    ]}
                    onPress={onMarkWatered}
                    disabled={wateringDisabled}
                    accessibilityRole="button"
                    accessibilityLabel={updating ? `Updating watering for ${reminder.name}`
                        : wateredToday ? `${reminder.name} was watered today`
                            : `Mark ${reminder.name} as watered`}
                    accessibilityState={{ disabled: wateringDisabled, busy: updating }}
                >
                    {updating ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Ionicons name={wateredToday ? 'checkmark-circle-outline' : 'water-outline'} size={18}
                            color={wateredToday ? colors.primaryGreen : '#FFFFFF'} />
                    )}
                    <Text style={[styles.waterButtonText, wateredToday && styles.wateredButtonText]}>
                        {updating ? 'Updating...' : wateredToday ? 'Watered today' : 'Mark as watered'}
                    </Text>
                </Pressable>
            </View>
            {error ? <Text style={styles.error} accessibilityRole='alert'>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    reminderCard: {
        borderRadius: 21,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
        overflow: 'hidden',
    },
    completedCard: {
        borderColor: '#BFCFAF',
        backgroundColor: '#F6F9F1',
    },
    plantRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 12,
    },
    plantImage: {
        width: 66,
        height: 78,
        borderRadius: 15,
        backgroundColor: '#EDF1E6',
        resizeMode: 'cover',
    },
    plantInfo: {
        flex: 1,
        minWidth: 0,
        gap: 5,
    },
    plantName: {
        fontSize: 17,
        lineHeight: 23,
        fontWeight: '700',
        color: colors.mainText,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
    },
    lastWateredText: {
        fontSize: 11,
        lineHeight: 17,
        color: colors.secondaryText,
    },
    cardFooter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    dueBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '100%',
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 13,
        gap: 5,
    },
    dueText: {
        flexShrink: 1,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '600',
    },
    waterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        minHeight: 44,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 13,
        backgroundColor: colors.primaryGreen,
        gap: 6,
    },
    waterButtonText: {
        flexShrink: 1,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    wateredButton: {
        backgroundColor: '#E7EFDD',
    },
    wateredButtonText: {
        color: colors.primaryGreen,
    },
    highlightedCard: {
        borderWidth: 2,
        borderColor: colors.primaryGreen,
        backgroundColor: '#EFF6E8',
    },
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
    error: {
        paddingHorizontal: 14,
        paddingBottom: 14,
        fontSize: 12,
        lineHeight: 18,
        color: '#A63D32',
    },
    pressed: {
        opacity: 0.7,
    },
});