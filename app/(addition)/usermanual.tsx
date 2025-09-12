import Header from '@/components/ui/Header';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const manuals = [
  { id: 1, title: "အကောင့်၀င်ခြင်း။", file: "https://drive.google.com/file/d/1ze6mF8AACKPplYMpfKQr62EvJ9oVTCAH/view?usp=sharing" },
  { id: 2, title: "အက်ပလီကေးရှင်း၏ လုပ်ဆောင်နိုင်သော အချက်များ", file: "https://drive.google.com/file/d/1LdsysJ3yxG-nQb7FMdLbU7zCj_p98rdS/view?usp=sharing" },
  { id: 3, title: "မှတ်တမ်းများရှာဖွေခြင်း။", file: "https://drive.google.com/file/d/1EWRlBUL4mGEk5CYQE53rhPBTYSndHEab/view?usp=sharing" },
  { id: 4, title: "ပြစ်မှုမှတ်တမ်းအသစ်ထည့်ခြင်း။", file: "https://drive.google.com/file/d/1p2838RsyHiC6W0_8ptKbg4Y3wY1PtsWZ/view?usp=sharing" },
  { id: 5, title: "ပြစ်မှုမှတ်တမ်း အားသေးစိတ် ကြည့်ခြင်း နှင့် တရားစွဲမှတ် တမ်းအားထည့်သွင်းခြင်း။", file: "https://drive.google.com/file/d/1idcU-0E5AakFi-0zNSu0-RDjVlQNcFgC/view?usp=sharing" },
  { id: 6, title: "ပြစ်မှု နောက်တစ်ကြိမ် ထပ်ထည့်ခြင်း။", file: "https://drive.google.com/file/d/1M2WuNzDdlZ-my2aNNHIXUZllz41KZGC6/view?usp=sharing" },
  { id: 7, title: "ဖိုင်ထုတ်ခြင်း။", file: "https://drive.google.com/file/d/1N1wZJxtrzr0e_V3XPVO91I9cZWg5QUX7/view?usp=sharing" },
  { id: 8, title: "ဖိုင်ထည့်ခြင်း။", file: "https://drive.google.com/file/d/1-St8FurrGc92vTrAUtmH2L016UPZd8rj/view?usp=sharing" },
  { id: 9, title: "မှတ်တမ်းဟောင်းများ ဖယ်ထုတ်ခြင်း။", file: "https://drive.google.com/file/d/1yj7AnV99XE-fnAJg4SODo0_QKAcOWhq2/view?usp=sharing" },
  { id: 10, title: "ပရိုဖိုင်ပြောင်းခြင်း။", file: "https://drive.google.com/file/d/1VcfiuQAruf6sIEgyRkFCMN0fEkbmApDr/view?usp=sharing" },
];

const UserManual = () => {
  const handleDownload = (fileName: string) => {
    Linking.openURL(fileName).catch(() =>
      Alert.alert("Error", "Unable to open PDF")
    );
  };

  return (
    <View style={styles.root}>
      <Header title="အသုံးပြုပုံ" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {manuals.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleDownload(item.file)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <AntDesign name="right" size={20} color="#000080" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default UserManual;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f4f6fb",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  container: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    color: "#000",
    flex: 1,
    fontFamily: "Myanmar-Regular",
  },
});
