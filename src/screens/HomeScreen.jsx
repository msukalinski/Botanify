import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";

import HomeHeader from "../components/home/HomeHeader";
import { colors } from "../theme";
import SectionHeader from "../components/home/SectionHeader";
import PlantCard from "../components/home/PlantCard";
import CareRow from "../components/home/CareRow";

const plants = [
    {
        id: 'monstera',
        name: 'Monstera',
        image: require('../../assets/plants/monstera.jpg'),
        status: 'Needs water',
        statusIcon: 'water',
        statusColor: colors.waterText,
        statusBackground: colors.waterBackground,
        wateringInfo: 'Last watered 5 days ago',
    },
    {
        id: 'snake-plant',
        name: 'Snake Plant',
        image: require('../../assets/plants/snake-plant.jpg'),
        status: 'Doing great',
        statusIcon: 'leaf',
        statusColor: colors.healthyText,
        statusBackground: colors.healthyBackground,
        wateringInfo: 'Water in 5 days',
    },
    {
        id: 'pothos',
        name: 'Pothos',
        image: require('../../assets/plants/pothos.jpg'),
        status: 'Indirect light',
        statusIcon: 'sunny',
        statusColor: colors.lightText,
        statusBackground: colors.lightBackground,
        wateringInfo: 'Last watered 2 days ago',
    },
];

