import useDisciplinaryArticles from '@/hooks/useDisciplinaryArticles'
import React from 'react'
import { Controller } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import DisciplinaryInput from '../DisciplinaryInput'
import AppButton from '../ui/AppButton'
import AppTextInput from '../ui/AppTextInput'
import { InfoProps } from './FirstInfo'


export type ThirdInfoProps = InfoProps & {
    handleSubmit: () => void;
};

const ThirdInfo = ({ control, handleSubmit, setCurrentInfo, watch }: ThirdInfoProps) => {

    const { disciplinaryArticleOptions } = useDisciplinaryArticles();

    return (
        <>
            <View style={styles.inputWrapper}>
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
                {/* {errors.name && (
                                    <Text style={styles.errorText}>{errors.name.message}</Text>
                                )} */}
            </View>

            <View style={styles.inputWrapper}>
                <Controller
                    control={control}
                    name="ယာဉ်မောင်လိုင်စင်"
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
                {/* {errors.name && (
                                    <Text style={styles.errorText}>{errors.name.message}</Text>
                                )} */}
            </View>

            <DisciplinaryInput
                control={control}
                watch={watch}
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
                    onPress={() => console.log("work")}
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
    },
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