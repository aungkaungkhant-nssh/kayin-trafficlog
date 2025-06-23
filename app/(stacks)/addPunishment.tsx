import nrcData from '@/assets/NRC_DATA.json';
import AppButton from '@/components/ui/AppButton';
import AppDropdown from '@/components/ui/AppDropDown';
import AppTextInput from '@/components/ui/AppTextInput';
import CalendarInput from '@/components/ui/CalendarInput';
import Header from '@/components/ui/Header';
import { searchSchema, SearchSchemaType } from '@/schema/search.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';


const AddPunishment = () => {
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

    }

    const nrcStateValue = watch('nrcState') || '3';

    const filteredTownShips = useMemo(() => {
        if (!nrcStateValue) return [];

        const seen = new Set<string>();

        return nrcData.nrcTownships
            .filter((township) => township.stateCode === nrcStateValue)
            .map((township) => ({
                value: `${township.short.mm}`,
                label: township.short.mm,
            }))
            .filter((item) => {
                if (seen.has(item.value)) return false;
                seen.add(item.value);
                return true;
            });
    }, [nrcStateValue]);


    const nrcNumbers = useMemo(() => {
        return nrcData.nrcStates.map((state) => ({
            value: state.number.en,
            label: `${state.number.mm} /`,
        }));
    }, [])

    const nrcTypes = useMemo(() => {
        return nrcData.nrcTypes.map((nrcType) => ({
            value: nrcType.name.mm,
            label: nrcType.name.mm
        }))
    }, []);

    const getNrcStateMM = (en: string) => {
        const match = nrcData.nrcStates.find((state) => state.number.en === en);
        return `${match?.number.mm} /`;
    };
    return (
        <View>
            <Header
                title='ပြစ်မှုထည့်မည်'
            />

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    {/* <View style={styles.noticeWrapper}>
                        <Text style={styles.noticeText}>

                        </Text>
                    </View> */}
                    <View style={styles.inputWrapper}>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, value } }) => (
                                <CalendarInput
                                />
                            )}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Controller
                            control={control}
                            name="fatherName"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    label="ဖမ်းဆည်းသည့်နေရာ"
                                    value={value}
                                    onChangeText={onChange}
                                    multiline={true}
                                />
                            )}
                        />
                        {/* {errors.name && (
                                    <Text style={styles.errorText}>{errors.name.message}</Text>
                                )} */}
                    </View>

                    <View style={styles.inputWrapper}>
                        <Controller
                            control={control}
                            name="fatherName"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    label="ဖမ်းဆည်းသည့်နေရာ"
                                    value={value}
                                    onChangeText={onChange}
                                    multiline={true}
                                />
                            )}
                        />
                        {/* {errors.name && (
                                    <Text style={styles.errorText}>{errors.name.message}</Text>
                                )} */}
                    </View>

                    <View style={styles.inputWrapper}>
                        <Controller
                            control={control}
                            name="fatherName"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    label="ဖမ်းဆည်းသည့်နေရာ"
                                    value={value}
                                    onChangeText={onChange}
                                    multiline={true}
                                />
                            )}
                        />
                        {/* {errors.name && (
                                    <Text style={styles.errorText}>{errors.name.message}</Text>
                                )} */}
                    </View>


                    <View style={styles.inputWrapper}>
                        <Text style={{ color: "#333", marginBottom: 5 }}>မှတ်ပုံတင်အမှတ်</Text>
                        <View style={styles.dropDownContainer}>
                            <View>
                                <Controller
                                    control={control}
                                    name="nrcState"
                                    render={({ field: { onChange, value } }) => (
                                        <AppDropdown
                                            selectedValue={value}
                                            onValueChange={onChange}
                                            options={nrcNumbers}
                                            placeholder='၁/'
                                        />
                                    )}
                                />
                            </View>

                            <View>
                                <Controller
                                    control={control}
                                    name="nrcTownShip"
                                    render={({ field: { onChange, value } }) => (
                                        <AppDropdown
                                            selectedValue={value}
                                            onValueChange={onChange}
                                            options={filteredTownShips}
                                            placeholder={filteredTownShips[0]?.label}
                                        />
                                    )}
                                />
                            </View>

                            <View>
                                <Controller
                                    control={control}
                                    name="nrcType"
                                    render={({ field: { onChange, value } }) => (
                                        <AppDropdown
                                            selectedValue={value}
                                            onValueChange={onChange}
                                            options={nrcTypes}
                                            placeholder={nrcTypes[0]?.label}
                                        />
                                    )}
                                />
                            </View>

                            <View >
                                <Controller
                                    control={control}
                                    name="nrcNumber"
                                    render={({ field: { onChange, value } }) => (
                                        <AppTextInput
                                            value={value}
                                            onChangeText={onChange}
                                            style={{ height: 50 }}
                                            placeholder=''
                                            keyboardType='numeric'
                                        />
                                    )}
                                />
                            </View>
                        </View>
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
        </View>
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
    noticeText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '500',
        color: '#000',
        lineHeight: 18,
        textAlign: 'justify',
    },
});
