import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from './theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeView from './components/home-view/HomeView';
import Login from './components/login/Login';

export default function App() {
	return (
		<SafeAreaProvider>
			<View style={styles.app}>
				<StatusBar barStyle='dark-content' />
				{/* <HomeView /> */}
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
