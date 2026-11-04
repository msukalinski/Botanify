import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from './theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeView from './components/home-view/HomeView';
import Login from './components/home-view/login/Login';

export default function App() {
	return (
		<SafeAreaProvider>
			<View style={styles.app}>
				<StatusBar barStyle='dark-content' />
				{/* <HomeView /> */}
				<Login />
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
