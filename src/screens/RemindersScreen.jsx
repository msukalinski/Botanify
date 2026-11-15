import { useState } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SectionHeading from '../components/reminders/SectionHeading';
import ReminderCard from '../components/reminders/ReminderCard';
import EmptyState from '../components/reminders/ReminderEmptyState';

import { colors } from '../theme';

const sampleReminders = [
    {
        id: 'water-monstera',
        plantId: 'monstera',
        name: 'Monstera',
        location: 'Living room',
        image: require('../../assets/plants/monstera.jpg'),
        group: 'today',
        dueLabel: 'Today',
        lastWateredLabel: 'Last watered 5 days ago',
        wateringFrequencyDays: 5,
    },
    {
        id: 'water-office-snake-plant',
        plantId: 'office-snake-plant',
        name: 'Snake Plant',
        location: 'Office',
        image: require('../../assets/plants/snake-plant.jpg'),
        group: 'today',
        dueLabel: 'Today',
        lastWateredLabel: 'Last watered 10 days ago',
        wateringFrequencyDays: 10,
    },
    {
        id: 'water-pothos',
        plantId: 'pothos',
        name: 'Pothos',
        location: 'Bookshelf',
        image: require('../../assets/plants/pothos.jpg'),
        group: 'upcoming',
        dueLabel: 'Tomorrow',
        lastWateredLabel: 'Last watered 2 days ago',
        wateringFrequencyDays: 3,
    },
    {
        id: 'water-bedroom-monstera',
        plantId: 'bedroom-monstera',
        name: 'Monstera',
        location: 'Bedroom',
        image: require('../../assets/plants/monstera.jpg'),
        group: 'upcoming',
        dueLabel: 'In 3 days',
        lastWateredLabel: 'Last watered today',
        wateringFrequencyDays: 3,
    },
    {
        id: 'water-snake-plant',
        plantId: 'snake-plant',
        name: 'Snake Plant',
        location: 'Bedroom',
        image: require('../../assets/plants/snake-plant.jpg'),
        group: 'upcoming',
        dueLabel: 'In 5 days',
        lastWateredLabel: 'Last watered 9 days ago',
        wateringFrequencyDays: 14,
    },
];

export default function RemindersScreen({
    navigation,
    reminders = sampleReminders,
}) {
    const [wateredIds, setWateredIds] = useState([]);

    const todayReminders = reminders.filter((reminder) => reminder.group === 'today');
    const upcomingReminders = reminders.filter((reminder) => reminder.group === 'upcoming');
    const wateredCount = todayReminders.filter((reminder) => wateredIds.includes(reminder.id)).length;
    const remainingCount = todayReminders.length - wateredCount;
    const progress = todayReminders.length > 0 ? wateredCount / todayReminders.length : 0;

    const toggleWateredHandler = (reminderId) => {
        setWateredIds((previous) => (
            previous.includes(reminderId)
                ? previous.filter((id) => id !== reminderId)
                : [...previous, reminderId]
        ));
    };

    return (
        <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                contentInsetAdjustmentBehavior="never"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.appLabel}>Botanify</Text>
                        <Text style={styles.title} accessibilityRole="header">Reminders</Text>
                        <Text style={styles.subtitle}>A little care, right on time.</Text>
                    </View>
                    <View style={styles.headerIcon}>
                        <Ionicons name="notifications-outline" size={27} color={colors.primaryGreen} />
                    </View>
                </View>

                {reminders.length === 0 ? (
                    <EmptyState
                        icon="calendar-outline"
                        title="Your care routine starts here"
                        description="Add a plant and set up its watering routine to see your reminders here."
                        actionLabel="Add your first plant"
                        onAction={() => navigation.navigate('AddPlant')}
                    />
                ) : (
                    <>
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryTop}>
                                <View style={styles.summaryIcon} accessible={false}>
                                    <Ionicons
                                        name={remainingCount > 0 ? 'water-outline' : 'checkmark'}
                                        size={25}
                                        color={colors.primaryGreen}
                                    />
                                </View>
                                <View style={styles.summaryText}>
                                    <Text style={styles.summaryTitle} accessibilityRole="header">Today's care</Text>
                                    <Text style={styles.summarySubtitle} accessibilityLiveRegion="polite">
                                        {remainingCount > 0
                                            ? remainingCount + (remainingCount === 1 ? ' plant is ready for a drink.' : ' plants are ready for a drink.')
                                            : todayReminders.length > 0
                                                ? 'All watered. Your plants say thanks!'
                                                : 'Nothing due today. Enjoy your green space.'}
                                    </Text>
                                </View>
                            </View>

                            {todayReminders.length > 0 && (
                                <>
                                    <View
                                        style={styles.progressTrack}
                                        accessible
                                        accessibilityRole="progressbar"
                                        accessibilityLabel="Today's watering progress"
                                        accessibilityValue={{
                                            min: 0,
                                            max: todayReminders.length,
                                            now: wateredCount,
                                            text: wateredCount + ' of ' + todayReminders.length + ' plants watered',
                                        }}
                                    >
                                        <View style={[styles.progressFill, { width: (progress * 100) + '%' }]} />
                                    </View>
                                    <View style={styles.progressLabels}>
                                        <Text style={styles.progressText}>
                                            {wateredCount} of {todayReminders.length} watered
                                        </Text>
                                        <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
                                    </View>
                                </>
                            )}
                        </View>

                        <View style={styles.section}>
                            <SectionHeading
                                title="Today"
                                count={todayReminders.length}
                                subtitle="A few small moments of care."
                            />
                            {todayReminders.length > 0 ? (
                                todayReminders.map((reminder) => (
                                    <ReminderCard
                                        key={reminder.id}
                                        reminder={reminder}
                                        completed={wateredIds.includes(reminder.id)}
                                        onOpen={() => navigation.navigate('PlantDetails', { plantId: reminder.plantId })}
                                        onToggleWatered={() => toggleWateredHandler(reminder.id)}
                                    />
                                ))
                            ) : (
                                <EmptyState
                                    icon="checkmark-circle-outline"
                                    title="All clear for today"
                                    description="No watering reminders are due today. Your next care days are listed below."
                                />
                            )}
                        </View>

                        <View style={styles.section}>
                            <SectionHeading
                                title="Upcoming"
                                count={upcomingReminders.length}
                                subtitle="A little look at the days ahead."
                            />
                            {upcomingReminders.length > 0 ? (
                                upcomingReminders.map((reminder) => (
                                    <ReminderCard
                                        key={reminder.id}
                                        reminder={reminder}
                                        onOpen={() => navigation.navigate('PlantDetails', { plantId: reminder.plantId })}
                                    />
                                ))
                            ) : (
                                <EmptyState
                                    icon="calendar-outline"
                                    title="No upcoming reminders"
                                    description="Your next scheduled watering days will appear here."
                                />
                            )}
                        </View>
                    </>
                )}

                <View style={styles.footer} accessible={false}>
                    <Ionicons name="leaf-outline" size={15} color={colors.secondaryText} />
                    <Text style={styles.footerText}>Small routines. Happier plants.</Text>
                </View>
            </ScrollView>

        </SafeAreaView >
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
    progressTrack: {
        height: 8,
        backgroundColor: '#D4DFC8',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primaryGreen,
        borderRadius: 4,
    },
    progressLabels: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: -6,
    },
    progressText: {
        flexShrink: 1,
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
    },
    progressPercent: {
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '700',
        color: colors.primaryGreen,
    },
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