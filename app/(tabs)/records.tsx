import { AlertModal } from '@/components/ui/AlertModal';
import CaseRecord from '@/components/ui/CaseRecords';
import DateFilter from '@/components/ui/DateFilter';
import ExportButton from '@/components/ui/ExportButton';
import ExportModal from '@/components/ui/ExportModal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import NotFound from '@/components/ui/NotFound';
import VehicleCategoriesFilter from '@/components/ui/VehicleCategoriesFilter';
import vehicleCategoriesData from '@/constants/VehicleCategories';
import { caseFilterWithDateData2 } from '@/database/offenderVehicles/offenderVehicles';
import { exportSeizureDataToJson } from '@/helpers/exportJsonFile';
import { saveExcelToDownloads } from '@/helpers/saveExcelToDownLoad';
import { useCaseFilterWithDate } from '@/hooks/useCase';
import { useVehicleCategories } from '@/hooks/useVehicleCategories';
import { ExportTypeEnum } from '@/utils/enum/ExportType';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const Records = () => {
    const today = new Date();
    const { vehicleCategories } = useVehicleCategories() as any;
    const [fromDate, setFromDate] = useState(format(today, 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(today, 'yyyy-MM-dd'));
    const [vehicleCategoryId, setVehicleCategoryId] = useState("");
    const [exportType, setExportType] = useState(ExportTypeEnum.All);
    const [visible, setVisible] = useState(false);
    const [isAlert, setIsAlert] = useState(false);

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

    const handleExport = async (isShare = false) => {
        const data = await caseFilterWithDateData2(fromDate, toDate, vehicleCategoryId, exportType) as any;

        if (data.length) {
            if (exportType === ExportTypeEnum.All) {
                const fileName = `${toDate}-${data[0].officer_name}.json`
                await exportSeizureDataToJson(data, fileName, isShare);
            }
            if (exportType === ExportTypeEnum.Filed) {
                const fileName = `${toDate} ${vehicleCategoriesData[+vehicleCategoryId - 1]}ဖိုင်.xlsx`;
                await saveExcelToDownloads(data, fileName, isShare)
            }
        } else {
            setIsAlert(true)
        }
        setVisible(false)
        // if (data?.length) {
        //     const fileName = `${toDate} ${vehicleCategoriesData[+vehicleCategoryId - 1]}ဖိုင်.xlsx`;
        //     await saveExcelToDownloads(data, fileName)
        // }

    }
    return (
        <View style={styles.container}>
            <AlertModal
                visible={isAlert}
                message="ဒေတာမရှိပါ။"
                onConfirm={() => setIsAlert(false)}
                onCancel={() => setIsAlert(false)}
                confirmText="ပိတ်မည်။"
            />
            <ExportModal
                exportType={exportType}
                setExportType={setExportType}
                visible={visible}
                onCancel={() => setVisible(false)}
                onConfirm={() => handleExport()}
                onShare={() => handleExport(true)}
            />
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
            <ExportButton onPress={() => setVisible(true)} />
        </View>
    )
}

export default Records;

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