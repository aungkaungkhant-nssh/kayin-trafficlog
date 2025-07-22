import { AlertModal } from '@/components/ui/AlertModal';
import { logoutOfficer } from '@/database/officer/auth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const handleLogout = async () => {
    setLogoutVisible(false);
    const res = await logoutOfficer();
    if (res.success) {
      router.replace("/(auth)");
    }
  };

  return (
    <View style={styles.container}>
      <AlertModal
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={handleLogout}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ယာဉ်စည်းကမ်း ထိန်းသိမ်းရေး ပြစ်မှုမှတ်တမ်း</Text>
        <Text style={styles.titleDescription}>(ကရင်ပြည်နယ်)</Text>
      </View>

      <View style={styles.routeContainer}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/search")} style={[styles.button, { backgroundColor: '#cce0ff' }]}>
          <Image
            source={require('../../assets/images/search.png')}
            style={styles.image}
          />
          <Text style={styles.buttonText}>ရှာဖွေခြင်း</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(tabs)/records")} style={[styles.button, { backgroundColor: '#cce0ff' }]}>
          <Image
            source={require('../../assets/images/export.png')}
            style={styles.image}
          />
          <Text style={styles.buttonText}>ထုတ်ယူခြင်း</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(tabs)/import")} style={[styles.button, { backgroundColor: '#cce0ff' }]}>
          <Image
            source={require('../../assets/images/import.png')}
            style={styles.image}
          />
          <Text style={styles.buttonText}>ထည့်သွင်းခြင်း</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setLogoutVisible(true)} style={[styles.button, { backgroundColor: '#cce0ff' }]}>
          <Image
            source={require('../../assets/images/logout.png')}
            style={styles.image}
          />
          <Text style={styles.buttonText}>ထွက်ရန်</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 35,
    height: 35
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleContainer: {
    // alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Myanmar-Bold',
  },
  titleDescription: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Myanmar-Bold',
  },
  routeContainer: {
    paddingHorizontal: 20,
    width: '100%',          // full width container so buttons can fill it
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#000080',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#000080',
    fontSize: 16,
    fontFamily: 'Myanmar-Bold',
    marginLeft: 12,
  },
});
