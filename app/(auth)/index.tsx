import AppButton from '@/ui/AppButton'
import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-paper'

const Login = () => {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Image
                    source={require('../../assets/images/police.png')}
                    style={styles.image}
                />
                <Text style={styles.title}>ယာဉ်စည်းကမ်း ထိန်းသိမ်းရေး ပြစ်မှုမှတ်တမ်း (ကရင်ပြည်နယ်)</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        label="အမည်"
                        value={"hello"}
                        onChangeText={() => console.log("hi")}
                        theme={{
                        }}
                        style={{ backgroundColor: '#CCCCFF' }}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <TextInput
                        label="စကားဝှက်"
                        secureTextEntry
                        value={"hello"}
                        onChangeText={() => console.log("hi")}
                        style={{ backgroundColor: '#CCCCFF' }}
                    />
                </View>
                <View>
                    <AppButton
                        label='အကောင့်ဝင်ရန်'
                        onPress={(() => console.log("hello"))}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',  // vertical center
        alignItems: 'center',      // horizontal center
        padding: 20,
    },
    innerContainer: {
        width: '100%',
    },
    image: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 20,
        color: "#000080",
        fontWeight: "500"
    },
    inputWrapper: {
        marginBottom: 15,
    },
})

export default Login
