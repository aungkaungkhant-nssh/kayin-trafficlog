import { AlertModal } from '@/components/ui/AlertModal';
import AppButton from '@/components/ui/AppButton';
import AppTextInput from '@/components/ui/AppTextInput';
import Header from '@/components/ui/Header';
import { useSession } from '@/context/SessionContext';
import { changePassword } from '@/database/officer/auth';
import { changePasswordSchema, ChangePasswordSchemaType } from '@/schema/changePassword.schema';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

const ChangePassword = () => {
    const { officer, loading } = useSession();
    const router = useRouter();
    const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ChangePasswordSchemaType>({
        resolver: zodResolver(changePasswordSchema),
        mode: "onChange",
        defaultValues: {
            userName: "",
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    React.useEffect(() => {
        if (officer?.user_name) {
            setValue("userName", officer.user_name);
        }
    }, [officer, setValue]);


    const onSubmit = async (data: ChangePasswordSchemaType) => {
        if (!officer) return;

        const res = await changePassword({
            userName: data.userName,
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
            officerId: officer.id,
        });

        if (res === true) {
            setIsSuccess(true);
        } else {
            // If old password is incorrect, show error under the input field
            if (res.error === "စကားဝှက်ဟောင်းမှားနေသည်") {
                setError("oldPassword", { message: res.error });
            } else {
            }
        }
    };
    return (
        <View style={{ flex: 1 }}>
            <Header
                title='ပရိုဖိုင်ပြောင်းခြင်း'
            />
            <AlertModal
                visible={isSuccess}
                onCancel={() => {
                    reset(
                        {
                            oldPassword: '',
                            newPassword: '',
                            confirmNewPassword: '',
                        }
                    )
                    setIsSuccess(false)
                }}
                onConfirm={() => {
                    reset(
                        {
                            oldPassword: '',
                            newPassword: '',
                            confirmNewPassword: '',
                        }
                    )
                    router.push("/(tabs)");
                    setIsSuccess(false)
                }}
                message="စကားဝှက်ပြောင်းခြင်း‌ အောင်မြင်ပါသည်။"
                confirmText='မူလစာမျက်နှာ'
                cancelText='ပိတ်မည်။'
                icon={<MaterialIcons name="check-circle" size={70} color="#4CAF50" />}
            />
            <View style={{ padding: 20 }}>
                {/* Username Change Section */}
                <View style={{
                    backgroundColor: '#f0f8ff',
                    borderRadius: 8,
                    padding: 15,
                    marginBottom: 30,
                    borderWidth: 1,
                    borderColor: '#a0c4ff'
                }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#1e40af' }}>
                        အသုံးပြုသူအမည် ပြောင်းမည်
                    </Text>
                    <Controller
                        control={control}
                        name="userName"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="အသုံးပြုသူအမည်"
                                value={value}
                                onChangeText={onChange}
                                multiline={true}
                            />
                        )}
                    />
                    {errors.userName && (
                        <Text style={{ color: 'red', marginTop: 5 }}>{errors.userName.message}</Text>
                    )}
                </View>

                {/* Password Change Section */}
                <View style={{
                    backgroundColor: '#fff0f0',
                    borderRadius: 8,
                    padding: 15,
                    borderWidth: 1,
                    borderColor: '#ff7f7f'
                }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#b91c1c' }}>
                        စကားဝှက်ပြောင်းမည်
                    </Text>

                    <Controller
                        control={control}
                        name="oldPassword"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="စကားဝှက်ဟောင်း"
                                value={value}
                                onChangeText={onChange}
                                multiline={true}
                            />
                        )}
                    />
                    {errors.oldPassword && (
                        <Text style={{ color: 'red', marginTop: 5 }}>{errors.oldPassword.message}</Text>
                    )}

                    <Controller
                        control={control}
                        name="newPassword"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="စကားဝှက်အသစ်"
                                value={value}
                                onChangeText={onChange}
                                multiline={true}
                                style={{ marginTop: 10 }}
                            />
                        )}
                    />
                    {errors.newPassword && (
                        <Text style={{ color: 'red', marginTop: 5 }}>{errors.newPassword.message}</Text>
                    )}

                    <Controller
                        control={control}
                        name="confirmNewPassword"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="အတည်ပြုစကားဝှက်"
                                value={value}
                                onChangeText={onChange}
                                multiline={true}
                                style={{ marginTop: 10 }}
                            />
                        )}
                    />
                    {errors.confirmNewPassword && (
                        <Text style={{ color: 'red', marginTop: 5 }}>{errors.confirmNewPassword.message}</Text>
                    )}

                    <View style={{ marginTop: 20 }}>
                        <AppButton
                            label="အတည်ပြုမည်။"
                            onPress={handleSubmit(onSubmit)}
                            loading={isSubmitting}
                        />
                    </View>
                </View>
            </View>


        </View>
    )
}

export default ChangePassword