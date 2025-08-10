import { SessionProvider, useSession } from '@/context/SessionContext'; // Adjust path as needed
import { setUpTable } from '@/database/seed/setUpTable';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    'Myanmar-Regular': require('../assets/fonts/NotoSansMyanmar-Regular.ttf'),
    'Myanmar-Bold': require('../assets/fonts/NotoSansMyanmar-Bold.ttf'),
  });
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await setUpTable();
        setDbReady(true);
      } catch (err) {
        console.error("Error setting up DB:", err);
        setDbError("Database initialization failed. Please restart the app.");
      }
    };
    init();
  }, []);

  if (!dbReady && !dbError) {
    // Show loading screen until DB setup is done
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#000080" />
        <Text style={styles.loadingText}>Initializing database...</Text>
      </View>
    );
  }


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

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#000080",
  },
});

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
