import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {
    FlatList,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { getPlants } from '../services/plantService';

import LoadingIndicator from '../components/loading-indicator/LoadingIndicator';
import ErrorMessage from '../components/error-message/ErrorMessage';
import FilterChip from '../components/catalog/FilterChip';
import CatalogPlantCard from '../components/catalog/CatalogPlantCard';

import useCurrentDate from '../hooks/useCurrentDate';
import { toCatalogPlant } from '../utils/toCatalogPlant';

import { colors } from '../theme';

export default function CatalogScreen({
    navigation,
    route,
    onPlantMenu,
}) {
    const [plantData, setPlants] = useState([]);
    const { today } = useCurrentDate();
    const plants = useMemo(
        () => plantData.map((plant) => toCatalogPlant(plant, today)),
        [plantData, today],
    );
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();

    const createdPlantId = route?.params?.createdPlantId;

    useEffect(() => {
        if (createdPlantId) {
            setSearch('');
            setFilter('all');
        }
    }, [createdPlantId]);

    useFocusEffect(useCallback(() => {
        let active = true;

        const loadPlants = async () => {
            setLoading(true);
            setLoadError('');

            try {
                const data = await getPlants();

                if (active) {
                    setPlants(data);
                }
            } catch (err) {
                if (active) {
                    setPlants([]);
                    setLoadError(typeof err?.message === 'string' && err.message
                        ? err.message
                        : 'Could not load your plants. Please try again.');
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadPlants();

        return () => {
            active = false;
        };
    }, [reloadKey]));

    const containerWidth = Math.min(width - insets.left - insets.right, 560);
    const cardWidth = (containerWidth - 36 - 12) / 2;
    const query = search.trim().toLowerCase();
    const needsWaterCount = plants.filter((plant) => plant.status === 'water').length;
    const collection = createdPlantId
        ? [
            ...plants.filter((plant) => plant.id === createdPlantId),
            ...plants.filter((plant) => plant.id !== createdPlantId),
        ]
        : plants;
    const visiblePlants = collection.filter((plant) => {
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
                data={loading || loadError ? [] : visiblePlants}
                numColumns={2}
                keyExtractor={(plant) => plant.id}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={[
                    styles.listContent,
                    (loading || loadError || visiblePlants.length === 0) && styles.emptyListContent,
                ]}
                renderItem={({ item }) => (
                    <CatalogPlantCard
                        plant={item}
                        width={cardWidth}
                        onPress={() => navigation.navigate('PlantDetails', { plantId: item.id })}
                        onMenuPress={() => onPlantMenu?.(item.id)}
                    />
                )}
                ListEmptyComponent={loading ? (
                    <LoadingIndicator message='Loading your plants...' />
                ) : loadError ? (
                    <ErrorMessage
                        title='Could not load your plants'
                        message={loadError}
                        onRetry={() => setReloadKey((previous) => previous + 1)}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon} accessible={false}>
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
                )}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            />

        </SafeAreaView>
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