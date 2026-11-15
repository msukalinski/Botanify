import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { colors } from '../../theme';

export default function MenuRow({
    icon,
    title,
    subtitle,
    onPress,
    last = false,
}) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.menuRow,
                !last && styles.rowDivider,
                pressed && styles.pressed,
            ]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${title}, ${subtitle}`}
        >
            <View style={styles.rowIcon} accessible={false}>
                <Ionicons
                    name={icon}
                    size={21}
                    color={colors.primaryGreen}
                />
            </View>

            <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>

            <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.secondaryText}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    rowIcon: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: '#EAF0E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowDivider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        minHeight: 78,
        paddingVertical: 15,
    },
    menuText: {
        flex: 1,
        minWidth: 0,
        gap: 4,
    },
    menuTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        color: colors.mainText,
    },
    menuSubtitle: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
    },
    pressed: {
        opacity: 0.7,
    },
});