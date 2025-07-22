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
import { Image, View } from 'react-native';
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
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 17,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontFamily: 'Myanmar-Bold',
          },
          tabBarActiveTintColor: theme.colors.primary,
          headerShown: true,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: [
            {
              height: 70,
              paddingBottom: 10,
              paddingTop: 10,
            },
            route.name === 'index' && { display: 'none' }, // 👈 Hide tab bar on index
          ],
        })}
      >
        887563690
        776224007
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: () => (
              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Image
                  source={require('../../assets/images/police.png')}
                  style={{ width: 40, height: 40, resizeMode: 'contain' }}
                />
              </View>
            ),
            title: '',
            tabBarLabel: 'မူလ',
            headerTitleAlign: 'center',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={22} name="house.fill" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="records"
          options={{
            title: 'ဖိုင်ထုတ်',
            tabBarLabel: 'ဖိုင်ထုတ်',
            headerLeft: () => <LeftHeader />,
            tabBarIcon: ({ color }) => (
              <AntDesign name="filetext1" size={22} color={color} />
            ),
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
                  position: 'absolute',
                  bottom: '10%',
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <AntDesign name="search1" size={22} color="#fff" />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="import"
          options={{
            title: 'ဒေတာဖိုင်ထည့်ပါ',
            tabBarLabel: 'ဖိုင်ထည့်',
            headerLeft: () => <LeftHeader />,
            tabBarIcon: ({ color }) => (
              <AntDesign name="filetext1" size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="logout"
          options={{
            title: 'ထွက်ရန်',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="logout" size={22} color={color} />
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
