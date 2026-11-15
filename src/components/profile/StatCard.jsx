import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { colors } from '../../theme';

export default function StatCard({
    icon,
    value,
    label,
    iconColor,
    iconBackground,
}) {
    return (
        <View
            style={styles.statCard}
            accessible
            accessibilityLabel={`${value} ${label.toLowerCase()}`}
        >
            <View
                style={[
                    styles.statIcon,
                    { backgroundColor: iconBackground },
                ]}
                accessible={false}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color={iconColor}
                />
            </View>

            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    statCard: {
        flex: 1,
        minWidth: 84,
        paddingHorizontal: 10,
        paddingVertical: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
        alignItems: 'center',
        gap: 7,
    },
    statIcon: {
        width: 37,
        height: 37,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    statValue: {
        fontSize: 25,
        lineHeight: 32,
        fontWeight: '800',
        color: colors.mainText,
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 11,
        lineHeight: 17,
        color: colors.secondaryText,
        textAlign: 'center',
    },
});