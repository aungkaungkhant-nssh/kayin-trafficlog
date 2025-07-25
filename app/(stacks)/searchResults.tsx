import AppButton from '@/components/ui/AppButton';
import Header from '@/components/ui/Header';
import PunishmentFormModal from '@/components/ui/PunishmentFormModal';
import SearchResultCard from '@/components/ui/SearchResultCard';
import { searchOffenderVehicles } from '@/database/offenderVehicles/offenderVehicles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

const SearchResults = () => {
    const [modalState, setModalState] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const { results, formData } = useLocalSearchParams();

    const [searchData, setSearchData] = useState<any[]>(() =>
        JSON.parse(Array.isArray(results) ? results[0] : results)
    );
    const searchFormData = JSON.parse(Array.isArray(formData) ? formData[0] : formData);

    const handleAddPunishment = useCallback(async () => {
        setModalState(true);
        setSearchData([])
        const freshResults = await searchOffenderVehicles(searchFormData);
        setSearchData(freshResults);
    }, []);

    const router = useRouter();

    const renderItem = ({ item }: any) => (
        <SearchResultCard
            key={item.offender_id}
            formData={formData}
            item={item}
            modalState={modalState}
            setModalState={setModalState}
            setSelectedData={setSelectedData}
            router={router}
        />

    );
    return (
        <>
            <PunishmentFormModal
                item={selectedData}
                visible={selectedData ? true : false}
                onCancel={() => setSelectedData(null)}
                onConfirm={handleAddPunishment}
            />

            <FlatList
                data={searchData}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        {renderItem({ item })}
                    </View>
                )}
                keyExtractor={(item) => item.offender_vehicle_id}
                ListHeaderComponent={<Header title="ရှာမည်" />}
                stickyHeaderIndices={[0]}
            />
            <View>
                <AppButton
                    label='အသစ်ထည့်မည်။'
                    onPress={() => router.push("/(stacks)/addPunishment")}
                />
            </View>
        </>

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