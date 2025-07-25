
import { toBurmeseNumber } from '@/helpers/toBurmeseNumber';
import globalStyles from '@/styles/globalStyles';
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AlertModal } from './AlertModal';
import AppButton from './AppButton';


interface Props {
    item: any;
    formData: any;
    modalState: boolean;
    setModalState: React.Dispatch<React.SetStateAction<any>>;
    setSelectedData: React.Dispatch<React.SetStateAction<any>>;
    router: any;
}

const SearchResultCard = ({
    item,
    formData,
    modalState,
    setModalState,
    setSelectedData,
    router,
}: Props) => {
    return (
        <View style={styles.itemContainer}>
            <AlertModal
                visible={modalState}
                onCancel={() => {
                    router.push('/(tabs)');
                    setModalState(false);
                    setSelectedData(null)
                }}
                onConfirm={() => {
                    setModalState(false);
                    setSelectedData(null)
                }}
                message="ပြစ်မှု ထည့်ခြင်း အောင်မြင်ပါသည်။"
                confirmText="ပိတ်မည်။"
                cancelText="မူလ စာမျက်နှာ"
                icon={<MaterialIcons name="check-circle" size={70} color="#4CAF50" />}
            />



            <View style={globalStyles.card}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.starButton}>
                        <AntDesign name="staro" size={24} color="#fff" />
                        <Text style={{ color: '#fff', marginLeft: 10 }}>
                            {item.vehicle_seizure_records?.[0]?.officer_name}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>ယာဉ်မောင်းအမည် -</Text>
                    <Text style={styles.value}>{item.name}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>မှတ်ပုံတင်နံပါတ် -</Text>
                    <Text style={styles.value}>{item.national_id_number || "မရှိ"}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>ယာဉ်အမျိုးအစား -</Text>
                    <Text style={styles.value}>{item.vehicle_types}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>ယာဉ်နံပါတ် -</Text>
                    <Text style={styles.value}>{item.vehicle_number}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={[styles.label, { color: 'red' }]}>ပြစ်မှုအကြိမ်အရေအတွက် -</Text>
                    <Text style={[styles.value, { color: 'red' }]}>
                        ({toBurmeseNumber(String(item.seizure_count))} ကြိမ်)
                    </Text>
                </View>

                <View style={styles.buttonRow}>
                    <AppButton
                        label="ပြစ်မှုထည့်မည်။"
                        onPress={() => setSelectedData(item)}
                        icon={(props) => <AntDesign name="pluscircle" size={props.size} color={props.color} />}
                        fullWidth
                    />
                    <AppButton
                        label="အသေးစိတ်ကြည့်မည်။"
                        onPress={() =>
                            router.push({
                                pathname: '/(stacks)/details',
                                params: {
                                    result: JSON.stringify(item),
                                    formData: JSON.stringify(formData)
                                }
                            })
                        }
                        icon={(props) => <Entypo name="eye" size={props.size} color={props.color} />}
                        fullWidth
                    />
                </View>
            </View>
        </View>
    );
};

export default React.memo(SearchResultCard);


const styles = StyleSheet.create({
    itemContainer: {
        paddingHorizontal: 14,
        paddingVertical: 12
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 12,
    },
    starButton: {
        flexDirection: "row",
        backgroundColor: "#000080",
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
        color: "#fff",
        alignItems: "center",

    },
    starText: {
        color: '#fff',
        fontSize: 16,
    },
    recordText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: "center"
    },
    label: {
        fontFamily: 'Myanmar-Regular',
        fontWeight: 'bold',
        marginRight: 6,
    },
    value: {
        flexShrink: 1,
        fontFamily: 'Myanmar-Bold'
    },
    buttonRow: {
        borderTopColor: '#ccc',
        borderTopWidth: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
        paddingTop: 12,
        justifyContent: 'space-between',
        gap: 8
    },
});
