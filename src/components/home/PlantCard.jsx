import Ionicons from "@react-native-vector-icons/ionicons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme";

export default function PlantCard({
    plant,
    width,
    onPress,
    onMenuPress
}) {
    return (
        <View style={[styles.plantCard, { width }]}>
            <View style={styles.plantImageContainer}>
                <Pressable
                    style={({ pressed }) => [styles.plantImageButton, pressed && styles.pressed]}
                    onPress={onPress}
                    accessibilityRole="button"
                    accessibilityLabel={`Open ${plant.name}`}
                >
                    <Image source={plant.image} style={styles.plantImage} accessible={false} />
                </Pressable>
                <Pressable
                    style={({ pressed }) => [styles.plantMenu, pressed && styles.pressed]}
                    onPress={onMenuPress}
                    accessibilityRole="button"
                    accessibilityLabel={`More options for ${plant.name}`}
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
                accessibilityLabel={`${plant.name}, ${plant.status}, ${plant.wateringInfo}`}
            >
                <Text style={styles.plantName}>{plant.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: plant.statusBackground }]}>
                    <Ionicons name={plant.statusIcon} size={12} color={plant.statusColor} />
                    <Text style={[styles.statusText, { color: plant.statusColor }]}>{plant.status}</Text>
                </View>
                <Text style={styles.wateringInfo}>{plant.wateringInfo}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    plantCard: {
        minWidth: 0,
        borderRadius: 18,
        backgroundColor: colors.cardBackground,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    plantImageContainer: {
        position: 'relative',
        width: '100%',
        aspectRatio: 0.92,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#EDF1E6',
    },
    plantImageButton: {
        flex: 1,
    },
    plantImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    plantMenu: {
        position: 'absolute',
        top: 1,
        right: 1,
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
        paddingHorizontal: 8,
        paddingTop: 10,
        paddingBottom: 12,
        gap: 7,
    },
    plantName: {
        fontSize: 14,
        lineHeight: 19,
        fontWeight: '700',
        color: colors.mainText,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        maxWidth: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 6,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusText: {
        flexShrink: 1,
        fontSize: 10,
        lineHeight: 14,
        fontWeight: '500',
    },
    wateringInfo: {
        fontSize: 11,
        lineHeight: 16,
        color: colors.secondaryText,
    },
    pressed: {
        opacity: 0.65,
    },
});