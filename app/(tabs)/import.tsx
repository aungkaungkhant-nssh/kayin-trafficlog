import { importData } from '@/database/offenderVehicles/offenderVehicles';
import { pickAndParseExcelFile } from '@/helpers/pickUpAndParseExcelFile';
import { useVehicleCategories } from '@/hooks/useVehicleCategories'; // Adjust path if needed
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const Import = () => {
    const { vehicleCategories } = useVehicleCategories();
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);


    const handleImport = async () => {
        const jsonData = await pickAndParseExcelFile();
        if (!jsonData || !selectedCategoryId) return;
        await importData(jsonData, selectedCategoryId)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ဒေတာဖိုင် အမျိုးအစားရွေးချယ်ရန်</Text>

            <View style={styles.buttonGroup}>
                {vehicleCategories.map((category: any) => {
                    const isSelected = selectedCategoryId === category.value;

                    return (
                        <TouchableOpacity
                            key={category.value}
                            style={[styles.button, isSelected && styles.selectedButton]}
                            onPress={() => setSelectedCategoryId(category.value)}
                            activeOpacity={0.85}
                        >
                            <Text style={[styles.buttonText, isSelected && styles.selectedText]}>
                                {category.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {selectedCategoryId !== null && (
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleImport}
                    activeOpacity={0.85}
                >
                    <Text style={styles.confirmButtonText}>ဖိုင်ထည့်မည်</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Import;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fdfdfd',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontFamily: 'Myanmar-Bold', // Ensure font is available
        marginBottom: 20,
        textAlign: 'center',
        color: '#222',
    },
    buttonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    button: {
        width: '48%',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 12,
        elevation: 3, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    selectedButton: {
        backgroundColor: '#000080',
        borderColor: '#000080',
        shadowOpacity: 0.2,
    },
    buttonText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#333',
    },
    selectedText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    confirmButton: {
        backgroundColor: '#000080',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
