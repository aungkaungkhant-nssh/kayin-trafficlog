import AppButton from '@/components/ui/AppButton';
import AppDropdown from '@/components/ui/AppDropDown';
import AppTextInput from '@/components/ui/AppTextInput';
import { loginSchema, LoginSchemaType } from '@/schema/login.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';

const Search = () => {
    const {
        control,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            name: '',
            password: '',
        }
    });

    const typeOptions = [
        { label: '၁/', value: '1' },
        { label: '၂/', value: '2' },
    ];
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <View style={styles.inputWrapper}>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="အမည်"
                                value={value}
                                onChangeText={onChange}
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
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="အဘမည်"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {/* {errors.name && (
                        <Text style={styles.errorText}>{errors.name.message}</Text>
                    )} */}
                </View>
                <View style={styles.inputWrapper}>
                    <View style={styles.dropDownContainer}>
                        <View>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, value } }) => (
                                    <AppDropdown
                                        selectedValue='၁/'
                                        onValueChange={() => console.log("hello")}
                                        options={typeOptions}
                                        placeholder='၁/'
                                    />
                                )}
                            />
                            {/* {errors.name && (
                                <Text style={styles.errorText}>{errors.name.message}</Text>
                                )} */}
                        </View>

                        <View>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, value } }) => (
                                    <AppDropdown
                                        selectedValue='၁/'
                                        onValueChange={() => console.log("hello")}
                                        options={typeOptions}
                                        placeholder='၁/'
                                    />
                                )}
                            />
                            {/* {errors.name && (
                                <Text style={styles.errorText}>{errors.name.message}</Text>
                                )} */}
                        </View>
                        <View>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, value } }) => (
                                    <AppDropdown
                                        selectedValue='၁/'
                                        onValueChange={() => console.log("hello")}
                                        options={typeOptions}
                                        placeholder='၁/'
                                    />
                                )}
                            />
                            {/* {errors.name && (
                                <Text style={styles.errorText}>{errors.name.message}</Text>
                                )} */}
                        </View>
                        <View >
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, value } }) => (
                                    <AppTextInput
                                        value={value}
                                        onChangeText={onChange}
                                        style={{ height: 50 }}
                                        placeholder='22222222'
                                    />
                                )}
                            />
                            {/* {errors.name && (
                        <Text style={styles.errorText}>{errors.name.message}</Text>
                    )} */}
                        </View>
                    </View>
                </View>

                <View style={styles.inputWrapper}>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="ယာဉ်နံပါတ်"
                                value={value}
                                onChangeText={onChange}
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
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="ယာဉ်လိုင်စင်"
                                value={value}
                                onChangeText={onChange}
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
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                label="ယာဉ်မောင်းလိုင်စင်"
                                value={value}
                                onChangeText={onChange}
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
                        onPress={() => console.log("hello")}
                        loading={isSubmitting}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default Search;

const styles = StyleSheet.create({
    inputWrapper: {
        marginBottom: 15,
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f2f5',
        justifyContent: 'center',
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5, // Android shadow
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
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
    }
});
