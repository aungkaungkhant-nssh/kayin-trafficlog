import AppButton from '@/components/ui/AppButton';
import Header from '@/components/ui/Header';
import { toBurmeseNumber } from '@/helpers/toBurmeseNumber';
import globalStyles from '@/styles/globalStyles';
import { Entypo } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const dummyData = [
    {
        id: '1',
        officer: "ဒုရဲမှူးမျိုးကျော်ညွှန့်",
        driverName: "မောင်မောင်",
        vehicle: "Honda (Fit) / အနက်ရောင်",
        plateNumber: "7W/222222",
        nrc: "၉/တာမွေ(၁)၂၂၂၂၂",
        offenceCount: 1,
    },
    {
        id: '2',
        officer: "ဒုရဲမှူးမျိုးကျော်ညွှန့်",
        driverName: "မောင်မောင်",
        vehicle: "Honda (Fit) / အနက်ရောင်",
        plateNumber: "7W/222222",
        nrc: "၉/တာမွေ(၁)၂၂၂၂၂",
        offenceCount: 1,
    },
    {
        id: '3',
        officer: "ဒုရဲမှူးမျိုးကျော်ညွှန့်",
        driverName: "မောင်မောင်",
        vehicle: "Honda (Fit) / အနက်ရောင်",
        plateNumber: "7W/222222",
        nrc: "၉/တာမွေ(၁)၂၂၂၂၂",
        offenceCount: 1,
    }
]

const SearchResults = () => {
    const { results } = useLocalSearchParams();
    const searchData = JSON.parse(Array.isArray(results) ? results[0] : results);
    console.log(searchData)

    const renderItem = ({ item }: any) => (
        <View style={[globalStyles.card]} key={item.id}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.starButton}>
                    <AntDesign name="staro" size={24} color="#fff" />
                    <Text style={{ color: "#fff", marginLeft: 10 }}>
                        {item.officer_name}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>ယာဉ်မောင်းအမည် -</Text>
                <Text style={styles.value}>{item.offender_name}</Text>
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
                    onPress={() => console.log("Add")}
                    loading={false}
                    icon={(props) => <AntDesign name="pluscircle" size={props.size} color={props.color} />}
                    fullWidth={true}
                />
                <AppButton
                    label='အသေးစိတ်ကြည့်မည်။'
                    onPress={() => console.log("Detail")}
                    loading={false}
                    icon={(props) => <Entypo name="eye" size={props.size} color={props.color} />}
                    fullWidth={true}
                />
            </View>
        </View>
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