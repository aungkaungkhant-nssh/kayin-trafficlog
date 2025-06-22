import { HapticTab } from '@/components/HapticTab';
import LeftHeader from '@/components/header/leftHeader';
import { AlertModal } from '@/components/ui/AlertModal';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { logoutOfficer } from '@/database/officer/auth';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, View } from 'react-native';
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
    <PaperProvider theme={theme}>
      <AlertModal
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={handleLogout}
      />
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 17,
          },
          tabBarActiveTintColor: theme.colors.primary,
          headerShown: true,
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
            title: 'ယာဉ်စည်းကမ်း ထိန်းသိမ်းရေး ပြစ်မှုမှတ်တမ်း (ကရင်ပြည်နယ်)',
            tabBarLabel: 'ပင်မစာမျက်နှာ',
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
          name="search"
          options={{
            title: 'ရှာမည်',
            tabBarLabel: '',
            headerLeft: () => <LeftHeader />,
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  backgroundColor: theme.colors.primary,
                  position: "absolute",
                  bottom: "10%",
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <AntDesign name="search1" size={24} color="#fff" />
              </View>
            )
          }}
        />

        <Tabs.Screen
          name="import"
          options={{
            title: 'Import',
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
