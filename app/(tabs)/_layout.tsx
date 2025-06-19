import { HapticTab } from '@/components/HapticTab';
import { AlertModal } from '@/components/ui/AlertModal';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { logoutOfficer } from '@/database/auth';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import { PaperProvider, useTheme } from 'react-native-paper';


export default function TabLayout() {
  const theme = useTheme();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLogoutVisible(false);
    const res = await logoutOfficer();
    if (res.success) {
      router.replace("/(auth)");
    }
  };
  return (
    <PaperProvider>
      <AlertModal
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={handleLogout}
      />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="record"
          options={{
            title: 'Record',
            tabBarIcon: ({ color }) => <AntDesign name="filetext1" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="logout"
          options={{
            title: 'Logout',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="logout" size={28} color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setLogoutVisible(true);
            },
          }}
        />
      </Tabs>
    </PaperProvider>

  );
}
