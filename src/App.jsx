import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from './theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeView from './components/home-view/HomeView';
import Login from './components/login/Login';
import Register from './components/register/Register';
import CatalogView from './components/catalog-view/CatalogView';
import DetailsView from './components/details-view/DetailsView';
import CreatePlantView from './components/create-plant-view/CreatePlantView';
import EditPlantView from './components/edit-plant-view/EditPlantView';

export default function App() {
	return (
		<SafeAreaProvider>
			<View style={styles.app}>
				<StatusBar barStyle='dark-content' />
				{/* <HomeView /> */}
				<CatalogView />
				{/* <DetailsView /> */}
				{/* <CreatePlantView /> */}
				{/* <EditPlantView /> */}
				{/* <Login /> */}
				{/* <Register /> */}
			</View>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	app: {
		flex: 1,
		backgroundColor: colors.backgroundColor,
	},
});
