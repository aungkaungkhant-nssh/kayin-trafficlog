import AppButton from '@/components/ui/AppButton';
import Header from '@/components/ui/Header';
import PunishmentFormModal from '@/components/ui/PunishmentFormModal';
import { toBurmeseNumber } from '@/helpers/toBurmeseNumber';
import globalStyles from '@/styles/globalStyles';
import { Entypo } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SearchResults = () => {
    const [isPunishmentModalOpen, setIsPunishmentModalOpen] = useState<boolean>(false);
    const { results } = useLocalSearchParams();
    const searchData = JSON.parse(Array.isArray(results) ? results[0] : results);
    const router = useRouter();
    const renderItem = ({ item }: any) => (
        <>
            <PunishmentFormModal
                item={item}
                visible={isPunishmentModalOpen}
                onCancel={() => {
                    setIsPunishmentModalOpen(false)
                }}
                onConfirm={async () => {
                    console.log("work")

                }}
            />
            <View style={[globalStyles.card]} key={item.id}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.starButton}>
                        <AntDesign name="staro" size={24} color="#fff" />
                        <Text style={{ color: "#fff", marginLeft: 10 }}>
                            {item.vehicle_seizure_records?.[0].officer_name}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>ယာဉ်မောင်းအမည် -</Text>
                    <Text style={styles.value}>{item.name}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>မှတ်ပုံတင်နံပါတ် -</Text>
                    <Text style={styles.value}>{item.national_id_number}</Text>
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
                    <Text style={[styles.label, { color: "red" }]}>ပြစ်မှုအကြိမ်အရေအတွက် -</Text>
                    <Text style={[styles.value, { color: "red" }]}>
                        ({toBurmeseNumber(String(item.seizure_count))} ကြိမ်)
                    </Text>
                </View>

                <View style={styles.buttonRow}>
                    <AppButton
                        label='ပြစ်မှုထည့်မည်။'
                        onPress={() => setIsPunishmentModalOpen(true)}
                        loading={false}
                        icon={(props) => <AntDesign name="pluscircle" size={props.size} color={props.color} />}
                        fullWidth={true}
                    />
                    <AppButton
                        label='အသေးစိတ်ကြည့်မည်။'
                        onPress={() => router.push({ pathname: "/(stacks)/details", params: { result: JSON.stringify(item) } })}
                        loading={false}
                        icon={(props) => <Entypo name="eye" size={props.size} color={props.color} />}
                        fullWidth={true}
                    />
                </View>
            </View>
        </>

    );

    return (
        <FlatList
            data={searchData}
            renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                    {renderItem({ item })}
                </View>
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<Header title="ရှာမည်" />}
            stickyHeaderIndices={[0]}
        />
    );
}

export default SearchResults;


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