import AppButton from "@/components/ui/AppButton";
import AppTextInput from "@/components/ui/AppTextInput";
import { loginOfficer } from "@/database/officer/auth";
import { loginSchema, LoginSchemaType } from "@/schema/login.schema";
import globalStyles from "@/styles/globalStyles";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useRouter } from 'expo-router';
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
const Login = () => {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            name: '',
            password: '',
        }
    });

    const onSubmit = async (data: LoginSchemaType) => {
        const trimmedData = {
            user_name: data.name.trim(),
            password: data.password.trim(),
        };

        const res = await loginOfficer(trimmedData);

        if (!res.success) {
            setError("root", {
                type: "manual",
                message: res.error,
            });
            return;
        }
        clearErrors("root");
        router.replace('/(tabs)');

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
                    {errors.root && (
                        <Text style={{ ...globalStyles.errorText, marginVertical: 10 }}>
                            {errors.root.message}
                        </Text>
                    )}
                    {/* Name input */}
                    <View style={globalStyles.inputWrapper}>
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
                            <Text style={globalStyles.errorText}>{errors.name.message}</Text>
                        )}
                    </View>

                    {/* Password input */}
                    <View style={globalStyles.inputWrapper}>
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
                            <Text style={globalStyles.errorText}>{errors.password.message}</Text>
                        )}
                    </View>

                    <View>
                        <AppButton
                            label='အကောင့်ဝင်ရန်'
                            onPress={handleSubmit(onSubmit)}
                            loading={isSubmitting}
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
})

export default Login;

