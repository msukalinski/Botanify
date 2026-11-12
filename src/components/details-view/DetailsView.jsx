import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";

import { colors } from "../../theme";

const samplePlant = {
    id: 'monstera',
    name: 'Monstera',
    species: 'Monstera deliciosa',
    location: 'Living room',
    image: require('../../../assets/plants/monstera.jpg'),
    status: 'water',
    lastWateredLabel: '5 days ago',
    nextWateringLabel: 'Today',
    wateringFrequencyDays: 5,
    lightPreference: 'Bright indirect light',
    notes: 'A gift from a friend. This plant sits beside the living-room window and is the first member of my green collection.',
};

const plantStatuses = {
    water: {
        label: 'Needs water',
        icon: 'water',
        color: colors.waterText,
        backgroundColor: colors.waterBackground,
    },
    healthy: {
        label: 'Doing great',
        icon: 'leaf',
        color: colors.healthyText,
        backgroundColor: colors.healthyBackground,
    },
    light: {
        label: 'Indirect light',
        icon: 'sunny',
        color: colors.lightText,
        backgroundColor: colors.lightBackground,
    },
};

export default function DetailsView({
    navigation,
    route,
    plant = samplePlant,
    onMarkWatered,
    onOpenReminders,
    onDeleteRequest,
}) {
    const insets = useSafeAreaInsets();
    const status = plantStatuses[plant.status];
    const needsWater = plant.status === 'water';
    const wateringCycle = plant.wateringFrequencyDays === 1
        ? 'Every day'
        : `Every ${plant.wateringFrequencyDays} days`;
    const { plantId } = route.params;

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <View style={styles.toolbar}>
                <Pressable
                    style={({ pressed }) => [styles.toolbarButton, pressed && styles.pressed]}
                    onPress={() => navigation.goBack()}
                    accessibilityRole="button"
                    accessibilityLabel="Back to plants"
                >
                    <Ionicons name="arrow-back" size={24} color={colors.mainText} />
                </Pressable>
                <Text style={styles.toolbarTitle}>Plant details</Text>
                <Pressable
                    style={({ pressed }) => [styles.toolbarButton, pressed && styles.pressed]}
                    onPress={() => navigation.navigate('EditPlant')}
                    accessibilityRole="button"
                    accessibilityLabel="Edit plant"
                >
                    <Ionicons name="create-outline" size={23} color={colors.primaryGreen} />
                </Pressable>
            </View>

            <ScrollView
                style={styles.ScrollView}
                contentContainerStyle={[styles.content, { paddingBottom: 28 + insets.bottom }]}
                contentInsetAdjustmentBehavior="never"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.photoContainer}>
                    <Image
                        source={plant.image}
                        style={styles.photo}
                        accessibilityLabel={`Photo of ${plant.name}`}
                    />
                    <View style={[styles.statusBadge, { backgroundColor: status.backgroundColor }]}>
                        <Ionicons name={status.icon} size={15} color={status.color} />
                        <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                    </View>
                </View>

                <View style={styles.plantHeading}>
                    <Text style={styles.plantName} accessibilityRole="header">{plant.name}</Text>
                    <Text style={styles.species}>{plant.species}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="locate-outline" size={15} color={colors.secondaryText} />
                        <Text style={styles.locationText}>{plant.location}</Text>
                    </View>
                </View>

                <View style={styles.wateringCard}>
                    <View style={styles.wateringHeader}>
                        <View style={styles.waterIcon} accessible={false}>
                            <Ionicons name="water" size={24} color="#168C96" />
                        </View>
                        <View style={styles.wateringHeaderText}>
                            <Text style={styles.wateringTitle}>
                                {needsWater ? 'Time for a drink' : 'Watering schedule'}
                            </Text>
                            <Text style={styles.wateringSubtitle}>
                                {needsWater
                                    ? 'Your watering reminder is due today.'
                                    : 'Keep track of your watering routine.'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.wateringDates}>
                        <View style={styles.dateColumn}>
                            <Text style={styles.dateLabel}>Last watered</Text>
                            <Text style={styles.dateValue}>{plant.lastWateredLabel}</Text>
                        </View>
                        <View style={styles.dateDivider} />
                        <View style={styles.dateColumn}>
                            <Text style={styles.dateLabel}>Next watering</Text>
                            <Text style={[styles.dateValue, needsWater && styles.dateDue]}>
                                {plant.nextWateringLabel}
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        style={({ pressed }) => [styles.waterButton, pressed && styles.pressed]}
                        onPress={() => onMarkWatered?.(plant.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Mark ${plant.name} as watered`}
                    >
                        <Ionicons name="water-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.waterButtonText}>Mark as watered</Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle} accessibilityRole="header">Your care plan</Text>
                    <View style={styles.careTiles}>
                        <CareTile
                            icon="sunny-outline"
                            iconColor="#B78014"
                            iconBackground="#FFF0C7"
                            label="Light preference"
                            value={plant.lightPreference}
                        />
                        <CareTile
                            icon="calendar-outline"
                            iconColor={colors.primaryGreen}
                            iconBackground={colors.lightGreenBackground}
                            label="Watering cycle"
                            value={wateringCycle}
                        />
                    </View>
                </View>

                <View style={styles.notesCard}>
                    <View style={styles.notesHeader}>
                        <Ionicons name="document-text-outline" size={19} color={colors.primaryGreen} />
                        <Text style={styles.notesTitle} accessibilityRole="header">My notes</Text>
                    </View>
                    <Text style={styles.notesText}>
                        {plant.notes.trim() ? plant.notes : 'No notes yet. Add a few words when you edit this plant.'}
                    </Text>
                </View>

                <Pressable
                    style={({ pressed }) => [styles.reminderCard, pressed && styles.pressed]}
                    onPress={() => onOpenReminders?.(plant.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Open watering reminders for ${plant.name}`}
                >
                    <View style={styles.reminderIcon} accessible={false}>
                        <Ionicons name="notifications-outline" size={23} color={colors.primaryGreen} />
                    </View>
                    <View style={styles.reminderText}>
                        <Text style={styles.reminderTitle} accessibilityRole="header">Watering reminders</Text>
                        <Text style={styles.reminderSubtitle} accessibilityRole="header">View your watering schedule</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
                </Pressable>

                <Pressable
                    style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
                    onPress={() => onDeleteRequest?.(plant.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${plant.name}`}
                >
                    <Ionicons name="trash-outline" size={18} color="#A63D32" />
                    <Text style={styles.deleteButtonText}>Delete plant</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

function CareTile({
    icon,
    iconColor,
    iconBackground,
    label,
    value,
}) {
    return (
        <View style={styles.careTile}>
            <View style={[styles.careTileIcon, { backgroundColor: iconBackground }]} accessible={false}>
                <Ionicons name={icon} size={22} color={iconColor} />
            </View>
            <Text style={styles.careTileLabel}>{label}</Text>
            <Text style={styles.careTileValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    toolbar: {
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingTop: 6,
        paddingBottom: 10,
        gap: 10,
    },
    toolbarButton: {
        width: 44,
        height: 44,
        borderRadius: 15,
        backgroundColor: colors.cardBackground,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolbarTitle: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '600',
        color: colors.mainText,
        textAlign: 'center',
    },
    scroll: {
        flex: 1,
    },
    content: {
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
        paddingHorizontal: 18,
        paddingTop: 4,
        gap: 22,
    },
    photoContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 1.15,
        borderRadius: 26,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        backgroundColor: '#EDF1E6',
    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    statusBadge: {
        position: 'absolute',
        left: 14,
        bottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        maxWidth: '90%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 22,
    },
    statusText: {
        flexShrink: 1,
        fontSize: 12,
        lineHeight: 17,
        fontWeight: '600',
    },
    plantHeading: {
        gap: 5,
    },
    plantName: {
        fontSize: 31,
        lineHeight: 39,
        fontWeight: '800',
        letterSpacing: -0.8,
        color: colors.mainText,
    },
    species: {
        fontSize: 14,
        lineHeight: 21,
        fontStyle: 'italic',
        color: colors.secondaryText,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 3,
    },
    locationText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 19,
        color: colors.secondaryText,
    },
    wateringCard: {
        padding: 16,
        borderRadius: 23,
        backgroundColor: '#EAF0E2',
        gap: 18,
    },
    wateringHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 11,
    },
    waterIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D8EEEB',
    },
    wateringHeaderText: {
        flex: 1,
        gap: 4,
    },
    wateringTitle: {
        fontSize: 20,
        lineHeight: 26,
        fontWeight: '700',
        letterSpacing: -0.3,
        color: colors.mainText,
    },
    wateringSubtitle: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
    },
    wateringDates: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 14,
        paddingVertical: 2,
    },
    dateColumn: {
        flex: 1,
        gap: 5,
    },
    dateDivider: {
        width: 1,
        backgroundColor: '#D4DFCC',
    },
    dateLabel: {
        fontSize: 12,
        lineHeight: 17,
        color: colors.secondaryText,
    },
    dateValue: {
        fontSize: 15,
        lineHeight: 21,
        fontWeight: '700',
        color: colors.mainText,
    },
    dateDue: {
        color: colors.waterText,
    },
    waterButton: {
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        paddingHorizontal: 14,
        paddingVertical: 13,
        borderRadius: 15,
        backgroundColor: colors.primaryGreen,
    },
    waterButtonText: {
        flexShrink: 1,
        fontSize: 15,
        lineHeight: 21,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    section: {
        gap: 13,
    },
    sectionTitle: {
        fontSize: 20,
        lineHeight: 27,
        fontWeight: '700',
        letterSpacing: -0.4,
        color: colors.mainText,
    },
    careTiles: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 12,
    },
    careTile: {
        flex: 1,
        minWidth: 0,
        minHeight: 145,
        padding: 14,
        gap: 9,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    careTileIcon: {
        width: 37,
        height: 37,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    careTileLabel: {
        fontSize: 12,
        lineHeight: 17,
        color: colors.secondaryText,
    },
    careTileValue: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        color: colors.mainText,
    },
    notesCard: {
        padding: 16,
        borderRadius: 21,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
        gap: 11,
    },
    notesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    notesTitle: {
        flex: 1,
        fontSize: 17,
        lineHeight: 23,
        fontWeight: '700',
        color: colors.mainText,
    },
    notesText: {
        fontSize: 14,
        lineHeight: 22,
        color: colors.secondaryText,
    },
    reminderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 11,
        padding: 14,
        minHeight: 80,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    reminderIcon: {
        width: 42,
        height: 42,
        borderRadius: 15,
        backgroundColor: colors.lightGreenBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reminderText: {
        flex: 1,
        gap: 4,
    },
    reminderTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        color: colors.mainText,
    },
    reminderSubtitle: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
    },
    deleteButton: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#F0D1CC',
        backgroundColor: '#FFF3F0',
    },
    deleteButtonText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        color: '#A63D32',
    },
    pressed: {
        opacity: 0.7,
    },
});