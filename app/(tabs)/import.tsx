import { AlertModal } from '@/components/ui/AlertModal';
import AppButton from '@/components/ui/AppButton';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { importJsonData } from '@/database/offenderVehicles/offenderVehicles';
import { getJsonData } from '@/helpers/getJsonData';
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
    const year = new Date().getFullYear() - 4;
    const [isExpire, setIsExpire] = useState(false)
    const [state, setState] = useState({
        isLoading: false,
        isSuccess: false,
        selectedFiles: [] as any[],
    });
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handlePickFile = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
            copyToCacheDirectory: true,
            multiple: false,
        }) as any;
        const jsonData = await getJsonData([result.assets[0]]);
        if (jsonData?.length) {
            const hasExpireYear = jsonData.some(item => {
                if (!item.seized_date) return false;
                const itemYear = new Date(item.seized_date).getFullYear();
                return itemYear <= year;
            });
            if (hasExpireYear) {
                setIsExpire(true)
                return;
            }


            if (!result.canceled && result.assets?.length) {
                setState(prev => ({
                    ...prev,
                    selectedFiles: [...prev.selectedFiles, result.assets[0]],
                }));
            }
        }


    };

    const handleRemoveFile = (uri: string) => {
        setState(prev => ({
            ...prev,
            selectedFiles: prev.selectedFiles.filter(file => file.uri !== uri),
        }));
    };

    const handleImport = async () => {
        if (!state.selectedFiles.length) return;

        setState(prev => ({ ...prev, isLoading: true }));
        const jsonData = await getJsonData(state.selectedFiles);
        if (!jsonData?.length) return;
        const res = await importJsonData(jsonData);

        if (res?.success) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                isSuccess: true,
                selectedFiles: [],
            }));
        } else {
            setState(prev => ({ ...prev, isLoading: false }));
            setError("အမှားတစ်ခုဖြစ်ပွားခဲ့သည်။ ကျေးဇူးပြု၍ ပြန်လည်ကြိုးစားပါ။");
        }

    };

    if (error) {
        return <ErrorMessage message={error} onDismiss={() => setError(null)} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <AlertModal
                visible={state.isSuccess}
                onCancel={() => setState(prev => ({ ...prev, isSuccess: false }))}
                onConfirm={() => {
                    router.push("/(tabs)");
                    setState(prev => ({ ...prev, isSuccess: false }));
                }}
                message="ဒေတာဖိုင်ထည့်ခြင်း အောင်မြင်ပါသည်။"
                confirmText="မူလ စာမျက်နှာ"
                cancelText="ပိတ်မည်"
                icon={<MaterialIcons name="check-circle" size={70} color="#4CAF50" />}
            />

            <AlertModal
                visible={isExpire}
                onCancel={() => setIsExpire(false)}
                onConfirm={() => {
                    router.push("/(tabs)");
                    setIsExpire(false);
                }}
                message="(၄)နှစ်အတွင်း ‌မှတ်တမ်းများသာ ထည့်သွင်းခွင့်ရှိပါမည်။"
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

            {state.selectedFiles.length > 0 && (
                <>
                    <View style={styles.fileList}>
                        {state.selectedFiles.map(file => (
                            <View key={file.uri} style={styles.fileItem}>
                                <Text numberOfLines={1} style={styles.fileName}>{file.name}</Text>
                                <TouchableOpacity onPress={() => handleRemoveFile(file.uri)}>
                                    <Text style={styles.removeText}>ဖျက်မည်</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    <AppButton
                        label="📥 ဖိုင်ထည့်မည်"
                        onPress={handleImport}
                        loading={state.isLoading}
                    />
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
