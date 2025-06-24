
import { useCommittedOffenses } from '@/hooks/useCommittedOffenses';
import useDisciplinaryArticles from '@/hooks/useDisciplinaryArticles';
import React from 'react';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import AppDropdown from './ui/AppDropDown';


export type ControlProps = {
    control: Control<any>;
    watch: UseFormWatch<any>;
};

const DisciplinaryInput = ({ control, watch }: ControlProps) => {
    const { disciplinaryArticleOptions } = useDisciplinaryArticles();

    const articleValue = watch('disciplinary');

    const committedOptions = useCommittedOffenses(articleValue);
    return (
        <View style={styles.inputWrapper}>
            <View style={styles.dropDownContainer}>

                <Controller
                    control={control}
                    name="disciplinary"
                    render={({ field: { onChange, value } }) => (
                        <AppDropdown
                            selectedValue={value}
                            onValueChange={onChange}
                            options={disciplinaryArticleOptions}
                            placeholder='ပုဒ်မ'
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="committed"
                    render={({ field: { onChange, value } }) => (
                        <AppDropdown
                            selectedValue={value}
                            onValueChange={onChange}
                            options={committedOptions}
                            placeholder={"ကျူးလွန်ပြစ်မှု"}
                        />
                    )}
                />

            </View>
        </View>
    );
};


export default DisciplinaryInput;

const styles = StyleSheet.create({
    inputWrapper: {
        marginBottom: 15,
    },
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
function watch(arg0: string) {
    throw new Error('Function not implemented.')
}

