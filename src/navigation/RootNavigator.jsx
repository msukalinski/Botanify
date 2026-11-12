import { createStackNavigator } from "@react-navigation/stack";
import TabsNavigator from "./TabsNavigator";
import DetailsView from "../components/details-view/DetailsView";
import EditPlantView from "../components/edit-plant-view/EditPlantView";

const Stack = createStackNavigator();

export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainStack" component={TabsNavigator} />
            <Stack.Screen name="PlantDetails" component={DetailsView} />
            <Stack.Screen name="EditPlant" component={EditPlantView} />
        </Stack.Navigator>
    );
}