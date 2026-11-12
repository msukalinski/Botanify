import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";

import { colors } from "../../theme";

export default function ProfileView({
    profile = sampleProfile,
    stats = sampleStats,
    onNavigate,
    onEditProfile,
    onLogout,
}) {
    const insets = useSafeAreaInsets();
    const username = profile.username?.trim();
    const displayName = profile.displayName?.trim() || username || 'Plant lover';
    const initials = displayName
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();

    const plantCount = stats.plantCount ?? 0;
    const reminderCount = stats.reminderCount ?? 0;
    const dueTodayCount = stats.dueTodayCount ?? 0;

    return (
        <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                contentInsetAdjustmentBehavior="never"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.appLabel}>Botanify</Text>
                        <Text style={styles.title} accessibilityRole="header">My Profile</Text>
                        <Text style={styles.subtitle}>Your own little corner of green.</Text>
                    </View>
                    <View style={styles.headerIcon}>
                        <Ionicons name="person-outline" size={26} color={colors.primaryGreen} />
                    </View>
                </View>

                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        {profile.avatar ? (
                            <Image
                                source={profile.avatar}
                                style={styles.avatarImage}
                                accessibilityLabel={'Profile photo of ' + displayName}
                            />
                        ) : (
                            <View style={styles.avatar} accessible={false}>
                                <Text style={styles.avatarInitials} maxFontSizeMultiplier={1.3}>
                                    {initials}
                                </Text>
                            </View>
                        )}
                        <View style={styles.avatarBadge} accessible={false}>
                            <Ionicons name="leaf" size={18} color={colors.primaryGreen} />
                        </View>
                    </View>

                    <View style={styles.identity}>
                        <Text style={styles.displayName} accessibilityRole="header">{displayName}</Text>
                        {username ? <Text style={styles.username}>{'@' + username}</Text> : null}
                        <View style={styles.memberBadge}>
                            <Ionicons name="leaf-outline" size={13} color={colors.primaryGreen} />
                            <Text style={styles.memberBadgeText}>Plant parent</Text>
                        </View>
                    </View>

                    <Pressable
                        style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
                        onPress={() => onEditProfile?.()}
                        accessibilityRole="button"
                        accessibilityLabel="Edit profile"
                    >
                        <Ionicons name="create-outline" size={19} color="#FFFFFF" />
                        <Text style={styles.editButtonText}>Edit profile</Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle} accessibilityRole="header">Your green world</Text>
                    <View style={styles.statsRow}>
                        <StatCard
                            icon="leaf-outline"
                            value={plantCount}
                            label="Plants"
                            iconColor={colors.primaryGreen}
                            iconBackground="#E5EEDB"
                        />
                        <StatCard
                            icon="notifications-outline"
                            value={reminderCount}
                            label="Reminders"
                            iconColor="#B78018"
                            iconBackground="#FFF0CF"
                        />
                        <StatCard
                            icon="water-outline"
                            value={dueTodayCount}
                            label="Due today"
                            iconColor="#168C96"
                            iconBackground="#D8EEEB"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle} accessibilityRole="header">Account details</Text>
                    <View style={styles.infoCard}>
                        <InfoRow
                            icon="person-outline"
                            label="Username"
                            value={username ? '@' + username : 'Not added'}
                        />
                        <InfoRow
                            icon="mail-outline"
                            label="Email address"
                            value={profile.email.trim() || 'Not added'}
                        />
                        <InfoRow
                            icon="calendar-outline"
                            label="Member since"
                            value={profile.memberSinceLabel ?? 'Not available'}
                            last
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle} accessibilityRole="header">My garden</Text>
                    <View style={styles.menuCard}>
                        <MenuRow
                            icon="leaf-outline"
                            title="My plants"
                            subtitle={plantCount + (plantCount === 1 ? ' plant in your collection' : ' plants in your collection')}
                            onPress={() => onNavigate?.('Plants')}
                        />
                        <MenuRow
                            icon="notifications-outline"
                            title="Watering reminders"
                            subtitle="Keep your care routine close"
                            onPress={() => onNavigate?.('Reminders')}
                            last
                        />
                    </View>
                </View>

                <Pressable
                    style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
                    onPress={() => onLogout?.()}
                    accessibilityRole="button"
                    accessibilityLabel="Log out"
                >
                    <Ionicons name="log-out-outline" size={21} color="#A63D32" />
                    <Text style={styles.logoutText}>Log out</Text>
                </Pressable>

                <View style={styles.footer} accessible={false}>
                    <Ionicons name="leaf-outline" size={15} color={colors.secondaryText} />
                    <Text style={styles.footerText}>A little care. A lot of green.</Text>
                </View>
            </ScrollView>

        </SafeAreaView >
    );
}

const sampleProfile = {
    displayName: 'Alex Green',
    username: 'alexgrows',
    email: 'alex@example.com',
    memberSinceLabel: 'November 2026',
    avatar: null,
};

const sampleStats = {
    plantCount: 6,
    reminderCount: 5,
    dueTodayCount: 2,
};

const tabs = [
    { label: 'Home', route: 'Home', icon: 'home-outline' },
    { label: 'Plants', route: 'Plants', icon: 'leaf-outline' },
    { label: 'Add', route: 'AddPlant', icon: 'add', isAdd: true },
    { label: 'Reminders', route: 'Reminders', icon: 'notifications-outline' },
    { label: 'Profile', route: 'Profile', icon: 'person' },
];

