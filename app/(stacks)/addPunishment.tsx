import nrcData from '@/assets/NRC_DATA.json';
import FirstInfo from '@/components/info/FirstInfo';
import SecondInfo from '@/components/info/SecondInfo';
import ThirdInfo from '@/components/info/ThirdInfo';
import { AlertModal } from '@/components/ui/AlertModal';
import Header from '@/components/ui/Header';
import { useSession } from '@/context/SessionContext';
import { storePunishment } from '@/database/offenderVehicles/offenderVehicles';
import { addPunishmentSchema, AddPunishmentSchemaType } from '@/schema/addPunishment.schema';
import Step from '@/utils/enum/Step';
import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

const AddPunishment = () => {
    const [currentInfo, setCurrentInfo] = useState<Step>(Step.First);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const { officer } = useSession();
    const router = useRouter()
    const {
        watch,
        control,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<AddPunishmentSchemaType>({
        resolver: zodResolver(addPunishmentSchema),
        mode: "onChange",
        defaultValues: {
            name: '',
            father_name: '',
            nrcState: '3',
            nrcTownShip: 'ဘအန',
            nrcType: 'နိုင်',
            nrcNumber: "222222",
            vehicle_number: '',
            vehicle_categories_id: '',
            vehicle_types: "",
            wheel_tax: "",
            vehicle_license_number: "",
            seized_date: "",
            seizure_location: "",
            article_id: "",
            committed_id: "",
            fine_amount: "",
            address: "",
            driver_license_number: "",
            seizedItem_id: ""

        }
    });



    const onSubmit = async (data: AddPunishmentSchemaType) => {
        const res = await storePunishment(data, officer.id);
        if (res.success) {
            setModalVisible(true)
        }
    }



    // const onError = (errors: any) => {
    //     console.log("VALIDATION ERRORS", errors);
    // };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <Header
                title='ပြစ်မှုထည့်မည်'
            />
            <AlertModal
                visible={modalVisible}
                onCancel={() => {
                    router.push("/(tabs)");
                    setModalVisible(false)
                }}
                onConfirm={() => {
                    router.push("/(tabs)/search");
                    setModalVisible(false)
                }}
                message="ပြစ်မှု ထည့်ခြင်း အောင်မြင်ပါသည်။"
                confirmText='ဆက်လက် ရှာဖွေမည်'
                cancelText='မူလ စာမျက်နှာ'
                icon={<MaterialIcons name="check-circle" size={70} color="#4CAF50" />}
            />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    {/* <View style={styles.noticeWrapper}>
                        <Text style={styles.noticeText}>

                        </Text>
                    </View> */}
                    {
                        currentInfo === Step.First && (
                            <FirstInfo
                                control={control}
                                watch={watch}
                                setCurrentInfo={setCurrentInfo}
                                trigger={trigger}
                                errors={errors}
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
                            />
                        )
                    }

                    {
                        currentInfo === Step.Third && (
                            <ThirdInfo
                                setCurrentInfo={setCurrentInfo}
                                control={control}
                                watch={watch}
                                handleSubmit={handleSubmit}
                                onSubmit={onSubmit}
                                // onError={onError}
                                setValue={setValue}
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
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f2f5',
        justifyContent: 'center',
        alignItems: "center",
        padding: 16,
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
