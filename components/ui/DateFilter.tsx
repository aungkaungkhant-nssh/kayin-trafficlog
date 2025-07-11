import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import CalendarInput from './CalendarInput';


interface DateFilterProps {
    fromDate: string;
    toDate: string;
    setFromDate: (val: string) => void;
    setToDate: (val: string) => void;
}


const DateFilter = (
    { fromDate, toDate, setFromDate, setToDate }: DateFilterProps
) => {
    const handleFromDateChange = useCallback(
        (value: string) => setFromDate(value),
        [setFromDate]
    );

    const handleToDateChange = useCallback(
        (value: string) => setToDate(value),
        [setToDate]
    );

    return (
        <View style={styles.headerContainer}>
            <CalendarInput
                value={fromDate}
                onChange={handleFromDateChange}
                label='ရက်နေ့မှ'
            />
            <CalendarInput
                value={toDate}
                onChange={handleToDateChange}
                label='ရက်နေ့အထိ'
            />
        </View>
    );
};



export default React.memo(DateFilter);


const styles = StyleSheet.create({
    container: {
        padding: 14,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",

    }
})