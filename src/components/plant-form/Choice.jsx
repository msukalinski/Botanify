import { Pressable, StyleSheet, Text } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { colors } from '../../theme';

export default function Choice({
    label,
    icon,
    selected,
    onPress,
}) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.choice,
                selected && styles.choiceSelected,
                pressed && styles.pressed,
            ]}
            onPress={onPress}
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityState={{ checked: selected }}
        >
            {icon && (
                <Ionicons
                    name={icon}
                    size={17}
                    color={
                        selected
                            ? colors.primaryGreen
                            : colors.secondaryText
                    }
                />
            )}

            <Text
                style={[
                    styles.choiceText,
                    selected && styles.choiceTextSelected,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    choice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        minHeight: 44,
        paddingHorizontal: 13,
        paddingVertical: 10,
        gap: 6,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.screenBackground,
    },
    choiceSelected: {
        borderColor: colors.primaryGreen,
        backgroundColor: '#E7EFDD',
    },
    choiceText: {
        flexShrink: 1,
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
    },
    choiceTextSelected: {
        fontWeight: '600',
        color: colors.primaryGreen,
    },
    pressed: {
        opacity: 0.75,
    },
});