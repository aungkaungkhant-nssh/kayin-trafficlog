import OffenderVehicleDetails from '@/components/OffenderVehicleDetails';
import AppButton from '@/components/ui/AppButton';
import Divider from '@/components/ui/Divider';
import { LabelTypeEnum } from '@/utils/enum/LabelEnum';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Collapsible } from '../Collapsible';

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
                        <View style={styles.caseInfoContainer}>
                            <Text style={styles.caseInfoText}>
                                🧾 တရားစွဲအမှတ်: <Text style={styles.caseNumber}>{item.case_number}</Text>
                            </Text>
                            <Text style={styles.caseInfoText}>
                                📅 လုပ်ဆောင်သည့်ရက်စွဲ: <Text style={styles.caseDate}>{item.action_date}</Text>
                            </Text>
                        </View>
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
    caseInfoContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#e0f7fa',
        borderRadius: 8,
    },
    caseInfoText: {
        fontSize: 16,
        marginBottom: 4,
        color: '#00796b',
    },
    caseNumber: {
        fontWeight: 'bold',
        color: '#004d40',
    },
    caseDate: {
        fontWeight: 'bold',
        color: '#00695c',
    },
    recordScrollContent: {
        paddingBottom: 20,
    },
});
