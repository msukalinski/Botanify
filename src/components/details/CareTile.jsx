import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { colors } from '../../theme';

export default function CareTile({
    icon,
    iconColor,
    iconBackground,
    label,
    value,
}) {
    return (
        <View style={styles.careTile}>
            <View
                style={[
                    styles.careTileIcon,
                    { backgroundColor: iconBackground },
                ]}
                accessible={false}
            >
                <Ionicons
                    name={icon}
                    size={22}
                    color={iconColor}
                />
            </View>

            <Text style={styles.careTileLabel}>{label}</Text>
            <Text style={styles.careTileValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    careTile: {
        flex: 1,
        minWidth: 0,
        minHeight: 145,
        padding: 14,
        gap: 9,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    careTileIcon: {
        width: 37,
        height: 37,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    careTileLabel: {
        fontSize: 12,
        lineHeight: 17,
        color: colors.secondaryText,
    },
    careTileValue: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        color: colors.mainText,
    },
});