import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useFocusEffect } from '@react-navigation/native';

import { deletePlant, getPlantById, updateWaterDate } from '../services/plantService';

import { getLastWatered } from '../utils/getLastWatered';
import { toCatalogPlant } from '../utils/toCatalogPlant';
import { confirmAction } from '../utils/confirmAction';
import useCurrentDate from '../hooks/useCurrentDate';

import CareTile from '../components/details/CareTile';
import LoadingIndicator from '../components/loading-indicator/LoadingIndicator';
import ErrorMessage from '../components/error-message/ErrorMessage';
import NotFound from '../components/not-found/NotFound';

import { colors } from '../theme';

const plantStatuses = {
    unknown: {
        label: 'Status unknown',
        icon: 'help-circle-outline',
        color: colors.secondaryText,
        backgroundColor: colors.lightGreenBackground,
    },
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

export default function DetailsScreen({
    navigation,
    route
}) {
    const insets = useSafeAreaInsets();
    const { plantId } = route.params;
    const { today, refreshToday } = useCurrentDate();

    const [plantData, setPlantData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [loadingError, setLoadingError] = useState('');
    const [updatingError, setUpdatingError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);
    const mutationPending = useRef(false);
    const confirmationPending = useRef(false);
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useFocusEffect(useCallback(() => {
        let active = true;

        const loadPlant = async () => {
            setLoading(true);
            setLoadingError('');

            try {
                const data = await getPlantById(plantId);

                if (active) {
                    setPlantData(data);
                }
            } catch (err) {
                if (active) {
                    setPlantData(null);
                    setLoadingError(
                        typeof err?.message === 'string' && err.message
                            ? err.message
                            : 'Could not load the plant. Please try again.',
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadPlant();

        return () => {
            active = false;
        };
    }, [plantId, reloadKey]));

    const plant = plantData
        ? toCatalogPlant(plantData, today)
        : null;
    const mutating = updating || deleting;

    const markWateredHandler = async () => {
        if (mutationPending.current || !plant || plant.lastWateredAt === getLastWatered(0)) {
            return;
        }

        mutationPending.current = true;
        setUpdating(true);
        setUpdatingError('');

        try {
            const updatedPlant = await updateWaterDate(plant.id);
            if (mounted.current) {
                refreshToday();
                setPlantData(updatedPlant);
            }
        } catch (err) {
            if (mounted.current) {
                setUpdatingError(
                    typeof err?.message === 'string' && err.message
                        ? err.message
                        : 'Could not update the watering info. Please try again.',
                );
            }
        } finally {
            mutationPending.current = false;
            if (mounted.current) {
                setUpdating(false);
            }
        }
    };

    const waterPressHandler = async () => {
        if (mutationPending.current || confirmationPending.current || !plant) {
            return;
        }

        const currentDay = getLastWatered(0);
        if (plant.lastWateredAt === currentDay) {
            return;
        }

        refreshToday();

        if (toCatalogPlant(plantData, currentDay).status === 'healthy') {
            confirmationPending.current = true;
            let confirmed;
            try {
                confirmed = await confirmAction({
                    title: 'Water earlier?',
                    message: 'This plant is not due for watering yet. Mark it as watered today?',
                    confirmText: 'Mark as watered',
                });
            } finally {
                confirmationPending.current = false;
            }
            if (!confirmed || !mounted.current) {
                return;
            }
        }

        await markWateredHandler();
    };

    const openRemindersHandler = () => {
        if (mutationPending.current || !plant) {
            return;
        }

        navigation.navigate('MainStack', {
            screen: 'Reminders',
            params: { targetPlantId: plant.id },
        });
    };

    const deletePlantHandler = async () => {
        if (mutationPending.current || !plant) {
            return;
        }

        mutationPending.current = true;
        setDeleting(true);
        setDeleteError('');

        try {
            await deletePlant(plant.id);
        } catch (err) {
            if (mounted.current) {
                setDeleteError(
                    typeof err?.message === 'string' && err.message
                        ? err.message
                        : 'Could not delete this plant. Please try again.',
                );
            }
            return;
        } finally {
            mutationPending.current = false;
            if (mounted.current) {
                setDeleting(false);
            }
        }

        if (mounted.current) {
            navigation.popTo('MainStack', {
                screen: 'Home'
            });
        }
    };

    const deletePressHandler = async () => {
        if (mutationPending.current || confirmationPending.current || !plant) {
            return;
        }

        confirmationPending.current = true;
        let confirmed;
        try {
            confirmed = await confirmAction({
                title: 'Delete plant',
                message: `Delete ${plant.name}? This cannot be undone.`,
                confirmText: 'Delete',
                destructive: true,
            });
        } finally {
            confirmationPending.current = false;
        }

        if (confirmed && mounted.current) {
            await deletePlantHandler();
        }
    };

    if (loading) {
        return <LoadingIndicator message="Loading plant..." fullScreen />;
    }
    
    if (loadingError) {
        return (
            <ErrorMessage
                message={loadingError}
                onRetry={() => setReloadKey((previous) => previous + 1)}
                fullScreen
            />
        );
    }
    if (!plant) return <NotFound />;

    const wateredToday = plant.lastWateredAt === today;
    const wateringDisabled = mutating || wateredToday;
    const status = plantStatuses[plant.status] ?? plantStatuses.unknown;
    const needsWater = plant.status === 'water';
    const wateringCycle = plant.wateringFrequencyDays === 1
        ? 'Every day'
        : `Every ${plant.wateringFrequencyDays} days`;

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <View style={styles.toolbar}>
                <Pressable
                    style={({ pressed }) => [styles.toolbarButton, mutating && styles.disabled, pressed && !mutating && styles.pressed]}
                    onPress={() => navigation.goBack()}
                    disabled={mutating}
                    accessibilityRole="button"
                    accessibilityLabel="Back to plants"
                    accessibilityState={{ disabled: mutating }}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.mainText} />
                </Pressable>
                <Text style={styles.toolbarTitle}>Plant details</Text>
                <Pressable
                    style={({ pressed }) => [styles.toolbarButton, mutating && styles.disabled, pressed && !mutating && styles.pressed]}
                    onPress={() => navigation.navigate('EditPlant', { plantId })}
                    disabled={mutating}
                    accessibilityRole="button"
                    accessibilityLabel="Edit plant"
                    accessibilityState={{ disabled: mutating }}
                >
                    <Ionicons name="create-outline" size={23} color={colors.primaryGreen} />
                </Pressable>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.content, { paddingBottom: 28 + insets.bottom }]}
                contentInsetAdjustmentBehavior="never"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.photoContainer}>
                    {plant.image ? (
                        <Image
                            source={plant.image}
                            style={styles.photo}
                            accessibilityLabel={`Photo of ${plant.name}`}
                        />
                    ) : (
                        <View style={styles.imagePlaceholder} accessible={false}>
                            <Ionicons name="leaf-outline" size={40} color={colors.primaryGreen} />
                        </View>
                    )}

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
                                    ? 'Your plant is due for watering.'
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
                        style={({ pressed }) => [
                            styles.waterButton,
                            wateringDisabled && styles.disabled,
                            pressed && !wateringDisabled && styles.pressed,
                        ]}
                        onPress={waterPressHandler}
                        disabled={wateringDisabled}
                        accessibilityRole="button"
                        accessibilityLabel={
                            updating
                                ? 'Updating water info...'
                                : wateredToday
                                    ? `${plant.name} was watered today`
                                    : `Mark ${plant.name} as watered`
                        }
                        accessibilityState={{ disabled: wateringDisabled, busy: updating }}
                    >
                        {updating ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Ionicons name="water-outline" size={20} color="#FFFFFF" />
                        )}
                        <Text style={styles.waterButtonText}>
                            {updating
                                ? 'Updating water info...'
                                : wateredToday
                                    ? 'Watered today ✓'
                                    : 'Mark as watered'}
                        </Text>
                    </Pressable>
                    {Boolean(updatingError) && (
                        <Text style={styles.error} accessibilityRole='alert'>
                            {updatingError}
                        </Text>
                    )}
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
                        {plant.notes?.trim() || 'No notes yet. Add a few words when you edit this plant.'}
                    </Text>
                </View>

                <Pressable
                    style={({ pressed }) => [styles.reminderCard, mutating && styles.disabled, pressed && !mutating && styles.pressed]}
                    onPress={openRemindersHandler}
                    disabled={mutating}
                    accessibilityRole="button"
                    accessibilityLabel={`Open watering reminders for ${plant.name}`}
                    accessibilityState={{ disabled: mutating }}
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
                    style={({ pressed }) => [styles.deleteButton, mutating && styles.disabled, pressed && !mutating && styles.pressed]}
                    onPress={deletePressHandler}
                    disabled={mutating}
                    accessibilityRole="button"
                    accessibilityLabel={
                        deleting
                            ? 'Deleting plant...'
                            : `Delete plant`
                    }
                    accessibilityState={{ disabled: mutating, busy: deleting }}
                >
                    {deleting ? (
                        <ActivityIndicator size="small" color="#A63D32" />
                    ) : (
                        <Ionicons name="trash-outline" size={18} color="#A63D32" />
                    )}
                    <Text style={styles.deleteButtonText}>
                        {deleting ? (
                            'Deleting plant'
                        ) : (
                            'Delete plant'
                        )}
                    </Text>
                </Pressable>
                {deleteError ? (
                    <Text style={styles.error} accessibilityRole="alert">
                        {deleteError}
                    </Text>
                ) : null}
            </ScrollView>
        </SafeAreaView >
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
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGreenBackground,
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
    error: {
        fontSize: 12,
        lineHeight: 18,
        color: '#A63D32',
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
    disabled: {
        opacity: 0.5,
    }
});
