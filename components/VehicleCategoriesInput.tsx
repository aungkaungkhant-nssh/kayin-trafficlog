import { useVehicleCategories } from '@/hooks/useVehicleCategories';
import React from 'react';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import AppDropdown from './ui/AppDropDown';

export type ControlProps = {
  control: Control<any>;
  watch: UseFormWatch<any>;
};


const VehicleCategoriesInput = ({ control, watch }: ControlProps) => {
  const { vehicleCategories } = useVehicleCategories() as any;
  return (
    <View style={styles.inputWrapper}>
      <Text style={{ color: "#333", marginBottom: 5 }}>ယာဉ်အမျိုးအစား</Text>
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
              />
            )}
          />
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