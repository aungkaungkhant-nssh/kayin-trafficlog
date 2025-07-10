import React from 'react';
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
    return (
        <View style={styles.headerContainer}>
            <CalendarInput
                value={fromDate}
                onChange={(value) => setFromDate(value)}
                label='ရက်နေ့မှ'
            />
            <CalendarInput
                value={toDate}
                onChange={(value) => setToDate(value)}
                label='ရက်နေ့အထိ'
            />
        </View>
    )
}

export default DateFilter;


const styles = StyleSheet.create({
    container: {
        padding: 14,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",

    }
})