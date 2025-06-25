import { useSeizedItems } from '@/hooks/useSeizedItems';
import React from 'react';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import AppDropdown from './ui/AppDropDown';

export type ControlProps = {
  control: Control<any>;
  watch: UseFormWatch<any>;
};


const SeizedInput = ({ control, watch }: ControlProps) => {
  const { seizedItems } = useSeizedItems() as any;
  return (
    <View style={styles.inputWrapper}>
      <Text style={{ color: "#333", marginBottom: 5 }}>သိမ်းဆည်းပစ္စည်း</Text>
      <View style={styles.dropDownContainer}>
        <View>
          <Controller
            control={control}
            name="nrcState"
            render={({ field: { onChange, value } }) => (
              <AppDropdown
                selectedValue={value}
                onValueChange={onChange}
                options={seizedItems}
                placeholder={seizedItems[0]?.label}
                style={{ width: "100%" }}
              />
            )}
          />
        </View>
      </View>
    </View>
  )
}

export default SeizedInput;


const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 15
  },
  dropDownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
    width: '100%',
  },
  icon: {
    marginRight: 6,
    marginTop: 2,
  },
});