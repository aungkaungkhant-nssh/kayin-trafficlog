import globalStyles from '@/styles/globalStyles'
import React from 'react'
import { Controller } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native'
import NationalIdInput from '../NationalIdInput'
import AppButton from '../ui/AppButton'
import AppTextInput from '../ui/AppTextInput'
import { InfoProps } from './FirstInfo'

const SecondInfo = ({ control, watch, setCurrentInfo, trigger, errors }: InfoProps) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={styles.inputWrapper}>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                        <AppTextInput
                            label="ယာဉ်မောင်းအမည်"
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

            <NationalIdInput
                control={control}
                watch={watch}
            />

            <View style={styles.inputWrapper}>
                <Controller
                    control={control}
                    name="father_name"
                    render={({ field: { onChange, value } }) => (
                        <AppTextInput
                            label="အဘအမည်"
                            value={value}
                            onChangeText={onChange}
                            multiline={true}
                        />
                    )}
                />
                {errors.father_name && (
                    <Text style={globalStyles.errorText}>{errors.father_name.message}</Text>
                )}
            </View>



            <View style={styles.inputWrapper}>
                <Controller
                    control={control}
                    name="address"
                    render={({ field: { onChange, value } }) => (
                        <AppTextInput
                            label="နေရပ်လိပ်စာ"
                            value={value}
                            onChangeText={onChange}
                            multiline={true}
                        />
                    )}
                />
                {errors.address && (
                    <Text style={globalStyles.errorText}>{errors.address.message}</Text>
                )}
            </View>
            <View style={styles.btnContainer}>
                <AppButton
                    label='နောက်သို့'
                    onPress={() => setCurrentInfo(1)}
                    loading={false}
                    mode={"outlined"}

                />

                <AppButton
                    label='ရှေ့သို့'
                    onPress={async () => {
                        const valid = await trigger([
                            "name",
                            "father_name",
                            "address",
                            "nrcState",
                            "nrcTownShip",
                            "nrcType",
                            "nrcNumber",
                        ]);
                        if (valid) {
                            setCurrentInfo(3);
                        }
                    }}
                    loading={false}
                />
            </View>
        </KeyboardAvoidingView>
    )
}

export default SecondInfo;

const styles = StyleSheet.create({
    inputWrapper: {
        marginBottom: 15,
    },

    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
});