export default function HomeScreen({
    navigation
}) {
    const insets = useSafeAreaInsets();
    const { width, fontScale } = useWindowDimensions();
    const contentWidth = Math.min(width - insets.left - insets.right, 560) - 36;
    const plantCardWidth = Math.max(108 * fontScale, (contentWidth - 18) / 3);

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
            >

                <HomeHeader />

                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={22} color={colors.secondaryText} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search plants, care tips, or problems..."
                        placeholderTextColor={colors.secondaryText}
                        accessibilityLabel="Search plants, care tips"
                        returnKeyType="search"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.section}>
                    <SectionHeader
                        title="My Plants"
                        actionLabel="View all"
                        onPress={() => navigation.navigate('Plants')}
                    />
                    <ScrollView
                        horizontal
                        style={styles.plantScroller}
                        contentContainerStyle={styles.plantRow}
                        showsHorizontalScrollIndicator={false}
                    >
                        {plants.map((plant) => (
                            <PlantCard
                                key={plant.id}
                                plant={plant}
                                width={plantCardWidth}
                            // onPress={}
                            // onMenuPress={}
                            />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.carePanel}>
                    <SectionHeader
                        title="Today's Care"
                        actionLabel="See all"
                        onPress={() => navigation.navigate('Reminders')}
                    />

                    <View style={styles.careBody}>
                        <View style={styles.careList}>
                            <CareRow
                                icon="water"
                                iconColor="#168C96"
                                iconBackground="#D8EEEB"
                                title="Water 1 plant"
                                subtitle="Monstera needs water"
                            // onPress={}
                            />
                            <View style={styles.careDivider} />
                            <CareRow
                                icon="leaf"
                                iconColor={colors.primaryGreen}
                                iconBackground="#DDEDCF"
                                title="Check light"
                                subtitle="Pothos prefers indirect light"
                            // onPress={}
                            />
                        </View>
                        <View style={styles.careDecoration} accessible={false}>
                            <View style={styles.careDecorationCircle}>
                                <Ionicons name="water-outline" size={38} color="#7A9A63" />
                            </View>
                            <Text style={styles.careQuote}>Small steps,{'\n'}healthy plants</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.quickLinks}>
                    <Pressable
                        style={({ pressed }) => [styles.quickCard, styles.scheduleCard, pressed && styles.pressed]}
                        accessibilityRole="button"
                        accessibilityLabel="Watering schedule, 3 plants this week"
                        onPress={() => navigation.navigate('Reminders')}
                    >
                        <View style={styles.quickCardHeader}>
                            <View style={[styles.quickIcon, styles.scheduleIcon]}>
                                <Ionicons name="calendar-outline" size={20} color={colors.primaryGreen} />
                            </View>
                            <Text style={styles.quickTitle}>Watering Schedule</Text>
                            <Ionicons name="chevron-forward" size={14} color={colors.secondaryText} />
                        </View>
                        <Text style={styles.quickSubtitle}>Keep your plants on track</Text>
                        <View style={styles.scheduleBottom}>
                            <Text style={styles.scheduleCount}>3</Text>
                            <Text style={styles.scheduleCountLabel}>plants{'\n'}this week</Text>
                            <Image source={plants[0].image} style={styles.scheduleImage} accessible={false} />
                        </View>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [styles.quickCard, styles.tipsCard, pressed && styles.pressed]}
                        accessibilityRole="button"
                        accessibilityLabel="Read 5 tips for happier houseplants"
                    // onPress={}
                    >
                        <View style={styles.quickCardHeader}>
                            <View style={[styles.quickIcon, styles.tipsIcon]}>
                                <Ionicons name="bulb-outline" size={21} color="#C88B15" />
                            </View>
                            <Text style={styles.quickTitle}>Tips for Healthy Plants</Text>
                            <Ionicons name="chevron-forward" size={14} color={colors.secondaryText} />
                        </View>
                        <Text style={styles.quickSubtitle}>Learn and grow together</Text>
                        <View style={styles.tipPreview}>
                            <Image source={plants[2].image} style={styles.tipImage} accessible={false} />
                            <Text style={styles.tipText}>5 Tips for Happier Houseplants</Text>
                            <Ionicons name="chevron-forward" size={13} color={colors.secondaryText} />
                        </View>
                    </Pressable>
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
    scrollContent: {
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 28,
        gap: 24,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        minHeight: 52,
        paddingHorizontal: 15,
        borderRadius: 27,
        backgroundColor: colors.cardBackground,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchInput: {
        flex: 1,
        minWidth: 0,
        paddingVertical: 14,
        paddingHorizontal: 0,
        fontSize: 13,
        color: colors.mainText,
    },
    section: {
        gap: 12,
    },
    plantRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 9,
    },
    plantScroller: {
        flexGrow: 0,
    },

    carePanel: {
        padding: 14,
        borderRadius: 22,
        backgroundColor: '#EAF0E2',
        gap: 12,
    },
    careBody: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    careList: {
        flex: 1,
        backgroundColor: '#F8FAF4',
        borderRadius: 17,
        overflow: 'hidden',
    },

    careDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: 53,
        marginRight: 10,
    },
    careDecoration: {
        width: 68,
        alignItems: 'center',
        gap: 7,
    },
    careDecorationCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#DFE9D3',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '-12deg' }],
    },
    careQuote: {
        fontSize: 11,
        lineHeight: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#6B805E',
    },
    quickLinks: {
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 10,
    },
    quickCard: {
        flex: 1,
        minWidth: 0,
        padding: 12,
        borderRadius: 20,
        gap: 9,
    },
    scheduleCard: {
        backgroundColor: '#EAF0E2',
    },
    tipsCard: {
        backgroundColor: '#FFF5DE',
    },
    quickCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    quickIcon: {
        width: 30,
        height: 34,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scheduleIcon: {
        backgroundColor: '#D5E8C8',
    },
    tipsIcon: {
        backgroundColor: '#FFE9AE',
    },
    quickTitle: {
        flex: 1,
        fontSize: 12,
        lineHeight: 17,
        fontWeight: '700',
        color: colors.mainText,
    },
    quickSubtitle: {
        fontSize: 11,
        lineHeight: 16,
        color: colors.secondaryText,
    },
    scheduleBottom: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 5,
        paddingTop: 8,
    },
    scheduleCount: {
        fontSize: 35,
        lineHeight: 42,
        fontWeight: '800',
        color: colors.mainText,
        letterSpacing: -1,
    },
    scheduleCountLabel: {
        flex: 1,
        fontSize: 11,
        lineHeight: 16,
        color: colors.secondaryText,
        paddingBottom: 3,
    },
    scheduleImage: {
        width: 43,
        height: 64,
        borderRadius: 17,
        resizeMode: 'cover',
    },
    tipPreview: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: 7,
        marginTop: 4,
        borderRadius: 14,
        backgroundColor: '#FFFBF1',
    },
    tipImage: {
        width: 37,
        height: 54,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    tipText: {
        flex: 1,
        fontSize: 11,
        lineHeight: 16,
        color: colors.mainText,
    },
    bottomBar: {
        backgroundColor: '#FCFDF9',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 8,
        paddingHorizontal: 8,
    },
    tabRow: {
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 54,
        gap: 5,
    },
    tabIcon: {
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginTop: -25,
        backgroundColor: '#7B9D66',
        borderWidth: 3,
        borderColor: '#FCFDF9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 10,
        lineHeight: 14,
        color: colors.secondaryText,
    },
    tabLabelActive: {
        fontWeight: '700',
        color: colors.primaryGreen,
    },
    pressed: {
        opacity: 0.65,
    },
});