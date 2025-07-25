import { SessionProvider, useSession } from '@/context/SessionContext'; // Adjust path as needed
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Myanmar-Regular': require('../assets/fonts/NotoSansMyanmar-Regular.ttf'),
    'Myanmar-Bold': require('../assets/fonts/NotoSansMyanmar-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}

function AppContent() {

  const { officer, loading } = useSession();

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#000080',
    },
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <PaperProvider theme={customTheme}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#000080',
          },
          headerShown: false,  // default: hide header for all screens
        }}
      >
        {!officer ? (
          <Stack.Screen
            name="(auth)"
          // options={{
          //   headerShown: true,
          //   title: '',
          //   headerLeft: () => (
          //     <TouchableOpacity onPress={() => setOpen(true)} >
          //       <Entypo name="menu" size={24} color="#fff" />
          //     </TouchableOpacity>
          //   )
          // }}

          />
        ) : (
          <Stack.Screen name="(tabs)" />
        )}
      </Stack>


    </PaperProvider>

  );
}
