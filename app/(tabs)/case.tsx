import CaseRecord from '@/components/ui/CaseRecords';
import DateFilter from '@/components/ui/DateFilter';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useCaseFilterWithDate } from '@/hooks/useCase';
import { format, subDays } from 'date-fns';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const Case = () => {
    const today = new Date();
    const tenDaysAgo = subDays(today, 10);

    const [fromDate, setFromDate] = useState(format(tenDaysAgo, 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(today, 'yyyy-MM-dd'));
    const { cases, loading, error, loadMore, hasMore } = useCaseFilterWithDate(
        fromDate,
        toDate
    );

    if (loading && cases.length === 0) {
        return <LoadingSpinner />
    }

    return (
        <View style={styles.container}>
            <DateFilter
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
            />
            <CaseRecord data={cases} onEndReached={loadMore} loading={loading} hasMore={hasMore} />
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