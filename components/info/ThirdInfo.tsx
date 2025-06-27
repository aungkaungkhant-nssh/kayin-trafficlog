import { AddPunishmentSchemaType } from '@/schema/addPunishment.schema'
import globalStyles from '@/styles/globalStyles'
import React from 'react'
import { Controller, SubmitHandler, UseFormSetValue } from 'react-hook-form'
import { StyleSheet, Text, View } from 'react-native'
import DisciplinaryInput from '../DisciplinaryInput'
import SeizedInput from '../SeizedInput'
import AppButton from '../ui/AppButton'
import AppTextInput from '../ui/AppTextInput'
import { InfoProps } from './FirstInfo'


export type ThirdInfoProps = InfoProps & {
    handleSubmit: (callback: SubmitHandler<AddPunishmentSchemaType>, onError?: (errors: any) => void) => () => void;
    onSubmit: SubmitHandler<AddPunishmentSchemaType>;
    setValue: UseFormSetValue<AddPunishmentSchemaType>;
};

const ThirdInfo = ({ control, handleSubmit, onSubmit, setCurrentInfo, setValue, watch, errors }: ThirdInfoProps) => {
    return (
        <>
            <View style={globalStyles.inputWrapper}>
                <Controller
                    control={control}
                    name="vehicle_license_number"
                    render={({ field: { onChange, value } }) => (
                        <AppTextInput
                            label="ယာဉ်လိုင်စင်"
                            value={value}
                            onChangeText={onChange}
                            multiline={true}
                        />
                    )}
                />
                {errors.name && (
                    <Text style={globalStyles.errorText}>{errors.name.message}</Text>
                )}
            </View>

            <View style={globalStyles.inputWrapper}>
                <Controller
                    control={control}
                    name="driver_license_number"
                    render={({ field: { onChange, value } }) => (
                        <AppTextInput
                            label="ယာဉ်မောင်လိုင်စဉ်"
                            value={value}
                            onChangeText={onChange}
                            multiline={true}
                        />
                    )}
                />
                {errors.driver_license_number && (
                    <Text style={globalStyles.errorText}>{errors.driver_license_number.message}</Text>
                )}
            </View>


            <View style={globalStyles.inputWrapper}>
                <Controller
                    control={control}
                    name="wheel_tax"
                    render={({ field: { onChange, value } }) => (
                        <AppTextInput
                            label="wheel tax"
                            value={value}
                            onChangeText={onChange}
                            multiline={true}
                        />
                    )}
                />
                {errors.wheel_tax && (
                    <Text style={globalStyles.errorText}>{errors.wheel_tax.message}</Text>
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
            />

            <View style={styles.btnContainer}>
                <AppButton
                    label='နောက်သို့'
                    onPress={() => setCurrentInfo(2)}
                    loading={false}
                    mode={"outlined"}

                />

                <AppButton
                    label='ရှေ့သို့'
                    onPress={handleSubmit(onSubmit)}
                    loading={false}
                />
            </View>

        </>
    )
}

export default ThirdInfo;

const styles = StyleSheet.create({
    dropDownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flexWrap: 'wrap',
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
});