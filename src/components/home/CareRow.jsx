import Ionicons from "@react-native-vector-icons/ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme";

export default function CareRow({
    icon,
    iconColor,
    iconBackground,
    title,
    subtitle,
    onPress,
}) {
    return (
        <Pressable
            style={({ pressed }) => [styles.careRow, pressed && styles.pressed]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${title}, ${subtitle}`}
        >
            <View style={[styles.careIcon, { backgroundColor: iconBackground }]}>
                <Ionicons name={icon} size={23} color={iconColor} />
            </View>
            <View style={styles.careText}>
                <Text style={styles.careTitle}>{title}</Text>
                <Text style={styles.careSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.secondaryText} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    careRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 9,
        paddingVertical: 13,
    },
    careIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    careText: {
        flex: 1,
        gap: 3,
    },
    careTitle: {
        fontSize: 14,
        lineHeight: 19,
        fontWeight: '700',
        color: colors.mainText,
    },
    careSubtitle: {
        fontSize: 11,
        lineHeight: 16,
        color: colors.secondaryText,
    },
    pressed: {
        opacity: 0.65,
    },
});