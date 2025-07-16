import { AlertModal } from '@/components/ui/AlertModal';
import { importData } from '@/database/offenderVehicles/offenderVehicles';
import { pickAndParseExcelFiles } from '@/helpers/pickUpAndParseExcelFile';
import { useVehicleCategories } from '@/hooks/useVehicleCategories';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const Import = () => {
    const { vehicleCategories } = useVehicleCategories();
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handlePickFile = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets?.length) {
            setSelectedFiles(prev => [...prev, result.assets[0]]);
        }
    };

    const handleRemoveFile = (uri: string) => {
        setSelectedFiles(prev => prev.filter(file => file.uri !== uri));
    };

    const handleImport = async () => {

        if (!selectedFiles.length || !selectedCategoryId) return;

        const jsonData = await pickAndParseExcelFiles(selectedFiles);
        if (!jsonData.length) return;

        const res = await importData(jsonData, selectedCategoryId);
        if (res?.success) setIsSuccess(true);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <AlertModal
                visible={isSuccess}
                onCancel={() => setIsSuccess(false)}
                onConfirm={() => {
                    router.push("/(tabs)");
                    setIsSuccess(false);
                }}
                message="ဒေတာဖိုင်ထည့်ခြင်း အောင်မြင်ပါသည်။"
                confirmText="မူလ စာမျက်နှာ"
                cancelText="ပိတ်မည်"
                icon={<MaterialIcons name="check-circle" size={70} color="#4CAF50" />}
            />

            <Text style={styles.title}>ဒေတာအမျိုးအစား ရွေးချယ်ရန်</Text>

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
                <>
                    <TouchableOpacity style={styles.confirmButton} onPress={handlePickFile}>

                        <Text style={styles.confirmButtonText}>📄 ဖိုင်ရွေးရန်</Text>
                    </TouchableOpacity>

                    {selectedFiles.length > 0 && (
                        <>
                            <View style={styles.fileList}>
                                {selectedFiles.map(file => (
                                    <View key={file.uri} style={styles.fileItem}>
                                        <Text numberOfLines={1} style={styles.fileName}>{file.name}</Text>
                                        <TouchableOpacity onPress={() => handleRemoveFile(file.uri)}>
                                            <Text style={styles.removeText}>ဖျက်မည်</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={[styles.confirmButton, { backgroundColor: '#000080' }]}
                                onPress={handleImport}
                            >
                                <Text style={[styles.confirmButtonText, { color: "#fff" }]}>📥 ဖိုင်ထည့်မည်</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </>
            )}
        </ScrollView>
    );
};

export default Import;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#fdfdfd',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontFamily: 'Myanmar-Bold', // Ensure the font is available in your assets
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
        elevation: 3,
        shadowColor: '#000',
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
        borderWidth: 1.5,
        borderColor: '#000080',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        backgroundColor: 'transparent', // Ensure no fill
    },
    confirmButtonText: {
        color: '#000080',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fileList: {
        marginTop: 10,
        marginBottom: 10,
    },
    fileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    fileName: {
        fontSize: 14,
        flex: 1,
        marginRight: 12,
        color: '#444',
    },
    removeText: {
        color: 'red',
        fontSize: 14,
    },
});
