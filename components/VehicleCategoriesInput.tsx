import { useVehicleCategories } from '@/hooks/useVehicleCategories';
import globalStyles from '@/styles/globalStyles';
import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { ControlProps } from './SeizedInput';
import AppDropdown from './ui/AppDropDown';



const VehicleCategoriesInput = ({ control, watch, errors, setValue }: ControlProps) => {
  const { vehicleCategories } = useVehicleCategories() as any;

  const selectedId = watch('vehicle_categories_id');

  // Only auto-select the first category if none is already selected
  useEffect(() => {
    if (vehicleCategories.length && !selectedId) {
      setValue('vehicle_categories_id', vehicleCategories[0].value);
      setValue('vehicle_categories_label', vehicleCategories[0].label);
    }
  }, [vehicleCategories, selectedId, setValue]);

  // Update label when user selects a category
  useEffect(() => {
    const selected = vehicleCategories.find((item: any) => item.value === selectedId);
    if (selected) {
      setValue('vehicle_categories_label', selected.label);
    }
  }, [selectedId, vehicleCategories, setValue]);

  return (
    <View style={styles.inputWrapper}>
      <View style={styles.dropDownContainer}>
        <Controller
          control={control}
          name="vehicle_categories_id"
          render={({ field: { onChange, value } }) => (
            <AppDropdown
              selectedValue={value}
              onValueChange={onChange}
              options={vehicleCategories}
              placeholder="ယာဉ်အမျိုးအစား ရွေးပါ"
              style={{ width: "100%" }}
              label="ယာဉ်အမျိုးအစား"
            />
          )}
        />
        {errors.vehicle_categories_id && (
          <Text style={globalStyles.errorText}>{errors.vehicle_categories_id.message}</Text>
        )}
      </View>
    </View>
  );
};


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