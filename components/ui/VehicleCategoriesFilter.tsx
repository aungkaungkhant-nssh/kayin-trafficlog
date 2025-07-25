import React from 'react';
import { View } from 'react-native';
import AppDropdown from './AppDropDown';

interface VehicleCategoriesFilterProps {
    vehicleCategories: any,
    vehicleCategoryId: string;
    setVehicleCategoryId: (val: string) => void;
}

const VehicleCategoriesFilter = (
    { vehicleCategoryId, setVehicleCategoryId, vehicleCategories }: VehicleCategoriesFilterProps
) => {

    return (
        <View style={{ marginVertical: 15 }}>
            <AppDropdown
                selectedValue={vehicleCategoryId}
                onValueChange={setVehicleCategoryId}
                options={vehicleCategories}
                placeholder={vehicleCategories[0]?.label}
                style={{ width: "100%" }}
                label='ယာဉ်အမျိုးအစား'
            />
        </View>
    )
}

export default React.memo(VehicleCategoriesFilter)