import OffenderVehicleDetails from '@/components/OffenderVehicleDetails';
import AppButton from '@/components/ui/AppButton';
import Divider from '@/components/ui/Divider';
import { LabelTypeEnum } from '@/utils/enum/LabelEnum';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Collapsible } from '../Collapsible';
import CaseInfo from './CaseInfo';

const recordHeader = () => (
    <View style={styles.stickyRecordHeader}>
        <Text style={styles.recordTitle}>
            ပြစ်မှုမှတ်တမ်းများကို ရက်စွဲနှင့်အလိုက် အောက်တွင် ဖော်ပြထားသည်။
        </Text>
    </View>
);

// renderItem now receives { item } and uses onAddCase from closure
const Records = ({ records, onAddCase }: { records: any[]; onAddCase: (id: number) => void }) => {
    const renderItem = ({ item }: { item: any }) => {
        return (
            <View style={styles.collapseItem}>
                <Collapsible title={`📆 ${item.seized_date}`}>
                    <OffenderVehicleDetails labelType={LabelTypeEnum.Record} data={item} />
                    <Divider />
                    {!item.case_number && !item.action_date ? (
                        <AppButton
                            label="တရားစွဲ အမှတ်ထည့်မည်။"
                            onPress={() => onAddCase(item.seizure_id)}
                            loading={false}
                        />
                    ) : (
                        <CaseInfo
                            caseNumber={item.case_number}
                            actionDate={item.actionDate}
                        />
                    )}
                </Collapsible>
            </View>
        );
    };

    return (
        <FlatList
            data={records}
            keyExtractor={(item, index) => String(item.seizure_id ?? index)}
            renderItem={renderItem}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={recordHeader}
            contentContainerStyle={styles.recordScrollContent}
        />
    );
};

export default Records;

const styles = StyleSheet.create({
    collapseItem: {
        marginVertical: 8,
    },
    stickyRecordHeader: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    recordTitle: {
        fontSize: 14,
        color: 'red',
        fontWeight: '700',
        textAlign: 'center',
    },
    recordScrollContent: {
        paddingBottom: 20,
    },
});
