import Ionicons from "@react-native-vector-icons/ionicons";
import {
    FlatList,
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";
import { useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../theme";

import samplePlants from "../../data/plants";

// const samplePlants = [
//     {
//         id: 'monstera',
//         name: 'Monstera',
//         location: 'Living room',
//         image: require('../../../assets/plants/monstera.jpg'),
//         status: 'water',
//         wateringInfo: 'Last watered 5 days ago',
//     },
//     {
//         id: 'snake-plant',
//         name: 'Snake Plant',
//         location: 'Bedroom',
//         image: require('../../../assets/plants/snake-plant.jpg'),
//         status: 'healthy',
//         wateringInfo: 'Water in 5 days',
//     },
//     {
//         id: 'pothos',
//         name: 'Pothos',
//         location: 'Bookshelf',
//         image: require('../../../assets/plants/pothos.jpg'),
//         status: 'light',
//         wateringInfo: 'Last watered 2 days ago',
//     },
//     {
//         id: 'bedroom-monstera',
//         name: 'Monstera',
//         location: 'Bedroom',
//         image: require('../../../assets/plants/monstera.jpg'),
//         status: 'healthy',
//         wateringInfo: 'Water in 3 days',
//     },
//     {
//         id: 'office-snake-plant',
//         name: 'Snake Plant',
//         location: 'Office',
//         image: require('../../../assets/plants/snake-plant.jpg'),
//         status: 'water',
//         wateringInfo: 'Water today',
//     },
//     {
//         id: 'kitchen-pothos',
//         name: 'Pothos',
//         location: 'Kitchen',
//         image: require('../../../assets/plants/pothos.jpg'),
//         status: 'healthy',
//         wateringInfo: 'Water in 4 days',
//     },
// ];

const statusStyles = {
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

const tabs = [
    { label: 'Home', route: 'Home', icon: 'home-outline' },
    { label: 'Plants', route: 'Plants', icon: 'leaf' },
    { label: 'Add', route: 'AddPlant', icon: 'add', isAdd: true },
    { label: 'Reminders', route: 'Reminders', icon: 'notifications-outline' },
    { label: 'Profile', route: 'Profile', icon: 'person-outline' },
];

export default function CatalogView({
    navigation,
    plants = samplePlants,
    onPlantMenu,
}) {


    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const containerWidth = Math.min(width - insets.left - insets.right, 560);
    const cardWidth = (containerWidth - 36 - 12) / 2;
    const query = search.trim().toLowerCase();
    const needsWaterCount = plants.filter((plant) => plant.status === 'water').length;
    const visiblePlants = plants.filter((plant) => {
        const matchesSearch = plant.name.toLowerCase().includes(query);
        const matchesFilter = filter === 'all' || plant.status === 'water';
        return matchesSearch && matchesFilter;
    });

    const clearFilters = () => {
        setSearch('');
        setFilter('all');
        Keyboard.dismiss();
    }

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <View style={styles.headerContent}>
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.appLabel}>Botanify</Text>
                        <Text style={styles.title} accessibilityRole="header">My Plants</Text>
                        <Text style={styles.subtitle}>Your little green collection.</Text>
                    </View>
                    <Pressable
                        style={({ pressed }) => [styles.headerAddButton, pressed && styles.pressed]}
                        onPress={() => navigation.navigate('AddPlant')}
                        accessibilityRole="button"
                        accessibilityLabel="Add plant"
                    >
                        <Ionicons name="add" size={27} color="#FFFFFF" />
                    </Pressable>
                </View>

                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={21} color={colors.secondaryText} />
                    <TextInput
                        style={styles.searchInput}
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search your plants..."
                        placeholderTextColor={colors.secondaryText}
                        accessibilityLabel="Search plants"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="search"
                        onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    {search.length > 0 && (
                        <Pressable
                            style={({ pressed }) => [styles.clearSearch, pressed && styles.pressed]}
                            onPress={() => setSearch('')}
                            accessibilityRole="button"
                            accessibilityLabel="Clear search"
                        >
                            <Ionicons name="close-circle" size={20} color={colors.secondaryText} />
                        </Pressable>
                    )}
                </View>

                <View style={styles.filters}>
                    <FilterChip
                        label={`All (${plants.length})`}
                        icon='leaf-outline'
                        active={filter === 'all'}
                        onPress={() => setFilter('all')}
                    />
                    <FilterChip
                        label={`Needs water (${needsWaterCount})`}
                        icon='water-outline'
                        active={filter === 'water'}
                        onPress={() => setFilter('water')}
                    />
                </View>

                <View style={styles.resultsRow}>
                    <Text style={styles.resultsTitle}>
                        {query || filter !== 'all' ? 'Your results' : 'Your collection'}
                    </Text>
                    <Text style={styles.resultsCount} accessibilityLiveRegion="polite">
                        {visiblePlants.length} {visiblePlants.length === 1 ? 'plant' : 'plants'}
                    </Text>
                </View>
            </View>

            <FlatList
                style={styles.list}
                data={visiblePlants}
                numColumns={2}
                keyExtractor={(plant) => plant.id}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={[
                    styles.listContent,
                    visiblePlants.length === 0 && styles.emptyListContent,
                ]}
                renderItem={({ item }) => (
                    <CatalogPlantCard
                        plant={item}
                        width={cardWidth}
                        onPress={() => navigation.navigate('PlantDetails', { plantId: item.id })}
                        onMenuPress={() => onPlantMenu?.(item.id)}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon} accessibilityActions={false}>
                            <Ionicons
                                name={plants.length === 0 ? 'leaf-outline' : 'search-outline'}
                                size={34}
                                color={colors.primaryGreen}
                            />
                        </View>
                        <Text style={styles.emptyTitle}>
                            {plants.length === 0 ? 'Your green world starts here' : 'No plants found'}
                        </Text>
                        <Text style={styles.emptyText}>
                            {plants.length === 0
                                ? 'Add your first plant and keep its care close at hand.'
                                : 'Try another name or clear your search and filters.'}
                        </Text>
                        <Pressable
                            style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]}
                            onPress={plants.length === 0 ? () => navigation.navigate('AddPlant') : clearFilters}
                            accessibilityRole="button"
                        >
                            <Text style={styles.emptyButtonText}>
                                {plants.length === 0 ? 'Add your first plant' : 'Clear search & filters'}
                            </Text>
                        </Pressable>
                    </View>
                }
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            />

        </SafeAreaView>
    );
}

