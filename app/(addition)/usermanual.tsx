import Header from '@/components/ui/Header';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const manuals = [
  { id: 1, title: "အကောင့်၀င်ခြင်း။", file: "https://drive.google.com/file/d/1uCgcWv0sFsseStfBmIzUllJxvtQkO4xn/view?usp=sharing" },
  { id: 2, title: "အက်ပလီကေးရှင်း၏ လုပ်ဆောင်နိုင်သော အချက်များ", file: "https://drive.google.com/file/d/1YzdM_Q8x7Uv8z1L_ldYK9yoVGAzy1BsB/view?usp=sharing" },
  { id: 3, title: "မှတ်တမ်းများရှာဖွေခြင်း။", file: "https://drive.google.com/file/d/1MgYwQ37_qQdTEjlo4bDDzJFQa4KjCc69/view?usp=sharing" },
  { id: 4, title: "ပြစ်မှုမှတ်တမ်းအသစ်ထည့်ခြင်း။", file: "https://drive.google.com/file/d/1dqzvhCQmN55D28YqWtxjLqy2AqU7_wx8/view?usp=sharing" },
  { id: 5, title: "ပြစ်မှုမှတ်တမ်း အားသေးစိတ် ကြည့်ခြင်း နှင့် တရားစွဲမှတ် တမ်းအားထည့်သွင်းခြင်း။", file: "https://drive.google.com/file/d/1KtPyLMwZf4iHE-rdvZceb8nD0ulh_sTq/view?usp=sharing" },
  { id: 6, title: "ပြစ်မှု နောက်တစ်ကြိမ် ထပ်ထည့်ခြင်း။", file: "https://drive.google.com/file/d/1jhHkuiZ7uyCNyyVVb9utCdAPkNehVW88/view?usp=sharing" },
  { id: 7, title: "ဖိုင်ထုတ်ခြင်း။", file: "https://drive.google.com/file/d/1TQXntUI4lw-DCkziAkXmf4f1QGTRmS6j/view?usp=sharing" },
  { id: 8, title: "ဖိုင်ထည့်ခြင်း။", file: "https://drive.google.com/file/d/1-IOzYvnZEGAVVyO5nt0eBvCcDl0h_AsT/view?usp=sharing" },
  { id: 9, title: "မှတ်တမ်းဟောင်းများ ဖယ်ထုတ်ခြင်း။", file: "https://drive.google.com/file/d/10B1uKa_pJqm6CnQr-6Q67c4pYKWx8LY1/view?usp=sharing" },
  { id: 10, title: "ပရိုဖိုင်ပြောင်းခြင်း။", file: "https://drive.google.com/file/d/1BQ3upB78oW8LkOTJYGZM5OKRayefI-Jk/view?usp=sharing" },
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
