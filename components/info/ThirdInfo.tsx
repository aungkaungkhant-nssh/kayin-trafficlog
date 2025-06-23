import React from 'react'
import { Controller } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { ControlProps } from '../NationalIdInput'
import AppButton from '../ui/AppButton'
import AppTextInput from '../ui/AppTextInput'
import CalendarInput from '../ui/CalendarInput'


export type ThirdInfoProps = ControlProps & {
    handleSubmit: () => void;
};

const ThirdInfo = ({ control, handleSubmit }: ThirdInfoProps) => {
    return (
        <>
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
                            label="ယာဉ်နံပါတ်"
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
                            label="ယာဉ်အမျိုးအစား"
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

            <View>
                <AppButton
                    label='ရှာမည်'
                    onPress={handleSubmit}
                    loading={false}
                />
            </View>

        </>
    )
}

export default ThirdInfo;

const styles = StyleSheet.create({
    inputWrapper: {
        marginBottom: 15,
    }
});