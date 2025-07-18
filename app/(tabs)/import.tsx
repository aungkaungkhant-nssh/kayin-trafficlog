import { AlertModal } from '@/components/ui/AlertModal';
import { importJsonData } from '@/database/offenderVehicles/offenderVehicles';
import { getJsonData } from '@/helpers/getJsonData';
import { useVehicleCategories } from '@/hooks/useVehicleCategories';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
        // const result = await DocumentPicker.getDocumentAsync({
        //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        //     copyToCacheDirectory: true,
        // });
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
            copyToCacheDirectory: true,
            multiple: false, // optional
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
        const jsonData = await getJsonData(selectedFiles);
        if (!jsonData?.length) return;
        const res = await importJsonData(jsonData);
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


            <TouchableOpacity style={styles.uploadBox} onPress={handlePickFile}>
                <View style={styles.iconCircle}>
                    <Ionicons name="cloud-upload-outline" size={28} color="#fff" />
                </View>
                <Text style={styles.uploadText}>ဖိုင်ရွေးရန်</Text>
            </TouchableOpacity>

            <>
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
    uploadBox: {
        borderStyle: 'dashed',
        borderColor: '#000080',
        borderWidth: 2,
        borderRadius: 16,
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        backgroundColor: '#fff',
    },
    iconCircle: {
        backgroundColor: '#000080',
        borderRadius: 50,
        padding: 15,
        marginBottom: 10,
    },
    uploadText: {
        color: '#000080',
        fontSize: 16,
        fontWeight: '500',
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
