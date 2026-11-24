import { Platform, StatusBar, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from './navigation/RootNavigator';
import UserProvider from './contexts/UserProvider';

export default function App() {
	const { height } = useWindowDimensions
	return (
		<SafeAreaProvider style={Platform.OS === 'web'
			? { flex: 1, height, maxHeight: height, minHeight: 0, overflow: 'hidden' }
			: { flex: 1 }
		}>
			<StatusBar barStyle='dark-content' />

			<UserProvider>
				<NavigationContainer >
					<RootNavigator />
				</NavigationContainer>

			</UserProvider>

		</SafeAreaProvider>
	);
}