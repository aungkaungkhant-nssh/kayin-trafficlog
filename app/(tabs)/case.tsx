import CaseRecord from '@/components/ui/CaseRecords';
import DateFilter from '@/components/ui/DateFilter';
import ExportButton from '@/components/ui/ExportButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import NotFound from '@/components/ui/NotFound';
import VehicleCategoriesFilter from '@/components/ui/VehicleCategoriesFilter';
import { caseFilterWithDateData } from '@/database/offenderVehicles/offenderVehicles';
import { useCaseFilterWithDate } from '@/hooks/useCase';
import { useVehicleCategories } from '@/hooks/useVehicleCategories';
import { format, subDays } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const Case = () => {
    const today = new Date();
    const tenDaysAgo = subDays(today, 10);
    const { vehicleCategories } = useVehicleCategories() as any;
    const [fromDate, setFromDate] = useState(format(tenDaysAgo, 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(today, 'yyyy-MM-dd'));
    const [vehicleCategoryId, setVehicleCategoryId] = useState("");

    useEffect(() => {
        if (vehicleCategories.length && !vehicleCategoryId) {
            setVehicleCategoryId(vehicleCategories[0].value);
        }
    }, [vehicleCategories]);


    const { cases, loading, loadMore, hasMore } = useCaseFilterWithDate(
        fromDate,
        toDate,
        vehicleCategoryId
    );

    const handleExport = async () => {
        const data = await caseFilterWithDateData(fromDate, toDate, vehicleCategoryId) as any;
        console.log(data.length)
    }

    return (
        <View style={styles.container}>
            <DateFilter
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
            />
            {
                vehicleCategoryId && (
                    <VehicleCategoriesFilter
                        vehicleCategories={vehicleCategories}
                        vehicleCategoryId={vehicleCategoryId}
                        setVehicleCategoryId={setVehicleCategoryId}
                    />
                )
            }
            {
                (loading && cases.length === 0) ? (
                    <LoadingSpinner />
                ) : (
                    cases?.length ? (
                        <CaseRecord data={cases} onEndReached={loadMore} loading={loading} hasMore={hasMore} />
                    ) : (
                        <NotFound />
                    )
                )

            }
            <ExportButton onPress={handleExport} />
        </View>
    )
}

export default Case;

const styles = StyleSheet.create({
    container: {
        padding: 14,
        flex: 1
    },
    headerContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",

    }
})