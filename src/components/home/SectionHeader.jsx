import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { colors } from "../../theme";

export default function SectionHeader({
    title,
    actionLabel,
    onPress
}) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Pressable
                style={({ pressed }) => [styles.sectionLink, pressed && styles.pressed]}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={`${actionLabel}, ${title}`}
            >
                <Text style={styles.sectionLinkText}>{actionLabel}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.secondaryText} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    sectionTitle: {
        flexShrink: 1,
        fontSize: 22,
        lineHeight: 28,
        fontWeight: '700',
        letterSpacing: -0.6,
        color: colors.mainText,
    },
    sectionLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 44,
        gap: 4,
    },
    sectionLinkText: {
        fontSize: 13,
        color: colors.secondaryText,
    },
    pressed: {
        opacity: 0.65,
    },
});