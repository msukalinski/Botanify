import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from './theme';
import HomeView from './components/home-view/HomeView';
import Login from './components/login/Login';
import Register from './components/register/Register';
import CatalogView from './components/catalog-view/CatalogView';
import DetailsView from './components/details-view/DetailsView';
import CreatePlantView from './components/create-plant-view/CreatePlantView';
import EditPlantView from './components/edit-plant-view/EditPlantView';
import RemindersView from './components/reminders-view/RemindersView';
import ProfileView from './components/profile-view/ProfileView';
import LoadingIndicator from './components/loading-indicator/LoadingIndicator';
import ErrorMessage from './components/error-message/ErrorMessage';
import EmptyState from './components/empty-state/EmptyState';
import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './navigation/MainTabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
	return (
		<SafeAreaProvider>
			<StatusBar barStyle='dark-content' />
			<NavigationContainer >
				<MainTabs />
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	app: {
		flex: 1,
		backgroundColor: colors.backgroundColor,
	},
});
