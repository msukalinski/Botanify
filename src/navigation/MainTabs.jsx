import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeView from "../components/home-view/HomeView";
import CatalogView from "../components/catalog-view/CatalogView";
import CreatePlantView from "../components/create-plant-view/CreatePlantView";
import RemindersView from "../components/reminders-view/RemindersView";
import ProfileView from "../components/profile-view/ProfileView";
import getBottomTabOptions from "./bottomTabOptions";


const Tabs = createBottomTabNavigator();

export default function MainTabs() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs.Navigator
            screenOptions={({ route }) => getBottomTabOptions(route.name, insets.bottom)}
        >
            <Tabs.Screen name="Home" component={HomeView} />
            <Tabs.Screen name="Plants" component={CatalogView} />
            <Tabs.Screen name="AddPlant" component={CreatePlantView} />
            <Tabs.Screen name="Reminders" component={RemindersView} />
            <Tabs.Screen name="Profile" component={ProfileView} />
        </Tabs.Navigator>
    );
}

