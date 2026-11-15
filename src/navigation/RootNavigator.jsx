import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import TabsNavigator from "./TabsNavigator";
import DetailsScreen from "../screens/DetailsScreen";
import EditPlantScreen from "../screens/EditPlantScreen";

const Stack = createStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: Platform.OS === 'web'
                    ? { flex: 1 }
                    : undefined,
            }}
        >
            <Stack.Screen name="MainStack" component={TabsNavigator} />
            <Stack.Screen name="PlantDetails" component={DetailsScreen} />
            <Stack.Screen name="EditPlant" component={EditPlantScreen} />
        </Stack.Navigator>
    );
}