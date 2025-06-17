import { loginUser } from "@/database/loginUser";
import { loginSchema, LoginSchemaType } from "@/schema/login.schema";
import AppButton from "@/ui/AppButton";
import AppTextInput from "@/ui/AppTextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";

const Login = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            name: '',
            password: '',
        }
    });

    const onSubmit = async (data: LoginSchemaType) => {
        const res = await loginUser(data);
        console.log(res)
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <Image
                        source={require('../../assets/images/police.png')}
                        style={styles.image}
                    />
                    <Text style={styles.title}>ယာဉ်စည်းကမ်း ထိန်းသိမ်းရေး ပြစ်မှုမှတ်တမ်း (ကရင်ပြည်နယ်)</Text>

                    {/* Name input */}
                    <View style={styles.inputWrapper}>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    label="အမည်"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        {errors.name && (
                            <Text style={styles.errorText}>{errors.name.message}</Text>
                        )}
                    </View>

                    {/* Password input */}
                    <View style={styles.inputWrapper}>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    label="စကားဝှက်"
                                    isPassword
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        {errors.password && (
                            <Text style={styles.errorText}>{errors.password.message}</Text>
                        )}
                    </View>

                    <View>
                        <AppButton
                            label='အကောင့်ဝင်ရန်'
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
                </View>
            </View>

        </KeyboardAvoidingView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-around",  // vertical center
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
    errorText: {
        color: "red",
        marginTop: 4,
    },
})

export default Login;

