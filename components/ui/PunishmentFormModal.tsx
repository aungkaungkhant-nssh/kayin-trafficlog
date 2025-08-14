import { useSession } from '@/context/SessionContext';
import { addPunishment } from '@/database/offenderVehicles/offenderVehicles';
import { addPunishmentSchema, AddPunishmentSchemaType } from '@/schema/addPunishment.schema';
import globalStyles from '@/styles/globalStyles';
import Entypo from '@expo/vector-icons/Entypo';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal, Portal, useTheme } from 'react-native-paper';
import VehicleCategoriesInput from '../VehicleCategoriesInput';
import AppButton from './AppButton';
import AppTextInput from './AppTextInput';
import CalendarInput from './CalendarInput';

export type FormModalProps = {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    item: any
};

const PunishmentFormModal = ({
    visible,
    onConfirm,
    onCancel,
    item,
}: FormModalProps) => {
    const { officer } = useSession();
    const theme = useTheme();

    const {
        watch,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AddPunishmentSchemaType>({
        resolver: zodResolver(addPunishmentSchema),
        mode: "onChange",
        defaultValues: {
            seized_date: "",
            seizure_location: "",
            article_label: "",
            committed_label: "",
            fine_amount: "",
            seizedItem_label: "",
            vehicle_categories_id: "",
            vehicle_categories_label: "",
            vehicle_number: "",
            vehicle_types: ""
        }
    });

    // Set values from `item` when modal becomes visible
    useEffect(() => {
        if (visible && item) {
            setValue('vehicle_number', item.vehicle_number || '');
            setValue('vehicle_types', item.vehicle_types || '');
            if (item.vehicle_categories_id) {
                setValue('vehicle_categories_id', String(item.vehicle_categories_id));
            }
        }
    }, [visible, item, setValue]);

    const onSubmit = async (data: AddPunishmentSchemaType) => {
        console.log(data)
        try {

            const res = await addPunishment(data, item, officer.id);
            if (res.success) {
                onConfirm();
            }
        } catch (err) {
            console.log(err)
        }

    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onCancel}
                contentContainerStyle={{
                    backgroundColor: 'white',
                    paddingVertical: 14,
                    paddingHorizontal: 14,
                    margin: 20,
                    borderRadius: 8,
                }}
            >
                <View>
                    <View style={styles.titleContainer}>
                        <Text
                            style={{
                                fontSize: 18,
                                fontFamily: 'Myanmar-Bold',
                                color: '#333',
                                textAlign: 'center',
                            }}
                        >
                            ပြစ်မှု ထည့်မည်
                        </Text>
                        <TouchableOpacity onPress={onCancel}>
                            <Entypo name="circle-with-cross" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={globalStyles.inputWrapper}>
                        <Controller
                            control={control}
                            name="seized_date"
                            render={({ field: { onChange, value } }) => (
                                <CalendarInput value={value} onChange={onChange} />
                            )}
                        />
                        {errors.seized_date && (
                            <Text style={globalStyles.errorText}>{errors.seized_date.message}</Text>
                        )}
                    </View>

                    <View style={globalStyles.inputWrapper}>
                        <Controller
                            control={control}
                            name="seizure_location"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    label="ဖမ်းဆည်းသည့်နေရာ"
                                    value={value}
                                    onChangeText={onChange}
                                    multiline
                                />
                            )}
                        />
                        {errors.seizure_location && (
                            <Text style={globalStyles.errorText}>{errors.seizure_location.message}</Text>
                        )}
                    </View>

                    {/* <DisciplinaryInput
                        control={control}
                        watch={watch}
                        setValue={setValue}
                        errors={errors}
                    />

                    <SeizedInput
                        control={control}
                        watch={watch}
                        errors={errors}
                        setValue={setValue}
                    /> */}

                    <View style={[styles.disciplinaryContainer, globalStyles.inputWrapper]}>
                        <View style={{ flex: 3, marginRight: 5 }}>
                            <Controller
                                control={control}
                                name="article_label"
                                render={({ field: { onChange, value } }) => (
                                    <AppTextInput
                                        label="ပုဒ်မ"
                                        value={value}
                                        onChangeText={onChange}
                                        multiline
                                    />
                                )}
                            />
                            {errors.article_label && (
                                <Text style={globalStyles.errorText}>{errors.article_label.message}</Text>
                            )}
                        </View>

                        <View style={{ flex: 6, marginHorizontal: 5 }}>
                            <Controller
                                control={control}
                                name="committed_label"
                                render={({ field: { onChange, value } }) => (
                                    <AppTextInput
                                        label="ကျူးလွန်ပြစ်မှု"
                                        value={value}
                                        onChangeText={onChange}
                                        multiline
                                    />
                                )}
                            />
                            {errors.committed_label && (
                                <Text style={globalStyles.errorText}>{errors.committed_label.message}</Text>
                            )}
                        </View>

                        <View style={{ flex: 3, marginLeft: 5 }}>
                            <Controller
                                control={control}
                                name="fine_amount"
                                render={({ field: { onChange, value } }) => (
                                    <AppTextInput
                                        label="ဒဏ်ငွေ"
                                        value={value}
                                        onChangeText={onChange}
                                        keyboardType="numeric"
                                    />
                                )}
                            />
                            {errors.fine_amount && (
                                <Text style={globalStyles.errorText}>{errors.fine_amount.message}</Text>
                            )}
                        </View>
                    </View>

                    <View style={globalStyles.inputWrapper}>
                        <Controller
                            control={control}
                            name="seizedItem_label"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    label="သိမ်းဆည်းပစ္စည်း"
                                    value={value}
                                    onChangeText={onChange}
                                    multiline
                                />
                            )}
                        />
                        {errors.seizedItem_label && (
                            <Text style={globalStyles.errorText}>{errors.seizedItem_label.message}</Text>
                        )}
                    </View>

                    <View style={globalStyles.inputWrapper}>
                        <Controller
                            control={control}
                            name="vehicle_number"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    label="ယာဉ်နံပါတ်"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        {errors.vehicle_number && (
                            <Text style={globalStyles.errorText}>{errors.vehicle_number.message}</Text>
                        )}
                    </View>

                    <View style={globalStyles.inputWrapper}>
                        <Controller
                            control={control}
                            name="vehicle_types"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    label="ယာဉ်မော်ဒယ်"
                                    value={value}
                                    onChangeText={onChange}
                                    multiline
                                />
                            )}
                        />
                        {errors.vehicle_types && (
                            <Text style={globalStyles.errorText}>{errors.vehicle_types.message}</Text>
                        )}
                    </View>

                    <VehicleCategoriesInput
                        control={control}
                        watch={watch}
                        errors={errors}
                        setValue={setValue}
                    />

                    <AppButton
                        label="ပြစ်မှုထည့်မည်။"
                        loading={isSubmitting}
                        onPress={handleSubmit(onSubmit)}
                    />
                </View>
            </Modal>
        </Portal>
    );
};


export default PunishmentFormModal;

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        justifyContent: "space-between"
    },
    disciplinaryContainer: {
        flexDirection: "row",
        gap: 6
    }
})

