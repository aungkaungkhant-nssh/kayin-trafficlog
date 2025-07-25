
import Header from '@/components/ui/Header';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const About = () => {
    return (
        <View style={styles.root}>
            <Header title="အကြောင်းအရာ" />
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.card}>
                    <Text style={styles.text}>
                        ယာဉ်စည်းကမ်း ထိန်းသိမ်းရေး ပြစ်မှုမှတ်တမ်း (ကရင်ပြည်နယ်) အပလီကေးရှင်းသည် ဒေသတွင်းရှိ စည်းကမ်းထိန်းသိမ်းရေး
                        လုပ်ငန်းများဆောင်ရွက်ရာတွင် အချိန်မရွေး၊ နေရာမရွေး မှတ်တမ်းများ စီမံခန့်ခွဲနိုင်စေမည့်
                        မိုဘိုင်းအပလီကေးရှင်းတစ်ခုဖြစ်ပါသည်။ မှတ်တမ်းများရှာဖွေခြင်း၊ မှတ်တမ်းအသစ်များထည့်ခြင်း၊
                        မှတ်တမ်းဖိုင်များ ထုတ်ယူသိမ်းဆည်းခြင်း၊ မှတ်တမ်းဖိုင်များအား မိုဘိုင်းအပလီကေးရှင်း ဒေတာဘေ့စနစ် အတွင်း
                        သိမ်းဆည်းခြင်းများကို လုပ်ဆောင်နိုင်ပါသည်။{'\n\n'}
                        ကရင်ပြည်နယ် အစိုးရအဖွဲ့ ဝန်ကြီးချုပ်၏လမ်းညွှန်မှု၊ သိပ္ပံနှင့် နည်းပညာဝန်ကြီးဌာန၊
                        အဆင့်မြင့်သိပ္ပံနှင့်နည်းပညာဦးစီးဌာန၊ ကွန်ပျူတာတက္ကသိုလ်(ဘားအံ)မှ ပါမောက္ခချုပ်၊
                        ကွန်ပျူတာသိပ္ပမဟာဌာန ဌာနမှူး၊ ကြီးကြပ်ဆရာမ တို့၏ ပံ့ပိုးမှုများဖြင့်
                        ကွန်ပျူတာသိပ္ပံအထူးပြု ပဉ္စမနှစ်ကျောင်းသားမှ ရေးသားခဲ့ပါသည်။{'\n\n'}
                        ယာဉ်စည်းကမ်း လမ်းစည်းကမ်း ထိန်းသိမ်းရေးကော်မတီ၏ စည်းကမ်းထိန်းသိမ်းရေး
                        လုပ်ငန်းများ ဆောင်ရွက်ရာတွင် မိုဘိုင်းဖုန်းများ အသုံးပြု၍ မှတ်တမ်းများ ရှာဖွေစစ်ဆေးမှုလုပ်ငန်းများတွင်
                        အဆင့်မြှင့်တင်ဆောင်ရွက်ရန် ရည်ရွယ်ချက်ဖြင့် ရေးသားခဲ့ပါသည်။
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#f5f7fa', // Light gray background
    },
    scroll: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4, // Android shadow
    },
    text: {
        fontSize: 16,
        lineHeight: 28,
        color: '#333',
        textAlign: 'justify',
        fontFamily: 'Myanmar-Regular', // Replace with correct font if needed
    },
});

export default About;
