import NationalIdInput from '@/components/NationalIdInput';
import { AlertModal } from '@/components/ui/AlertModal';
import AppButton from '@/components/ui/AppButton';
import AppTextInput from '@/components/ui/AppTextInput';
import { getOffenders } from '@/database/offender/offenders';
import { searchOffenderVehicles } from '@/database/offenderVehicles/offenderVehicles';
import { searchSchema, SearchSchemaType } from '@/schema/search.schema';
import globalStyles from '@/styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const Search = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [navigateAfterClose, setNavigateAfterClose] = useState(false);
    const router = useRouter();
    const {
        watch,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SearchSchemaType>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            name: '',
            fatherName: '',
            nrcState: '3',
            nrcTownShip: 'ဘအန',
            nrcType: 'နိုင်',
            nrcNumber: "222222",
            vehicleNumber: '',
            vehicleLicense: '',

        }
    });


    const onSubmit = async (data: SearchSchemaType) => {
        const res = await searchOffenderVehicles(data);
        const offenders = await getOffenders();
        if (!res.length) {
            setModalVisible(true);
            setNavigateAfterClose(true);
        } else {
            router.push({ pathname: "/(stacks)/searchResults", params: { results: JSON.stringify(res) } });
        }

    }

    useEffect(() => {
        if (!modalVisible && navigateAfterClose) {
            setNavigateAfterClose(false);
            router.push("/(stacks)/addPunishment");
        }
    }, [modalVisible, navigateAfterClose]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <AlertModal
                visible={modalVisible}
                onCancel={() => {
                    setNavigateAfterClose(false);
                    setModalVisible(false);

                }}
                onConfirm={() => setModalVisible(false)}
                message="ပြစ်မှုကြူးလွန်ထားခြင်းမရှိပါ။"
                confirmText='ပြစ်မှုထည့်မည်'
                icon={<Ionicons name="shield-checkmark" size={70} color="#4CAF50" />}
            />
            <View style={globalStyles.card}>
                <View style={styles.noticeWrapper}>
                    <MaterialIcons name="info" size={16} color="#d9534f" style={styles.icon} />
                    <Text style={styles.noticeText}>
                        အမည် သို့မဟုတ် အဘ အမည်စသည့် အချက်အလက်တစ်ခုတည်းဖြင့်လည်း ရှာဖွေနိုင်ပါသည်။
                    </Text>
                </View>

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
                </View>

                <View style={globalStyles.inputWrapper}>
                    <Controller
                        control={control}
                        name="fatherName"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="အဘမည်"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {/* {errors.name && (
                        <Text style={styles.errorText}>{errors.name.message}</Text>
                    )} */}
                </View>

                <NationalIdInput
                    control={control}
                    watch={watch}
                />

                <View style={globalStyles.inputWrapper}>
                    <Controller
                        control={control}
                        name="vehicleNumber"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="ယာဉ်နံပါတ်"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                </View>

                <View style={globalStyles.inputWrapper}>
                    <Controller
                        control={control}
                        name="vehicleLicense"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="ယာဉ်လိုင်စင်"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                </View>

                <View>
                    <AppButton
                        label='ရှာမည်'
                        onPress={handleSubmit(onSubmit)}
                        loading={isSubmitting}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default Search;

const styles = StyleSheet.create({

    container: {
        flexGrow: 1,
        backgroundColor: '#f0f2f5',
        justifyContent: 'center',
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
    noticeText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '500',
        color: '#d9534f',
        lineHeight: 18,
        textAlign: 'justify',
    },
});

