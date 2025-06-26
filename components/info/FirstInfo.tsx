import { AddPunishmentSchemaType } from '@/schema/addPunishment.schema'
import globalStyles from '@/styles/globalStyles'
import React from 'react'
import { Controller, FieldErrors, UseFormTrigger } from 'react-hook-form'
import { StyleSheet, Text, View } from 'react-native'
import { ControlProps } from '../NationalIdInput'
import AppButton from '../ui/AppButton'
import AppTextInput from '../ui/AppTextInput'
import CalendarInput from '../ui/CalendarInput'
import VehicleCategoriesInput from '../VehicleCategoriesInput'

export type InfoProps = ControlProps & {
    setCurrentInfo: (value: any) => void;
    trigger: UseFormTrigger<AddPunishmentSchemaType>;
    errors: FieldErrors<AddPunishmentSchemaType>;
};

const FirstInfo = ({ control, watch, trigger, setCurrentInfo, errors }: InfoProps) => {
    return (
        <>
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
                            multiline={true}
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
            />

            <View style={styles.btnContainer}>
                <AppButton
                    label='ရှေ့သို့'
                    onPress={async () => {
                        const valid = await trigger([
                            'seized_date',
                            'seizure_location',
                            'vehicle_number',
                            'vehicle_types'
                        ]);
                        if (valid) {
                            setCurrentInfo(2);
                        }
                    }}
                    loading={false}
                />
            </View>

        </>
    )
}

export default FirstInfo;

const styles = StyleSheet.create({

    btnContainer: {
        flexDirection: "row",
        justifyContent: "flex-end"
    }
});