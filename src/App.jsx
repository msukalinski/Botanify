import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from './navigation/RootNavigator';
import UserProvider from './contexts/UserProvider';

export default function App() {
	return (
		<SafeAreaProvider>
			<StatusBar barStyle='dark-content' />

			<UserProvider>
				<NavigationContainer >
					<RootNavigator />
				</NavigationContainer>

			</UserProvider>

		</SafeAreaProvider>
	);
}
