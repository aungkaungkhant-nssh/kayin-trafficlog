import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Badge } from 'react-native-paper';
import { Collapsible } from '../Collapsible';
import CaseInfo from './CaseInfo';

interface PropsType {
    data: any[],
    onEndReached: () => void,
    loading: boolean,
    hasMore: boolean
}

const CaseRecords = ({ data, onEndReached, loading, hasMore }: PropsType) => {
    const renderItem = ({ item }: any) => (
        <View style={styles.collapseItem}>
            <Collapsible title={`🚗 ${item.vehicle_number} | 👤 ${item.offender_name}`}>
                <View style={styles.row}>
                    <View style={styles.labelRow}>
                        <MaterialIcons name="info-outline" size={16} color="#555" style={styles.icon} />
                        <Text style={styles.label}>အမျိုးအစား/အရောင်</Text>
                    </View>
                    <Text style={styles.value}>{item.vehicle_types}</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.labelRow}>
                        <MaterialIcons name="info-outline" size={16} color="#555" style={styles.icon} />
                        <Text style={styles.label}>နေရာ</Text>
                    </View>
                    <Text style={styles.value}>{item.seizure_location}</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.labelRow}>
                        <MaterialIcons name="info-outline" size={16} color="#555" style={styles.icon} />
                        <Text style={styles.label}>မှတ်ပုံတင်အမှတ်</Text>
                    </View>
                    <Text style={styles.value}>{item.national_id_number || "မရှိ"}</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.labelRow}>
                        <MaterialIcons name="info-outline" size={16} color="#555" style={styles.icon} />
                        <Text style={styles.label}>အဘအမည်</Text>
                    </View>
                    <Text style={styles.value}>{item.offender_father_name}</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.labelRow}>
                        <MaterialIcons name="info-outline" size={16} color="#555" style={styles.icon} />
                        <Text style={styles.label}>နေရပ်လိပ်စာ</Text>
                    </View>
                    <Text style={styles.value}>{item.address}</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.labelRow}>
                        <MaterialIcons name="info-outline" size={16} color="#555" style={styles.icon} />
                        <Text style={styles.label}>အရေးယူပုဒ်မ</Text>
                    </View>
                    <Badge style={styles.disciplineBadge}>{`${item.article_number}/${item.offense_name}`}</Badge>
                </View>
                <View style={styles.row}>
                    <View style={styles.labelRow}>
                        <MaterialIcons name="info-outline" size={16} color="#555" style={styles.icon} />
                        <Text style={styles.label}>အရေးယူအရာရှိ</Text>
                    </View>
                    <Text style={styles.value}>{item.officer_name}</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.labelRow}>
                        <MaterialIcons name="info-outline" size={16} color="#555" style={styles.icon} />
                        <Text style={styles.label}>ဖမ်းဆည်းသည့်နေ့</Text>
                    </View>
                    <Text style={styles.value}>{item.seized_date}</Text>
                </View>
                {
                    item.case_number && item.action_date && (
                        <View style={styles.row}>
                            <View style={styles.labelRow}>
                                <MaterialIcons name="info-outline" size={16} color="#555" style={styles.icon} />
                                <Text style={styles.label}>ဒဏ်ငွေ</Text>
                            </View>
                            <Text style={styles.value}>{item.fine_amount}</Text>
                        </View>
                    )
                }

                <View style={styles.row}>
                    <View style={styles.labelRow}>
                        <MaterialIcons name="info-outline" size={16} color="#555" style={styles.icon} />
                        <Text style={styles.label}>သိမ်းဆည်းပစ္စည်း</Text>
                    </View>
                    <Text style={styles.value}>{item.seized_item_name}</Text>
                </View>

                {
                    item.case_number && item.action_date && (
                        <CaseInfo
                            caseNumber={item.case_number}
                            actionDate={item.action_date}
                        />
                    )
                }


            </Collapsible>
        </View>
    );

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
            onEndReached={() => {
                if (hasMore && !loading) {
                    onEndReached();
                }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
                loading && hasMore ? (
                    <Text style={{ textAlign: "center", padding: 10 }}>Loading more...</Text>
                ) : null
            }
        />
    );
}

export default CaseRecords;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ccc",
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginVertical: 10,
        borderRadius: 5
    },
    collapseItem: {
        marginVertical: 8
    },
    itemBody: {
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: 6,
    },
    label: {
        fontSize: 15,
        color: '#333',
    },
    value: {
        fontSize: 15,
        fontFamily: 'Myanmar-Bold',
        color: '#212121',
        maxWidth: '60%',
        textAlign: 'right',
    },
    missing: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#b0bec5',
    },
    disciplineBadge: {
        backgroundColor: '#d32f2f',
        color: 'white',
        fontWeight: 'bold',
        paddingHorizontal: 10,
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
})