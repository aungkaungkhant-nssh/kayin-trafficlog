
import { useCommittedOffenses, useFineAmount } from '@/hooks/useCommittedOffenses';
import useDisciplinaryArticles from '@/hooks/useDisciplinaryArticles';
import { AddPunishmentInfoSchemaType } from '@/schema/addPunishmentInfo.schema';
import globalStyles from '@/styles/globalStyles';
import React, { useEffect } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import AppDropdown from './ui/AppDropDown';
import AppTextInput from './ui/AppTextInput';


export type ControlProps = {
    control: Control<any>;
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
    errors: FieldErrors<AddPunishmentInfoSchemaType>;
};

const DisciplinaryInput = ({ control, watch, setValue, errors }: ControlProps) => {
    const { disciplinaryArticleOptions } = useDisciplinaryArticles();

    const articleValue = watch('article_id');
    const committedValue = watch("committed_id");
    const committedOptions: { value: string; label: string }[] = useCommittedOffenses(articleValue);
    const { fineAmount } = useFineAmount(articleValue, committedValue);

    useEffect(() => {
        if (fineAmount) {
            setValue("fine_amount", String(fineAmount))
        }

        const selectedArticle = disciplinaryArticleOptions.find(item => item.value === articleValue);
        if (selectedArticle) {
            setValue("article_label", selectedArticle.label);
        }

        const selectedCommitted = committedOptions.find(item => item.value === committedValue);
        if (selectedCommitted) {
            setValue("committed_label", selectedCommitted.label);
        }
    }, [fineAmount, articleValue, committedValue, disciplinaryArticleOptions, committedOptions, setValue])
    return (
        <View style={globalStyles.inputWrapper}>
            <View style={styles.dropDownContainer}>
                <View>
                    <Controller
                        control={control}
                        name="article_id"
                        render={({ field: { onChange, value } }) => (
                            <AppDropdown
                                selectedValue={value}
                                onValueChange={onChange}
                                options={disciplinaryArticleOptions}
                                placeholder='ပုဒ်မ'
                                label='ပုဒ်မ'
                            />
                        )}
                    />
                    {errors.article_id && (
                        <Text style={globalStyles.errorText}>{errors.article_id.message}</Text>
                    )}
                </View>

                <View>
                    <Controller
                        control={control}
                        name="committed_id"
                        render={({ field: { onChange, value } }) => (
                            <AppDropdown
                                selectedValue={value}
                                onValueChange={onChange}
                                options={committedOptions}
                                placeholder={"ကျူးလွန်ပြစ်မှု"}
                                label="ကျူးလွန်ပြစ်မှု"
                            />
                        )}
                    />
                    {errors.committed_id && (
                        <Text style={globalStyles.errorText}>{errors.committed_id.message}</Text>
                    )}
                </View>

                <View style={globalStyles.inputWrapper}>
                    <Controller
                        control={control}
                        name="fine_amount"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="ဒဏ်ငွေ"
                                value={String(fineAmount)}
                                onChangeText={onChange}
                                disable={true}

                            />
                        )}
                    />
                    {/* {errors.name && (
                                    <Text style={styles.errorText}>{errors.name.message}</Text>
                                )} */}
                </View>

            </View>
        </View>
    );
};


export default DisciplinaryInput;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f2f5',
        justifyContent: 'center',
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        color: "red"
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    dropDownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flexWrap: 'wrap',
    },
    noticeWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 18,
    },
    icon: {
        marginRight: 6,
        marginTop: 2,
    },
});


