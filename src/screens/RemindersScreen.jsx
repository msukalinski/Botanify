import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import SectionHeading from '../components/reminders/SectionHeading';
import ReminderCard from '../components/reminders/ReminderCard';
import EmptyState from '../components/reminders/ReminderEmptyState';
import LoadingIndicator from '../components/loading-indicator/LoadingIndicator';
import ErrorMessage from '../components/error-message/ErrorMessage';
import useCurrentDate from '../hooks/useCurrentDate';
import { getPlants, updateWaterDate } from '../services/plantService';
import { schedulePlantReminder } from '../services/notificationService';
import { toCatalogPlant } from '../utils/toCatalogPlant';
import { getLastWatered } from '../utils/getLastWatered';
import { confirmAction } from '../utils/confirmAction';

import { colors } from '../theme';

const sectionOptions = [
    { key: 'overdue', title: 'Overdue', subtitle: 'These plants are past their scheduled watering day.' },
    { key: 'today', title: 'Today', subtitle: 'A few small moments of care.' },
    { key: 'upcoming', title: 'Upcoming', subtitle: 'A little look at the days ahead.' },
    { key: 'unknown', title: 'Start tracking', subtitle: 'The last watering date is unknown for these plants.' },
];

export default function RemindersScreen({
    navigation,
    route
}) {
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const { today, refreshToday } = useCurrentDate();
    const targetPlantId = route?.params?.targetPlantId;
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [wateringErrors, setWateringErrors] = useState({});
    const [highlightedId, setHighlightedId] = useState(null);

    const mounted = useRef(false);
    const focused = useRef(false);
    const plantsRef = useRef([]);
    const requestId = useRef(0);
    const writeRevision = useRef(0);
    const mutationPending = useRef(false);
    const confirmationPending = useRef(false);
    const scrollRef = useRef(null);
    const contentRef = useRef(null);
    const rowRefs = useRef(new Map());
    const pendingTargetScroll = useRef(null);
    const highlightTimer = useRef(null);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
            clearTimeout(highlightTimer.current);
        }
    }, []);

    const loadPlants = useCallback(async () => {
        if (!focused.current) {
            return;
        }

        const currentRequest = ++requestId.current;
        const isCurrent = () => mounted.current && focused.current && requestId.current === currentRequest;
        setLoading(true);
        setLoadError('');

        try {
            let data;
            let revision;

            do {
                revision = writeRevision.current;
                data = await getPlants();
            } while (isCurrent() && revision !== writeRevision.current);

            if (isCurrent()) {
                plantsRef.current = data;
                setPlants(data);
            }
        } catch (err) {
            if (isCurrent()) {
                setLoadError(
                    typeof err?.message === 'string' && err.message
                        ? err.message
                        : 'Could not load your reminders. Please try again.',
                );
            }
        } finally {
            if (isCurrent()) {
                setLoading(false);
            }
        }
    }, []);

    useFocusEffect(useCallback(() => {
        focused.current = true;
        loadPlants();
        return () => {
            focused.current = false;
            requestId.current += 1;
        };
    }, [loadPlants]));

    const reminders = useMemo(() => plants.map((plant) => {
        const mapped = toCatalogPlant(plant, today);
        const daysUntil = mapped.daysUntilWatering;
        return {
            ...mapped,
            group: daysUntil === null ? 'unknown'
                : daysUntil < 0 ? 'overdue'
                    : daysUntil === 0 ? 'today' : 'upcoming',
            dueLabel: mapped.nextWateringLabel,
        };
    }).sort((a, b) => {
        if (a.daysUntilWatering === b.daysUntilWatering) {
            return a.name.localeCompare(b.name);
        }
        if (a.daysUntilWatering === null) {
            return 1;
        }
        if (b.daysUntilWatering === null) {
            return -1;
        }
        return a.daysUntilWatering - b.daysUntilWatering;
    }), [plants, today]);

    const sections = useMemo(() => sectionOptions.map((option) => ({
        ...option,
        data: reminders.filter((reminder) => reminder.group === option.key),
    })), [reminders]);
    const dueCount = reminders.filter((reminder) => reminder.status === 'water').length;
    const wateredCount = reminders.filter((reminder) => reminder.lastWateredAt === today).length;
    const upcomingCount = reminders.filter((reminder) => reminder.group === 'upcoming').length;
    const unknownCount = reminders.filter((reminder) => reminder.group === 'unknown').length;
    const targetMissing = Boolean(targetPlantId) && !reminders.some((reminder) => reminder.id === targetPlantId);

    useEffect(() => {
        if (!isFocused || loading || loadError || !targetPlantId || targetMissing) {
            return;
        }
        let cancelled = false;
        let frame = null;
        let retryTimer = null;
        let retries = 0;

        const attemptScroll = () => {
            if (cancelled || !focused.current) {
                return;
            }

            if (frame !== null) {
                cancelAnimationFrame(frame);
            }

            frame = requestAnimationFrame(() => {
                frame = null;
                const row = rowRefs.current.get(targetPlantId);
                const content = contentRef.current;

                if (cancelled || !focused.current || !row || !content) {
                    return;
                }

                row.measureLayout(content, (_x, y) => {
                    if (cancelled || !focused.current || !Number.isFinite(y)) {
                        return;
                    }
                    cancelled = true;
                    scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
                    setHighlightedId(targetPlantId);
                    clearTimeout(highlightTimer.current);
                    highlightTimer.current = setTimeout(() => setHighlightedId(null), 4000);
                    navigation.setParams({ targetPlantId: undefined });
                }, () => {
                    if (!cancelled && retries++ < 3) retryTimer = setTimeout(attemptScroll, 80);
                });
            });
        };

        pendingTargetScroll.current = attemptScroll;
        attemptScroll();
        return () => {
            cancelled = true;
            if (frame !== null) {
                cancelAnimationFrame(frame);
            }
            clearTimeout(retryTimer);
            if (pendingTargetScroll.current === attemptScroll) {
                pendingTargetScroll.current = null;
            }
        };
    }, [isFocused, loading, loadError, targetPlantId, targetMissing, reminders, navigation]);

    const queueTargetScroll = useCallback(() => pendingTargetScroll.current?.(), []);

    const markWateredHandler = async (plantId) => {
        if (!mounted.current || !focused.current || mutationPending.current || confirmationPending.current) {
            return;
        }

        const plant = plantsRef.current.find((value) => value.id === plantId);
        const currentDay = getLastWatered(0);

        if (!plant || plant.lastWateredAt === currentDay) {
            return;
        }
        refreshToday();

        if (toCatalogPlant(plant, currentDay).status === 'healthy') {
            confirmationPending.current = true;
            let confirmed;
            try {
                confirmed = await confirmAction({
                    title: 'Water earlier?',
                    message: `${plant.name} is not due for watering yet. Mark it as watered today?`,
                    confirmText: 'Mark as watered',
                });
            } finally {
                confirmationPending.current = false;
            }
            if (!confirmed || !mounted.current || !focused.current) {
                return;
            }
        }

        mutationPending.current = true;
        setUpdatingId(plantId);
        setWateringErrors((previous) => ({ ...previous, [plantId]: undefined }));

        try {
            const updatedPlant = await updateWaterDate(plantId);

            if (mounted.current) {
                writeRevision.current += 1;
                const nextPlants = plantsRef.current.map((value) => value.id === plantId ? updatedPlant : value);
                plantsRef.current = nextPlants;
                setPlants(nextPlants);
                refreshToday();
            }

            const warning = await schedulePlantReminder(updatedPlant);

            if (warning && mounted.current) {
                Alert.alert('Watering saved', warning);
            }
        } catch (err) {
            if (mounted.current) {
                setWateringErrors((previous) => ({
                    ...previous,
                    [plantId]: typeof err?.message === 'string' && err.message
                        ? err.message
                        : 'Could not update watering. Please try again.',
                }));
            }
        } finally {
            mutationPending.current = false;
            if (mounted.current) {
                setUpdatingId(null);
            }
        }
    };

    if (loading) {
        return <LoadingIndicator message="Loading reminders..." fullScreen style={styles.screen} />;
    }
    if (loadError) {
        return <ErrorMessage
            message={loadError}
            onRetry={loadPlants}
            fullScreen
            style={styles.screen}
        />;
    }

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <ScrollView
                ref={scrollRef}
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                contentInsetAdjustmentBehavior="never"
                showsVerticalScrollIndicator={false}
                onContentSizeChange={queueTargetScroll}
            >
                <View
                    ref={contentRef}
                    collapsable={false}
                    onLayout={queueTargetScroll}
                    style={[styles.content, { paddingBottom: 28 + insets.bottom }]}
                >
                    <View style={styles.header}>
                        <View style={styles.headerText}>
                            <Text style={styles.appLabel}>Botanify</Text>
                            <Text style={styles.title} accessibilityRole="header">Reminders</Text>
                            <Text style={styles.subtitle}>A little care, right on time.</Text>
                        </View>
                        <Pressable
                            style={({ pressed }) => [styles.headerIcon, updatingId && styles.disabled, pressed && styles.pressed]}
                            onPress={loadPlants}
                            disabled={Boolean(updatingId)}
                            accessibilityRole="button"
                            accessibilityLabel="Refresh reminders"
                            accessibilityState={{ disabled: Boolean(updatingId) }}
                        >
                            <Ionicons name="refresh-outline" size={26} color={colors.primaryGreen} />
                        </Pressable>
                    </View>

                    {targetMissing ? (
                        <View style={styles.targetNotice}>
                            <Text style={styles.targetNoticeText} accessibilityRole="alert">
                                The selected plant is no longer in your collection.
                            </Text>
                            <Pressable onPress={() => navigation.setParams({ targetPlantId: undefined })}
                                accessibilityRole="button" accessibilityLabel="Dismiss selected plant message">
                                <Ionicons name="close" size={22} color={colors.secondaryText} />
                            </Pressable>
                        </View>
                    ) : null}

                    {reminders.length === 0 ? (
                        <EmptyState
                            icon="calendar-outline"
                            title="Your care routine starts here"
                            description="Add a plant and its watering schedule will appear here."
                            actionLabel="Add your first plant"
                            onAction={() => navigation.navigate('AddPlant')}
                        />
                    ) : (
                        <>
                            <View style={styles.summaryCard}>
                                <View style={styles.summaryTop}>
                                    <View style={styles.summaryIcon} accessible={false}>
                                        <Ionicons name={dueCount > 0 ? 'water-outline' : unknownCount > 0 ? 'help-circle-outline' : 'checkmark'}
                                            size={25} color={colors.primaryGreen} />
                                    </View>
                                    <View style={styles.summaryText}>
                                        <Text style={styles.summaryTitle} accessibilityRole="header">{"Today's care"}</Text>
                                        <Text style={styles.summarySubtitle} accessibilityLiveRegion="polite">
                                            {dueCount > 0
                                                ? `${dueCount} ${dueCount === 1 ? 'plant is' : 'plants are'} due or overdue.`
                                                : unknownCount > 0
                                                    ? 'Add a watering date to start tracking your plants.'
                                                    : 'Nothing due today. Enjoy your green space.'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.summaryStats}>
                                    {[
                                        { label: 'Due now', value: dueCount },
                                        { label: 'Watered today', value: wateredCount },
                                        { label: 'Upcoming', value: upcomingCount },
                                    ].map((stat) => (
                                        <View key={stat.label} style={styles.summaryStat}>
                                            <Text style={styles.statValue} accessibilityLiveRegion="polite">{stat.value}</Text>
                                            <Text style={styles.statLabel}>{stat.label}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {sections.filter((section) => section.data.length > 0).map((section) => (
                                <View key={section.key} style={styles.section}>
                                    <SectionHeading title={section.title} count={section.data.length} subtitle={section.subtitle} />
                                    {section.data.map((reminder) => (
                                        <View key={reminder.id} collapsable={false} onLayout={queueTargetScroll}
                                            ref={(node) => {
                                                if (node) rowRefs.current.set(reminder.id, node);
                                                else rowRefs.current.delete(reminder.id);
                                            }}>
                                            <ReminderCard
                                                reminder={reminder}
                                                wateredToday={reminder.lastWateredAt === today}
                                                updating={updatingId === reminder.id}
                                                disabled={Boolean(updatingId)}
                                                highlighted={highlightedId === reminder.id}
                                                error={wateringErrors[reminder.id]}
                                                onOpen={() => navigation.navigate('PlantDetails', { plantId: reminder.id })}
                                                onMarkWatered={() => markWateredHandler(reminder.id)}
                                            />
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </>
                    )}

                    <View style={styles.footer} accessible={false}>
                        <Ionicons name="leaf-outline" size={15} color={colors.secondaryText} />
                        <Text style={styles.footerText}>Small routines. Happier plants.</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    scroll: {
        flex: 1,
    },
    content: {
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
        paddingHorizontal: 18,
        paddingTop: 22,
        paddingBottom: 28,
        gap: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    headerText: {
        flex: 1,
    },
    appLabel: {
        fontSize: 11,
        lineHeight: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: colors.primaryGreen,
        marginBottom: 4,
    },
    title: {
        fontSize: 31,
        lineHeight: 39,
        fontWeight: '800',
        letterSpacing: -1,
        color: colors.mainText,
    },
    subtitle: {
        fontSize: 13,
        lineHeight: 20,
        color: colors.secondaryText,
        marginTop: 5,
    },
    headerIcon: {
        width: 50,
        height: 50,
        borderRadius: 18,
        backgroundColor: '#E3EBD6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryCard: {
        padding: 18,
        borderRadius: 23,
        backgroundColor: '#EAF0E2',
        gap: 15,
    },
    summaryTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    summaryIcon: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: '#DCE8CE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryText: {
        flex: 1,
        gap: 5
    },
    summaryTitle: {
        fontSize: 19,
        lineHeight: 26,
        fontWeight: '700',
        color: colors.mainText,
    },
    summarySubtitle: {
        fontSize: 13,
        lineHeight: 20,
        color: colors.secondaryText,
    },
    scrollContent: {
        flexGrow: 1,
    },
    summaryStats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    summaryStat: {
        flex: 1,
        minWidth: 70,
        gap: 4,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: '#F5F8EF',
    },
    statValue: {
        fontSize: 23,
        lineHeight: 30,
        fontWeight: '800',
        color: colors.primaryGreen,
    },
    statLabel: {
        fontSize: 11,
        lineHeight: 17,
        textAlign: 'center',
        color: colors.secondaryText,
    },
    targetNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 14,
        backgroundColor: colors.overdueBackground,
    },
    targetNoticeText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 20,
        color: colors.overdueText,
    },
    disabled: { opacity: 0.45 },
    pressed: { opacity: 0.7 },
    section: {
        gap: 12,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    footerText: {
        flexShrink: 1,
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
        textAlign: 'center',
    },
});