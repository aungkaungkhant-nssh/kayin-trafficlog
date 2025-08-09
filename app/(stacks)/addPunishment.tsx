import FirstInfo from '@/components/info/FirstInfo';
import SecondInfo from '@/components/info/SecondInfo';
import ThirdInfo from '@/components/info/ThirdInfo';
import { AlertModal } from '@/components/ui/AlertModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Header from '@/components/ui/Header';
import { useSession } from '@/context/SessionContext';
import { storePunishment } from '@/database/offenderVehicles/offenderVehicles';
import { addPunishmentInfoSchema, AddPunishmentInfoSchemaType } from '@/schema/addPunishmentInfo.schema';
import Step from '@/utils/enum/Step';
import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

const AddPunishment = () => {
    const [currentInfo, setCurrentInfo] = useState<Step>(Step.First);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isConfirm, setIsConfirm] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { officer } = useSession();
    const router = useRouter()
    const {
        watch,
        control,
        handleSubmit,
        setValue,
        trigger,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<AddPunishmentInfoSchemaType>({
        resolver: zodResolver(addPunishmentInfoSchema),
        mode: "onChange",
        defaultValues: {
            name: '',
            father_name: '',
            nrcState: '3',
            nrcTownShip: 'ဘအန',
            nrcType: 'နိုင်',
            nrcNumber: "",
            vehicle_number: '',
            vehicle_categories_id: '',
            vehicle_categories_label: "",
            vehicle_types: "",
            wheel_tax: "",
            vehicle_license_number: "",
            seized_date: "",
            seizure_location: "",
            article_id: "",
            article_label: "",
            committed_id: "",
            committed_label: "",
            fine_amount: "",
            address: "",
            driver_license_number: "",
            seizedItem_id: "",
            seizedItem_label: ""

        }
    });

    const onSubmit = async (data: AddPunishmentInfoSchemaType) => {
        setIsConfirm(false);
        const res = await storePunishment(data, officer.id);
        if (res?.success) {
            setIsSuccess(true)
        } else {
            setError("အမှားတစ်ခုဖြစ်ပွားခဲ့သည်။ ကျေးဇူးပြု၍ ပြန်လည်ကြိုးစားပါ။");
        }
    }

    if (error) {
        return <ErrorMessage message={error} onDismiss={() => setError(null)} />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <Header
                title='ပြစ်မှုထည့်မည်'
            />

            {/* success modal */}
            <AlertModal
                visible={isSuccess}
                onCancel={() => {
                    router.push("/(tabs)/search");
                    setIsSuccess(false)
                }}
                onConfirm={() => {
                    router.push("/(tabs)");
                    setIsSuccess(false)
                }}
                message="မှတ်တမ်း ထည့်ခြင်း အောင်မြင်ပါသည်။"
                confirmText='မူလ စာမျက်နှာ'
                cancelText='ဆက်လက် ရှာဖွေမည် '
                icon={<MaterialIcons name="check-circle" size={70} color="#4CAF50" />}
            />

            {/* confirm modal */}
            <ConfirmModal
                visible={isConfirm}
                onCancel={() => {
                    setIsConfirm(false)
                }}
                onConfirm={async () => {
                    await handleSubmit(onSubmit)()
                }}
                message="အချက်အလက်များ သေချာပါသလား။"
                cancelText='ပြင်ဆင်မည်။'
                icon={<MaterialIcons name="help-outline" size={40} color="#000080" />}
                data={getValues()}
            />

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    {
                        currentInfo === Step.First && (
                            <FirstInfo
                                control={control}
                                watch={watch}
                                setCurrentInfo={setCurrentInfo}
                                trigger={trigger}
                                errors={errors}
                                setValue={setValue}
                            />
                        )
                    }

                    {
                        currentInfo === Step.Second && (
                            <SecondInfo
                                control={control}
                                watch={watch}
                                setCurrentInfo={setCurrentInfo}
                                trigger={trigger}
                                errors={errors}
                                setValue={setValue}
                            />
                        )
                    }

                    {
                        currentInfo === Step.Third && (
                            <ThirdInfo
                                setCurrentInfo={setCurrentInfo}
                                control={control}
                                watch={watch}
                                // onError={onError}
                                setIsConfirm={setIsConfirm}
                                setValue={setValue}
                                getValues={getValues}
                                trigger={trigger}
                                errors={errors}
                            />
                        )
                    }



                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default AddPunishment;

const styles = StyleSheet.create({
    inputWrapper: {
        marginBottom: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
        width: '100%',   // Full width with padding
        maxWidth: 400,   // Max width for better design
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f2f5',
        justifyContent: 'center',
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        color: "red"
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    dropDownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flexWrap: 'wrap',
    },
    noticeWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 18,
    },
    icon: {
        marginRight: 6,
        marginTop: 2,
    },
});
