import { createStackNavigator } from "@react-navigation/stack";
import TabsNavigator from "./TabsNavigator";
import DetailsView from "../components/details-view/DetailsView";
import EditPlantView from "../components/edit-plant-view/EditPlantView";
import { Platform } from "react-native";

const Stack = createStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            cardStyle: Platform.OS === 'web' ? { flex: 1 } : undefined
        }}>
            <Stack.Screen name="MainStack" component={TabsNavigator} />
            <Stack.Screen name="PlantDetails" component={DetailsView} />
            <Stack.Screen name="EditPlant" component={EditPlantView} />
        </Stack.Navigator>
    );
}