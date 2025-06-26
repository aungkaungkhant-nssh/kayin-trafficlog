import { useSeizedItems } from '@/hooks/useSeizedItems';
import { AddPunishmentSchemaType } from '@/schema/addPunishment.schema';
import globalStyles from '@/styles/globalStyles';
import React from 'react';
import { Control, Controller, FieldErrors, UseFormWatch } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import AppDropdown from './ui/AppDropDown';

export type ControlProps = {
  control: Control<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<AddPunishmentSchemaType>;
};


const SeizedInput = ({ control, watch, errors }: ControlProps) => {
  const { seizedItems } = useSeizedItems() as any;
  return (
    <View style={globalStyles.inputWrapper}>
      <View style={styles.dropDownContainer}>
        <View>
          <Controller
            control={control}
            name="seizedItem_id"
            render={({ field: { onChange, value } }) => (
              <AppDropdown
                selectedValue={value}
                onValueChange={onChange}
                options={seizedItems}
                placeholder={seizedItems[0]?.label}
                style={{ width: "100%" }}
                label='သိမ်းဆည်းပစ္စည်း'
              />
            )}
          />
          {errors.seizedItem_id && (
            <Text style={globalStyles.errorText}>{errors.seizedItem_id.message}</Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default SeizedInput;


const styles = StyleSheet.create({
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