import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const NotFound = () => {
    return (
        <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundEmoji}>🔍</Text>
            <Text style={styles.notFoundTitle}>မှတ်တမ်းများ မတွေ့ရှိပါ</Text>
            <Text style={styles.notFoundSubtitle}>
                စစ်ထုတ်မှုများကို ပြင်ဆင်ကြည့်ပါ၊ သို့မဟုတ် နောက်မှ ထပ်စစ်ကြည့်ပါ။
            </Text>
        </View>
    )
}

export default NotFound;

const styles = StyleSheet.create({
    notFoundContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
        backgroundColor: '#f8f9fa', // Light background
        borderRadius: 12,
    },
    notFoundEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    notFoundTitle: {
        fontSize: 20,
        fontFamily: 'Myanmar-Bold',
        color: '#343a40',
        marginBottom: 6,
    },
    notFoundSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
    },
});
