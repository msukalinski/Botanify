import { Pressable, StyleSheet, Text } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import { colors } from "../../theme";

export default function FilterChip({
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

const styles = StyleSheet.create({
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
    pressed: {
        opacity: 0.7,
    },
});