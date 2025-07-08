import { addPunishmentSchema, AddPunishmentSchemaType } from '@/schema/addPunishment.schema';
import globalStyles from '@/styles/globalStyles';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import DisciplinaryInput from '../DisciplinaryInput';
import SeizedInput from '../SeizedInput';
import AppButton from './AppButton';
import AppTextInput from './AppTextInput';
import CalendarInput from './CalendarInput';

type PunishmentFormModalProps = {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    item: any
};

const PunishmentFormModal = (
    {
        visible,
        onConfirm,
        onCancel,
        item,
    }: PunishmentFormModalProps
) => {

    const {
        watch,
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<AddPunishmentSchemaType>({
        resolver: zodResolver(addPunishmentSchema),
        mode: "onChange",
        defaultValues: {
            seized_date: "",
            seizure_location: "",
            article_id: "",
            article_label: "",
            committed_id: "",
            committed_label: "",
            fine_amount: "",
            seizedItem_id: "",
            seizedItem_label: ""
        }
    });


    const onSubmit = async (data: AddPunishmentSchemaType) => {
        console.log(data)

    };


    console.log(item.offender_vehicle_id)
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
                    <Text
                        style={{
                            fontSize: 18,
                            fontFamily: 'Myanmar-Bold',
                            color: '#333',
                            textAlign: 'center',
                            marginBottom: 16,
                        }}
                    >
                        ပြစ်မှု အသစ်ထည့်မည်
                    </Text>
                    <View style={globalStyles.inputWrapper}>
                        <Controller
                            control={control}
                            name="seized_date"
                            render={({ field: { onChange, value } }) => (
                                <CalendarInput
                                    value={value}
                                    onChange={onChange}
                                />
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
                                    multiline={true}
                                />
                            )}
                        />
                        {errors.seizure_location && (
                            <Text style={globalStyles.errorText}>{errors.seizure_location.message}</Text>
                        )}
                    </View>

                    <DisciplinaryInput
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
                    />

                    <AppButton
                        label='ပြစ်မှုထည့်မည်။'
                        loading={isSubmitting}
                        onPress={handleSubmit(onSubmit)}
                    />

                </View>

            </Modal>
        </Portal>
    )
}

export default PunishmentFormModal;

