import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeView from "../components/home-view/HomeView";
import CatalogView from "../components/catalog-view/CatalogView";

export default function RootNavigatior() {
    const Tabs = createBottomTabNavigator();

    return (
        <Tabs.Navigator >
            <Tabs.Screen name="Home" component={HomeView} />
            <Tabs.Screen name="Catalog" component={CatalogView} />
        </Tabs.Navigator>
    );
}