import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/HomeScreen";
import CatalogScreen from "../screens/CatalogScreen";
import CreatePlantScreen from "../screens/CreatePlantScreen";
import RemindersScreen from "../screens/RemindersScreen";
import ProfileScreen from "../screens/ProfileScreen";

import getBottomTabOptions from "./bottomTabOptions";


const Tabs = createBottomTabNavigator();

export default function TabsNavigator() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs.Navigator
            screenOptions={({ route }) => getBottomTabOptions(route.name, insets.bottom)}
        >
            <Tabs.Screen name="Home" component={HomeScreen} />
            <Tabs.Screen name="Plants" component={CatalogScreen} />
            <Tabs.Screen name="AddPlant" component={CreatePlantScreen} />
            <Tabs.Screen name="Reminders" component={RemindersScreen} />
            <Tabs.Screen name="Profile" component={ProfileScreen} />
        </Tabs.Navigator>
    );
}

