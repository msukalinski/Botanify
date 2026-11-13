import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/HomeScreen";
import CatalogScreen from "../screens/CatalogScreen";
import CreatePlantView from "../components/create-plant-view/CreatePlantView";
import RemindersView from "../components/reminders-view/RemindersView";
import ProfileView from "../components/profile-view/ProfileView";
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
            <Tabs.Screen name="AddPlant" component={CreatePlantView} />
            <Tabs.Screen name="Reminders" component={RemindersView} />
            <Tabs.Screen name="Profile" component={ProfileView} />
        </Tabs.Navigator>
    );
}