function FilterChip({
    label,
    icon,
    active,
    onPress,
}) {
    return (
        <Pressable
            style={({ pressed }) => [styles.filterChip, active && styles.filterChipActive, pressed && styles.pressed]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
        >
            <Ionicons name={icon} size={16} color={active ? '#FFFFFF' : colors.primaryGreen} />
            <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
        </Pressable>
    );
}

function CatalogPlantCard({
    plant,
    width,
    onPress,
    onMenuPress
}) {
    const status = statusStyles[plant.status];

    return (
        <View style={[styles.plantCard, { width }]}>
            <View style={styles.imageContainer}>
                <Pressable
                    style={({ pressed }) => [styles.imageButton, pressed && styles.pressed]}
                    onPress={onPress}
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${plant.name} in ${plant.location}`}
                >
                    <Image source={plant.image} style={styles.plantImage} accessible={false} />
                </Pressable>
                <Pressable
                    style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
                    onPress={onMenuPress}
                    accessibilityRole="button"
                    accessibilityLabel={`More options for ${plant.name} in ${plant.location}`}
                >
                    <View style={styles.menuBackground}>
                        <Ionicons name="ellipsis-horizontal" size={18} color={colors.mainText} />
                    </View>
                </Pressable>
            </View>

            <Pressable
                style={({ pressed }) => [styles.plantInfo, pressed && styles.pressed]}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={`${plant.name}, ${plant.location}, ${status.label}, ${plant.wateringInfo}`}
            >
                <Text style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
                <View style={styles.locationRow}>
                    <Ionicons name="locate-outline" size={12} color={colors.secondaryText} />
                    <Text style={styles.locationText} numberOfLines={1}>{plant.location}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: status.backgroundColor }]}>
                    <Ionicons name={status.icon} size={13} color={status.color} />
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
                <Text style={styles.wateringInfo} numberOfLines={2}>{plant.wateringInfo}</Text>
            </Pressable >
        </View >
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    headerContent: {
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
        paddingHorizontal: 18,
        paddingTop: 22,
        paddingBottom: 12,
        gap: 18,
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
    headerAddButton: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: colors.primaryGreen,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 52,
        gap: 10,
        paddingLeft: 15,
        paddingRight: 4,
        borderRadius: 26,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    searchInput: {
        flex: 1,
        minWidth: 0,
        paddingVertical: 14,
        paddingHorizontal: 0,
        fontSize: 14,
        color: colors.mainText,
    },
    clearSearch: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
    },
    filters: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    filterChipActive: {
        borderColor: colors.primaryGreen,
        backgroundColor: colors.primaryGreen,
    },
    filterText: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        color: colors.mainText,
    },
    filterTextActive: {
        color: '#FFFFFF',
    },
    resultsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },
    resultsTitle: {
        fontSize: 17,
        lineHeight: 23,
        fontWeight: '700',
        color: colors.mainText,
    },
    resultsCount: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
    },
    list: {
        flex: 1,
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
    },
    listContent: {
        paddingHorizontal: 18,
        paddingTop: 2,
        paddingBottom: 24,
    },
    gridRow: {
        gap: 12,
        marginBottom: 14,
        alignItems: 'stretch',
    },
    plantCard: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 1.1,
        borderBottomLeftRadius: 17,
        borderBottomRightRadius: 17,
        backgroundColor: '#EDF1E6',
        overflow: 'hidden',
    },
    imageButton: {
        flex: 1,
    },
    plantImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    menuButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuBackground: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFFFFFDD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    plantInfo: {
        padding: 12,
        gap: 8,
    },
    plantName: {
        fontSize: 16,
        lineHeight: 22,
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
        fontSize: 11,
        lineHeight: 16,
        color: colors.secondaryText,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        maxWidth: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusText: {
        flexShrink: 1,
        fontSize: 11,
        lineHeight: 15,
        fontWeight: '500',
    },
    wateringInfo: {
        minHeight: 34,
        fontSize: 12,
        lineHeight: 17,
        color: colors.secondaryText,
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    emptyState: {
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 30,
        gap: 14,
    },
    emptyIcon: {
        width: 76,
        height: 76,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGreenBackground,
        marginBottom: 4,
    },
    emptyTitle: {
        fontSize: 21,
        lineHeight: 28,
        fontWeight: '700',
        textAlign: 'center',
        color: colors.mainText,
    },
    emptyText: {
        maxWidth: 270,
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
        color: colors.secondaryText,
    },
    emptyButton: {
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: colors.primaryGreen,
        marginTop: 6,
    },
    emptyButtonText: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        color: colors.primaryGreen,
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.7,
    },
});