import { useSeizedItems } from '@/hooks/useSeizedItems';
import { AddPunishmentInfoSchemaType } from '@/schema/addPunishmentInfo.schema';
import globalStyles from '@/styles/globalStyles';
import React, { useEffect } from 'react';
import { Control, Controller, FieldErrors, UseFormWatch } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import AppDropdown from './ui/AppDropDown';

export type ControlProps = {
  control: Control<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<AddPunishmentInfoSchemaType>;
  setValue: any;
};


const SeizedInput = ({ control, watch, errors, setValue }: ControlProps) => {
  const { seizedItems } = useSeizedItems() as any;

  const selectedId = watch('seizedItem_id');

  useEffect(() => {
    if (seizedItems.length) {
      setValue('seizedItem_id', seizedItems[0].value);
      setValue('seizedItem_label', seizedItems[0].label);
    }
  }, [seizedItems, setValue]);

  // Update vehicle_categories when user changes dropdown
  useEffect(() => {
    const selected = seizedItems.find((item: any) => item.value === selectedId);
    if (selected) {
      setValue('seizedItem_label', selected.label);
    }
  }, [selectedId, seizedItems, setValue]);

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


