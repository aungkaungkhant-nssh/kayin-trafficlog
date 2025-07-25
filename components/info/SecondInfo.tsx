import globalStyles from '@/styles/globalStyles'
import { ExistenceStatus } from '@/utils/enum/ExistenceStatus'
import React, { useState } from 'react'
import { Controller } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native'
import { RadioButton } from 'react-native-paper'
import NationalIdInput from '../NationalIdInput'
import AppButton from '../ui/AppButton'
import AppTextInput from '../ui/AppTextInput'
import { InfoProps } from './FirstInfo'

const SecondInfo = ({ control, watch, setCurrentInfo, trigger, errors }: InfoProps) => {
    const [checked, setChecked] = useState(ExistenceStatus.No);
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

            <View>
                <Text style={{ color: "#333", }}>မှတ်ပုံတင်အမှတ်</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                        <RadioButton
                            value={checked}
                            status={checked === ExistenceStatus.No ? 'checked' : 'unchecked'}
                            onPress={() => setChecked(ExistenceStatus.No)}
                        />
                        <Text onPress={() => setChecked(ExistenceStatus.No)}>မရှိ</Text>
                    </View>
                    <Text>{" / "}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton
                            value={checked}
                            status={checked === ExistenceStatus.Yes ? 'checked' : 'unchecked'}
                            onPress={() => setChecked(ExistenceStatus.Yes)}
                        />
                        <Text onPress={() => setChecked(ExistenceStatus.Yes)}>ရှိ</Text>
                    </View>
                </View>
            </View>

            {
                checked === ExistenceStatus.Yes && (
                    <NationalIdInput
                        control={control}
                        watch={watch}
                    />
                )
            }


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