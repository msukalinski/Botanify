import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { colors } from '../../theme';

const statusStyles = {
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

export default function CatalogPlantCard({
    plant,
    width,
    onPress,
    onMenuPress,
}) {
    const status = statusStyles[plant.status] ?? statusStyles.unknown;

    return (
        <View style={[styles.plantCard, { width }]}>
            <View style={styles.imageContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.imageButton,
                        pressed && styles.pressed,
                    ]}
                    onPress={onPress}
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${plant.name} in ${plant.location}`}
                >
                    {plant.image ? (
                        <Image
                            source={plant.image}
                            style={styles.plantImage}
                            accessible={false}
                        />
                    ) : (
                        <View style={styles.imagePlaceholder} accessible={false}>
                            <Ionicons name="leaf-outline" size={40} color={colors.primaryGreen} />
                        </View>
                    )}
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.menuButton,
                        pressed && styles.pressed,
                    ]}
                    onPress={onMenuPress}
                    accessibilityRole="button"
                    accessibilityLabel={`More options for ${plant.name} in ${plant.location}`}
                >
                    <View style={styles.menuBackground}>
                        <Ionicons
                            name="ellipsis-horizontal"
                            size={18}
                            color={colors.mainText}
                        />
                    </View>
                </Pressable>
            </View>

            <Pressable
                style={({ pressed }) => [
                    styles.plantInfo,
                    pressed && styles.pressed,
                ]}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={`${plant.name}, ${plant.location}, ${status.label}, ${plant.wateringInfo}`}
            >
                <Text style={styles.plantName} numberOfLines={1}>
                    {plant.name}
                </Text>

                <View style={styles.locationRow}>
                    <Ionicons
                        name="locate-outline"
                        size={12}
                        color={colors.secondaryText}
                    />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {plant.location}
                    </Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: status.backgroundColor },
                    ]}
                >
                    <Ionicons
                        name={status.icon}
                        size={13}
                        color={status.color}
                    />
                    <Text style={[styles.statusText, { color: status.color }]}>
                        {status.label}
                    </Text>
                </View>

                <Text style={styles.wateringInfo} numberOfLines={2}>
                    {plant.wateringInfo}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
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
        flex: 1
    },
    plantImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.lightGreenBackground,
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
    pressed: {
        opacity: 0.7,
    },
});