function StatCard({
    icon,
    value,
    label,
    iconColor,
    iconBackground
}) {
    return (
        <View style={styles.statCard} accessible accessibilityLabel={value + ' ' + label.toLowerCase()}>
            <View style={[styles.statIcon, { backgroundColor: iconBackground }]} accessible={false}>
                <Ionicons name={icon} size={20} color={iconColor} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

function InfoRow({
    icon,
    label,
    value,
    last = false,
}) {
    return (
        <View style={[styles.infoRow, !last && styles.rowDivider]}>
            <View style={styles.rowIcon} accessible={false}>
                <Ionicons name={icon} size={20} color={colors.primaryGreen} />
            </View>
            <View style={styles.infoText}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue} selectable>{value}</Text>
            </View>
        </View>
    );
}

function MenuRow({
    icon,
    title,
    subtitle,
    onPress,
    last = false,
}) {
    return (
        <Pressable
            style={({ pressed }) => [styles.menuRow, !last && styles.rowDivider, pressed && styles.pressed]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={title + ', ' + subtitle}
        >
            <View style={styles.rowIcon} accessible={false}>
                <Ionicons name={icon} size={21} color={colors.primaryGreen} />
            </View>
            <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.screenBackground
    },
    scroll: {
        flex: 1
    },
    content: {
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
        paddingHorizontal: 18,
        paddingTop: 22,
        paddingBottom: 28,
        gap: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16
    },
    headerText: {
        flex: 1
    },
    appLabel: {
        fontSize: 11,
        lineHeight: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: colors.primaryGreen,
        marginBottom: 4,
    },
    title: {
        fontSize: 31,
        lineHeight: 39,
        fontWeight: '800',
        letterSpacing: -1,
        color: colors.mainText,
    },
    subtitle: {
        fontSize: 13,
        lineHeight: 20,
        color: colors.secondaryText,
        marginTop: 5
    },
    headerIcon: {
        width: 50,
        height: 50,
        borderRadius: 18,
        backgroundColor: '#E3EBD6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileCard: {
        paddingHorizontal: 22,
        paddingVertical: 24,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#D7E1CC',
        backgroundColor: '#EDF2E7',
        alignItems: 'center',
        gap: 18,
    },
    avatarContainer: {
        width: 92,
        height: 92
    },
    avatar: {
        width: 86,
        height: 86,
        borderRadius: 43,
        backgroundColor: '#D5E3C8',
        borderWidth: 3,
        borderColor: '#FCFDF9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImage: {
        width: 86,
        height: 86,
        borderRadius: 43,
        borderWidth: 3,
        borderColor: '#FCFDF9',
        resizeMode: 'cover',
    },
    avatarInitials: {
        fontSize: 28,
        lineHeight: 36,
        fontWeight: '700',
        color: colors.primaryGreen
    },
    avatarBadge: {
        position: 'absolute',
        right: 0,
        bottom: 2,
        width: 31,
        height: 31,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#EDF2E7',
        backgroundColor: '#FCFDF9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    identity: {
        alignItems: 'center',
        gap: 6,
        width: '100%'
    },
    displayName: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '800',
        letterSpacing: -0.5,
        color: colors.mainText,
        textAlign: 'center'
    },
    username: {
        fontSize: 13,
        lineHeight: 20,
        color: colors.secondaryText,
        textAlign: 'center'
    },
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 13,
        backgroundColor: '#DCE8CF',
        gap: 5,
        marginTop: 3,
    },
    memberBadgeText: {
        flexShrink: 1,
        fontSize: 11,
        lineHeight: 17,
        fontWeight: '600',
        color: colors.primaryGreen
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
        maxWidth: '100%',
        paddingHorizontal: 23,
        paddingVertical: 12,
        borderRadius: 15,
        backgroundColor: colors.primaryGreen,
        gap: 8,
    },
    editButtonText: {
        flexShrink: 1,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center'
    },
    section: {
        gap: 12
    },
    sectionTitle: {
        fontSize: 20,
        lineHeight: 27,
        fontWeight: '700',
        letterSpacing: -0.4,
        color: colors.mainText
    },
    statsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'stretch',
        gap: 10
    },
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
        marginBottom: 2
    },
    statValue: {
        fontSize: 25,
        lineHeight: 32,
        fontWeight: '800',
        color: colors.mainText,
        textAlign: 'center'
    },
    statLabel: {
        fontSize: 11,
        lineHeight: 17,
        color: colors.secondaryText,
        textAlign: 'center'
    },
    infoCard: {
        paddingHorizontal: 15,
        borderRadius: 21,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 16
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
        gap: 4
    },
    infoLabel: {
        fontSize: 11,
        lineHeight: 17,
        color: colors.secondaryText
    },
    infoValue: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: '500',
        color: colors.mainText
    },
    rowDivider: {
        borderBottomWidth: 1,
        borderBottomColor:
            colors.border
    },
    menuCard: {
        paddingHorizontal: 15,
        borderRadius: 21,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        minHeight: 78,
        paddingVertical: 15
    },
    menuText: {
        flex: 1,
        minWidth: 0,
        gap: 4
    },
    menuTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        color: colors.mainText
    },
    menuSubtitle: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText
    },
    logoutButton: {
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 18,
        paddingVertical: 13,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0D1CC',
        backgroundColor: '#FFF3F0',
    },
    logoutText: {
        flexShrink: 1,
        fontSize: 14,
        lineHeight: 21,
        fontWeight: '600',
        color: '#A63D32',
        textAlign: 'center'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6
    },
    footerText: {
        flexShrink: 1,
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
        textAlign: 'center'
    },
    pressed: {
        opacity: 0.7,
    },
});