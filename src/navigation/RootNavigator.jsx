import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import TabsNavigator from "./TabsNavigator";
import DetailsScreen from "../screens/DetailsScreen";
import EditPlantScreen from "../screens/EditPlantScreen";
import useUser from "../hooks/useUser";
import LoadingIndicator from "../components/loading-indicator/LoadingIndicator";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createStackNavigator();

export default function RootNavigator() {
    const { user, initializing } = useUser();

    if (initializing) {
        return <LoadingIndicator />
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: Platform.OS === 'web'
                    ? { flex: 1, height: '100%', minHeight: 0 }
                    : undefined,
            }}
        >
            {user ? (
                <>
                    <Stack.Screen name="MainStack" component={TabsNavigator} />
                    <Stack.Screen name="PlantDetails" component={DetailsScreen} />
                    <Stack.Screen name="EditPlant" component={EditPlantScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}