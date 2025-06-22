import useLoadSession from '@/hooks/useLoadSession';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import {
  DefaultTheme,
  PaperProvider
} from 'react-native-paper';
import 'react-native-reanimated';

export default function RootLayout() {
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
      <Stack
        screenOptions={{
          headerShown: false,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#000080',
          },
        }}
      >
        {
          !officer ? (
            <Stack.Screen
              name="(auth)"
            />
          ) : (
            <Stack.Screen
              name="(tabs)"
            ></Stack.Screen>
          )
        }

      </Stack>
    </PaperProvider >
  );
}
