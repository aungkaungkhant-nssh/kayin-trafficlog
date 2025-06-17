import { useColorScheme } from '@/hooks/useColorScheme';
import useLoadSession from '@/hooks/useLoadSession';
import AppNavigator from '@/navigator/AppNavigator';
import AuthNavigator from '@/navigator/AuthNavigator';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import {
  DefaultTheme,
  PaperProvider
} from 'react-native-paper';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { officer, loading } = useLoadSession();

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!fontsLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#000080',
    },
  };

  return (
    <PaperProvider theme={customTheme}>
      {
        !officer ? (
          <AuthNavigator />
        ) : (
          <AppNavigator />
        )
      }
    </PaperProvider>
  );
}
