import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme';

export default function SectionHeading({
    title,
    count,
    subtitle,
}) {
    return (
        <View style={styles.sectionHeading}>
            <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>{title}</Text>

                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{count}</Text>
                </View>
            </View>

            <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionHeading: {
        gap: 4,
        marginBottom: 2,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    sectionTitle: {
        fontSize: 21,
        lineHeight: 28,
        fontWeight: '700',
        letterSpacing: -0.4,
        color: colors.mainText,
    },
    countBadge: {
        minWidth: 26,
        minHeight: 26,
        paddingHorizontal: 7,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5ECD9',
    },
    countText: {
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '700',
        color: colors.primaryGreen,
    },
    sectionSubtitle: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
    },
});