import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";
import Ionicons from "@react-native-vector-icons/ionicons";

const tabConfig = {
    Home: { label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    Plants: { label: 'Plants', icon: 'leaf-outline', activeIcon: 'leaf' },
    AddPlant: { label: 'Add', icon: 'add', activeIcon: 'add' },
    Reminders: { label: 'Reminders', icon: 'notifications-outline', activeIcon: 'notifications' },
    Profile: { label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
}

export default function getBottomTabOptions(routeName, bottomInset = 0) {
    const tab = tabConfig[routeName] || {
        label: routeName,
        icon: 'ellipse-outline',
        activeIcon: 'ellipse',
    };
    const bottomPadding = Math.max(bottomInset, 12);
    const isAddTab = routeName === 'AddPlant';

    return {
        headerShown: false,
        sceneStyle: styles.scene,
        tabBarActiveTintColor: colors.primaryGreen,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarLabelPosition: 'below-icon',
        tabBarHideOnKeyboard: true,
        tabBarAccessibilityLabel: tab.label,
        tabBarStyle: [
            styles.tabBar,
            {
                height: 64 + bottomPadding,
                paddingBottom: bottomPadding,
            },
        ],
        tabBarItemStyle: styles.item,
        tabBarIconStyle: styles.icon,
        tabBarLabel: ({ focused, color }) => (
            <Text
                style={[styles.label, focused && styles.activeLabel, { color }]}
                numberOfLines={1}
            >
                {tab.label}
            </Text>
        ),
        tabBarIcon: ({ focused, color }) => (
            isAddTab ? (
                <View
                    style={[styles.addIcon, focused && styles.addIconActive]}
                    accessible={false}
                >
                    <Ionicons name="add" size={30} color="#FFFFFF" />
                </View>
            ) : (
                <Ionicons
                    name={focused ? tab.activeIcon : tab.icon}
                    size={24}
                    color={color}
                />
            )
        ),
    };
}

const styles = StyleSheet.create({
    scene: {
        backgroundColor: colors.screenBackground,
    },
    tabBar: {
        backgroundColor: '#FCFDF9',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 8,
        paddingHorizontal: 8,
        overflow: 'visible',
        elevation: 0,
        shadowColor: '#223D23',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    item: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    icon: {
        width: 54,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
    },
    label: {
        fontSize: 10,
        lineHeight: 14,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 4,
    },
    activeLabel: {
        fontWeight: '700',
    },
    addIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 3,
        borderColor: '#FCFDF9',
        backgroundColor: '#7B9D66',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateY: -10 }],
    },
    addIconActive: {
        backgroundColor: colors.primaryGreen,
    },
});