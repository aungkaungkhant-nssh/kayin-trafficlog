import { AddPunishmentInfoSchemaType } from '@/schema/addPunishmentInfo.schema'
import globalStyles from '@/styles/globalStyles'
import React from 'react'
import { Controller, UseFormGetValues, UseFormSetValue } from 'react-hook-form'
import { StyleSheet, Text, View } from 'react-native'
import AppButton from '../ui/AppButton'
import AppTextInput from '../ui/AppTextInput'
import { InfoProps } from './FirstInfo'


export type ThirdInfoProps = InfoProps & {
    setValue: UseFormSetValue<AddPunishmentInfoSchemaType>;
    getValues?: UseFormGetValues<AddPunishmentInfoSchemaType>;
    setIsConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};

const ThirdInfo = ({ control, setCurrentInfo, setValue, watch, errors, setIsConfirm, trigger, getValues }: ThirdInfoProps) => {
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

            {/* 
            <DisciplinaryInput
                control={control}
                watch={watch}
                setValue={setValue}
                getValues={getValues}
                errors={errors}
            /> */}

            {/* <SeizedInput
                control={control}
                watch={watch}
                errors={errors}
                setValue={setValue}
            /> */}

            <View style={styles.btnContainer}>
                <AppButton
                    label='နောက်သို့'
                    onPress={() => setCurrentInfo(2)}
                    loading={false}
                    mode={"outlined"}

                />

                <AppButton
                    label='ရှေ့သို့'
                    onPress={async () => {
                        const valid = await trigger([
                            "article_label",
                            "committed_label",
                            "fine_amount",
                            "seizedItem_label"
                        ]);
                        if (valid) {
                            setIsConfirm(true)
                        }
                    }}
                    loading={false}
                    mode={"outlined"}
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
    },
    disciplinaryContainer: {
        flexDirection: "row",
        gap: 6
    }
});