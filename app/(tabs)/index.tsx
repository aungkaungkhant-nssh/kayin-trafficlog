import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function HomeScreen() {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <AntDesign name="filetext1" size={180} color={theme.colors.primary} />
      <Text style={styles.description}>
        ယာဉ်မောင်းသူ၏ ယာဉ်အမှတ်၊ လိုင်စင်၊ အမည်၊ မှတ်ပုံတင် တို့ဖြင့်
        {'\n'}ပြစ်မှု မှတ်တမ်းများ လွယ်ကူစွာ ရှာဖွေနိုင်ပါသည်။
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // vertical center
    alignItems: 'center',     // horizontal center
    padding: 24,
    backgroundColor: '#fff',
  },
  description: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});
