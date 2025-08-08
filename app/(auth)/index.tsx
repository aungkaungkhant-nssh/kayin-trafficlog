import AppButton from "@/components/ui/AppButton";
import AppTextInput from "@/components/ui/AppTextInput";
import { loginOfficer } from "@/database/officer/auth";
import { setUpTable } from "@/database/seed/setUpTable";
import { loginSchema, LoginSchemaType } from "@/schema/login.schema";
import globalStyles from "@/styles/globalStyles";
import Entypo from "@expo/vector-icons/Entypo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Drawer } from "react-native-paper";

const Login = () => {
    const [open, setOpen] = useState(false);
    const [dbReady, setDbReady] = useState(false);
    const [dbError, setDbError] = useState<string | null>(null);

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
            name: "",
            password: "",
        },
    });

    useEffect(() => {
        const init = async () => {
            try {
                await setUpTable();
                setDbReady(true);
            } catch (err) {
                console.error("Error setting up DB:", err);
                setDbError("Database initialization failed. Please restart the app.");
            }
        };
        init();
    }, []);

    const onSubmit = async (data: LoginSchemaType) => {
        if (!dbReady) {
            setError("root", {
                type: "manual",
                message: "Database is still initializing. Please wait...",
            });
            return;
        }

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
        router.replace("/(tabs)");
    };

    if (!dbReady && !dbError) {
        // Show loading screen until DB setup is done
        return (
            <View style={styles.loadingScreen}>
                <ActivityIndicator size="large" color="#000080" />
                <Text style={styles.loadingText}>Initializing database...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            {open && (
                <>
                    <Pressable
                        style={styles.overlay}
                        onPress={() => setOpen(false)}
                    />
                    <Drawer.Section title="" style={styles.drawerContainer}>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity
                                onPress={() => router.push("/(addition)/about")}
                                style={styles.drawerItem}
                                activeOpacity={0.7}
                            >
                                <Entypo name="text-document" size={20} color="#000080" />
                                <Text style={styles.drawerLabel}>အကြောင်းအရာ</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push("/(addition)/contact")}
                                style={styles.drawerItem}
                                activeOpacity={0.7}
                            >
                                <Entypo name="phone" size={20} color="#000080" />
                                <Text style={styles.drawerLabel}>ဆက်သွယ်ရန်</Text>
                            </TouchableOpacity>
                        </View>
                    </Drawer.Section>
                </>
            )}

            <View style={styles.loginHeader}>
                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => setOpen(true)}>
                    <Entypo name="menu" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <Image
                        source={require("../../assets/images/police.png")}
                        style={styles.image}
                    />
                    <Text style={styles.title}>
                        ယာဉ်စည်းကမ်း ထိန်းသိမ်းရေး ပြစ်မှုမှတ်တမ်း (ကရင်ပြည်နယ်)
                    </Text>

                    {errors.root && (
                        <Text style={{ ...globalStyles.errorText, marginVertical: 10 }}>
                            {errors.root.message}
                        </Text>
                    )}
                    {dbError && (
                        <Text style={{ ...globalStyles.errorText, marginVertical: 10 }}>
                            {dbError}
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
                                    editable={dbReady}
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
                                    editable={dbReady}
                                />
                            )}
                        />
                        {errors.password && (
                            <Text style={globalStyles.errorText}>{errors.password.message}</Text>
                        )}
                    </View>

                    <View>
                        <AppButton
                            label="အကောင့်ဝင်ရန်"
                            onPress={handleSubmit(onSubmit)}
                            loading={isSubmitting}
                            disabled={!dbReady}
                        />
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 999,
    },
    drawerContainer: {
        position: "absolute",
        backgroundColor: "white",
        zIndex: 1000,
        top: 0,
        bottom: -100,
        left: 0,
        width: 250,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        paddingHorizontal: 10,
        paddingTop: 30,
    },
    btnContainer: {
        gap: 12,
        marginVertical: 25,
    },
    drawerItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f4f6ff",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    drawerLabel: {
        fontSize: 16,
        marginLeft: 12,
        color: "#000080",
        fontWeight: "500",
    },
    container: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        padding: 20,
    },
    loginHeader: {
        backgroundColor: "#000080",
        padding: 23,
    },
    innerContainer: {
        width: "100%",
    },
    image: {
        width: 100,
        height: 100,
        alignSelf: "center",
        marginBottom: 20,
    },
    title: {
        textAlign: "center",
        fontSize: 18,
        marginBottom: 20,
        color: "#000080",
        fontWeight: "500",
    },
    loadingScreen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#000080",
    },
});

export default Login;
