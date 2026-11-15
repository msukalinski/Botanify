import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { colors } from '../../theme';

export default function ReminderCard({
    reminder,
    completed = false,
    onOpen,
    onToggleWatered,
}) {
    const isToday = reminder.group === 'today';

    const statusColor = completed
        ? colors.primaryGreen
        : isToday
            ? colors.waterText
            : colors.secondaryText;

    const statusBackground = completed
        ? '#E7EFDD'
        : isToday
            ? colors.waterBackground
            : '#F0F2EB';

    const wateringCycle = reminder.wateringFrequencyDays === 1
        ? 'Every day'
        : `Every ${reminder.wateringFrequencyDays} days`;

    return (
        <View
            style={[
                styles.reminderCard,
                completed && styles.completedCard,
            ]}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.plantRow,
                    pressed && styles.pressed,
                ]}
                onPress={onOpen}
                accessibilityRole="button"
                accessibilityLabel={`Open ${reminder.name} in ${reminder.location}`}
            >
                <Image
                    source={reminder.image}
                    style={styles.plantImage}
                    accessible={false}
                />

                <View style={styles.plantInfo}>
                    <Text style={styles.plantName}>
                        {reminder.name}
                    </Text>

                    <View style={styles.locationRow}>
                        <Ionicons
                            name="location-outline"
                            size={13}
                            color={colors.secondaryText}
                        />
                        <Text style={styles.locationText}>
                            {reminder.location}
                        </Text>
                    </View>

                    <Text style={styles.lastWateredText}>
                        {completed
                            ? 'Last watered just now'
                            : reminder.lastWateredLabel}
                    </Text>
                </View>

                <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.secondaryText}
                />
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
                            completed
                                ? 'checkmark-circle-outline'
                                : isToday
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
                        {completed
                            ? 'Watered today'
                            : reminder.dueLabel}
                    </Text>
                </View>

                {isToday ? (
                    <Pressable
                        style={({ pressed }) => [
                            styles.waterButton,
                            completed && styles.undoButton,
                            pressed && styles.pressed,
                        ]}
                        onPress={onToggleWatered}
                        accessibilityRole="button"
                        accessibilityLabel={
                            `${completed
                                ? 'Undo watering for '
                                : 'Mark as watered: '}${reminder.name} in ${reminder.location}`
                        }
                    >
                        <Ionicons
                            name={completed ? 'arrow-undo-outline' : 'checkmark'}
                            size={18}
                            color={
                                completed
                                    ? colors.primaryGreen
                                    : '#FFFFFF'
                            }
                        />

                        <Text
                            style={[
                                styles.waterButtonText,
                                completed && styles.undoButtonText,
                            ]}
                        >
                            {completed ? 'Undo' : 'Mark as watered'}
                        </Text>
                    </Pressable>
                ) : (
                    <Text style={styles.cycleText}>
                        {wateringCycle}
                    </Text>
                )}
            </View>
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
    undoButton: {
        backgroundColor: '#E7EFDD',
    },
    undoButtonText: {
        color: colors.primaryGreen,
    },
    cycleText: {
        flexShrink: 1,
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
    },
    pressed: {
        opacity: 0.7,
    },
});