import { addCase } from '@/database/offenderVehicles/offenderVehicles';
import { addCaseSchema, AddCaseSchemaType } from '@/schema/addCase.schema';
import globalStyles from '@/styles/globalStyles';
import Entypo from '@expo/vector-icons/Entypo';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal, Portal, useTheme } from 'react-native-paper';
import AppButton from './AppButton';
import AppTextInput from './AppTextInput';
import CalendarInput from './CalendarInput';
import { FormModalProps } from './PunishmentFormModal';

const AddCaseFormModal = (
    {

        visible,
        onConfirm,
        onCancel,
        item,
    }: FormModalProps
) => {
    const theme = useTheme();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AddCaseSchemaType>({
        resolver: zodResolver(addCaseSchema),
        mode: "onChange",
        defaultValues: {
            case_number: "",
            action_date: ""
        }
    });

    const onSubmit = async (data: AddCaseSchemaType) => {

        const res = await addCase(data, item.seizure_id);
        if (res.success) {
            onConfirm()
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
                            တရားစွဲ အမှတ် ထည့်ရန်
                        </Text>
                        <TouchableOpacity
                            onPress={onCancel}
                        >
                            <Entypo name="circle-with-cross" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>

                    </View>

                    <View style={globalStyles.inputWrapper}>
                        <Controller
                            control={control}
                            name="action_date"
                            render={({ field: { onChange, value } }) => (
                                <CalendarInput
                                    value={value}
                                    onChange={onChange}
                                    label='လုပ်ဆောင်သည့်ရက်စွဲ'
                                />
                            )}
                        />
                        {errors.action_date && (
                            <Text style={globalStyles.errorText}>{errors.action_date.message}</Text>
                        )}
                    </View>

                    <View style={globalStyles.inputWrapper}>
                        <Controller
                            control={control}
                            name="case_number"
                            render={({ field: { onChange, value } }) => (
                                <AppTextInput
                                    label="တရားစွဲအမှတ်"
                                    value={value}
                                    onChangeText={onChange}
                                    multiline={true}
                                    keyboardType='numeric'
                                />
                            )}
                        />
                        {errors.case_number && (
                            <Text style={globalStyles.errorText}>{errors.case_number.message}</Text>
                        )}
                    </View>



                    <AppButton
                        label='ထည့်မည်။'
                        loading={isSubmitting}
                        onPress={handleSubmit(onSubmit)}
                    />

                </View>
            </Modal>
        </Portal>
    )
}

export default AddCaseFormModal;

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        justifyContent: "space-between"
    }
})
