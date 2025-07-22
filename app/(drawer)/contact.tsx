
import Header from '@/components/ui/Header';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Contact = () => {
    return (
        <View style={styles.root}>
            <Header title="ဆက်သွယ်ရန်" />
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            <AntDesign name="phone" size={24} color="#000080" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>ခေါ်ဆိုရန်</Text>
                            <Text style={styles.phoneNumber}>0998888888</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="gmail" size={24} color="#000080" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>အီးမေးလ်ပို့ရန်</Text>
                            <Text style={styles.phoneNumber}>ucsh@gmailcom</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            <Entypo name="location-pin" size={24} color="#000080" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>တည်နေရာ</Text>
                            <Text style={styles.location}>ကွန်ပျူတာတက္ကသိုလ်(ဘားအံ) ဘားကပ်စံပြကျေးရွာ၊ ဘားအံမြို့၊ ကရင်ပြည်နယ်</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,

        backgroundColor: '#fff', // Light background
    },
    container: {
        padding: 16,
    },
    text: {
        textAlign: 'justify',
        fontSize: 16,
        lineHeight: 28,
        color: '#333',
        fontFamily: 'Myanmar-Regular', // or your custom Myanmar font
    },
    card: {
        backgroundColor: '#f8f8ff', // light background to contrast navy
        padding: 16,
        borderRadius: 12,
        margin: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#e6e6ff', // light navy background tint
        padding: 12,
        borderRadius: 50,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 14,

        marginBottom: 4,
    },
    phoneNumber: {
        fontSize: 16,
        fontWeight: 'bold',

    },
    location: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Myanmar-Bold', // or your custom Myanmar font
    }
});

export default Contact;
