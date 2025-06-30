import nrcData from '@/assets/NRC_DATA.json';
import globalStyles from '@/styles/globalStyles';
import React, { useMemo } from 'react';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import AppDropdown from './ui/AppDropDown';
import AppTextInput from './ui/AppTextInput';


export type ControlProps = {
    control: Control<any>;
    watch: UseFormWatch<any>;
};

const NationalIdInput = ({ control, watch }: ControlProps) => {
    const nrcStateValue = watch('nrcState') || '3';
    const filteredTownShips = useMemo(() => {
        if (!nrcStateValue) return [];

        const seen = new Set<string>();

        return nrcData.nrcTownships
            .filter((township) => township.stateCode === nrcStateValue)
            .map((township) => ({
                value: `${township.short.mm}`,
                label: township.short.mm,
            }))
            .filter((item) => {
                if (seen.has(item.value)) return false;
                seen.add(item.value);
                return true;
            });
    }, [nrcStateValue]);


    const nrcNumbers = useMemo(() => {
        return nrcData.nrcStates.map((state) => ({
            value: state.number.en,
            label: `${state.number.mm} /`,
        }));
    }, [])

    const nrcTypes = useMemo(() => {
        return nrcData.nrcTypes.map((nrcType) => ({
            value: nrcType.name.mm,
            label: nrcType.name.mm
        }))
    }, []);
    return (
        <View style={globalStyles.inputWrapper}>
            {/* <Text style={{ color: "#333", }}>မှတ်ပုံတင်အမှတ်</Text> */}
            <View style={styles.dropDownContainer}>
                <View>
                    <Controller
                        control={control}
                        name="nrcState"
                        render={({ field: { onChange, value } }) => (
                            <AppDropdown
                                selectedValue={value}
                                onValueChange={onChange}
                                options={nrcNumbers}
                                placeholder='၁/'
                            />
                        )}
                    />
                </View>

                <View>
                    <Controller
                        control={control}
                        name="nrcTownShip"
                        render={({ field: { onChange, value } }) => (
                            <AppDropdown
                                selectedValue={value}
                                onValueChange={onChange}
                                options={filteredTownShips}
                                placeholder={filteredTownShips[0]?.label}
                            />
                        )}
                    />
                </View>

                <View>
                    <Controller
                        control={control}
                        name="nrcType"
                        render={({ field: { onChange, value } }) => (
                            <AppDropdown
                                selectedValue={value}
                                onValueChange={onChange}
                                options={nrcTypes}
                                placeholder={nrcTypes[0]?.label}
                            />
                        )}
                    />
                </View>

                <View >
                    <Controller
                        control={control}
                        name="nrcNumber"
                        render={({ field: { onChange, value } }) => (
                            <AppTextInput
                                value={value}
                                onChangeText={onChange}
                                style={{ height: 50 }}
                                placeholder=''
                                keyboardType='numeric'
                            />
                        )}
                    />
                </View>
            </View>
        </View>
    )
}

export default NationalIdInput;

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

