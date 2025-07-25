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
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordSchemaType>({
        resolver: zodResolver(changePasswordSchema),
        mode: "onChange",
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    const onSubmit = async (data: ChangePasswordSchemaType) => {
        if (!officer) return;

        const res = await changePassword({
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
                title='စကားဝှက် ပြောင်းခြင်း'
            />
            <AlertModal
                visible={isSuccess}
                onCancel={() => {
                    setIsSuccess(false)
                }}
                onConfirm={() => {
                    router.push("/(tabs)");
                    setIsSuccess(false)
                }}
                message="စကားဝှက်ပြောင်းခြင်း‌ အောင်မြင်ပါသည်။"
                confirmText='မူလစာမျက်နှာ'
                cancelText='ပယ်ဖျတ်မည်'
                icon={<MaterialIcons name="check-circle" size={70} color="#4CAF50" />}
            />
            <View style={{ padding: 20 }}>
                <View style={{ marginBottom: 10 }}>
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
                        <Text style={{ color: "red" }}>{errors.oldPassword.message}</Text>
                    )}
                </View>

                {/* New Password */}
                <View style={{ marginBottom: 10 }}>
                    <Controller
                        control={control}
                        name="newPassword"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="စကားဝှက်အသစ်"
                                value={value}
                                onChangeText={onChange}
                                multiline={true}
                            />
                        )}
                    />
                    {errors.newPassword && (
                        <Text style={{ color: "red" }}>{errors.newPassword.message}</Text>
                    )}
                </View>

                {/* Confirm New Password */}
                <View style={{ marginBottom: 10 }}>
                    <Controller
                        control={control}
                        name="confirmNewPassword"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="အတည်ပြုစကားဝှက်"
                                value={value}
                                onChangeText={onChange}
                                multiline={true}
                            />
                        )}
                    />
                    {errors.confirmNewPassword && (
                        <Text style={{ color: "red" }}>{errors.confirmNewPassword.message}</Text>
                    )}
                </View>

                <View >
                    <AppButton
                        label='အတည်ပြုမည်။'
                        onPress={handleSubmit(onSubmit)}
                        loading={isSubmitting}
                    />
                </View>
            </View>

        </View>
    )
}

export default ChangePassword