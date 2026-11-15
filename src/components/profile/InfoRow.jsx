import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { colors } from '../../theme';

export default function InfoRow({
    icon,
    label,
    value,
    last = false,
}) {
    return (
        <View style={[styles.infoRow, !last && styles.rowDivider]}>
            <View style={styles.rowIcon} accessible={false}>
                <Ionicons
                    name={icon}
                    size={20}
                    color={colors.primaryGreen}
                />
            </View>

            <View style={styles.infoText}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue} selectable>
                    {value}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 16,
    },
    rowIcon: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: '#EAF0E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        flex: 1,
        minWidth: 0,
        gap: 4,
    },
    infoLabel: {
        fontSize: 11,
        lineHeight: 17,
        color: colors.secondaryText,
    },
    infoValue: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: '500',
        color: colors.mainText,
    },
    rowDivider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
});