import { useVehicleCategories } from '@/hooks/useVehicleCategories';
import globalStyles from '@/styles/globalStyles';
import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { ControlProps } from './SeizedInput';
import AppDropdown from './ui/AppDropDown';



const VehicleCategoriesInput = ({ control, watch, errors, setValue }: ControlProps) => {
  const { vehicleCategories } = useVehicleCategories() as any;

  const selectedId = watch('seizedItem_id');

  useEffect(() => {
    if (vehicleCategories.length) {
      setValue('vehicle_categories_id', vehicleCategories[0].value);
      setValue('vehicle_categories_label', vehicleCategories[0].label);
    }
  }, [vehicleCategories, setValue]);

  // Update vehicle_categories when user changes dropdown
  useEffect(() => {
    const selected = vehicleCategories.find((item: any) => item.value === selectedId);
    if (selected) {
      setValue('vehicle_categories_label', selected.label);
    }
  }, [selectedId, vehicleCategories, setValue]);

  return (
    <View style={styles.inputWrapper}>
      <View style={styles.dropDownContainer}>
        <View>
          <Controller
            control={control}
            name="vehicle_categories_id"
            render={({ field: { onChange, value } }) => (
              <AppDropdown
                selectedValue={value}
                onValueChange={onChange}
                options={vehicleCategories}
                placeholder={vehicleCategories[0]?.label}
                style={{ width: "100%" }}
                label='ယာဉ်အမျိုးအစား'
              />
            )}
          />
          {errors.vehicle_categories_id && (
            <Text style={globalStyles.errorText}>{errors.vehicle_categories_id.message}</Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default VehicleCategoriesInput;


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