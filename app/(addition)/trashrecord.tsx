import { AlertModal } from '@/components/ui/AlertModal';
import Header from '@/components/ui/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { caseFilterWithDateData2, deleteFullCaseDataByDateRangeSmart } from '@/database/offenderVehicles/offenderVehicles';
import { saveExcelToDownloads } from '@/helpers/saveExcelToDownLoad';
import { ExportTypeEnum } from '@/utils/enum/ExportType';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const primaryColor = '#000080';

const TrashRecord = () => {
    const router = useRouter()
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const year = new Date().getFullYear() - 4

    const handleRemove = async () => {
        setLoading(true)
        const startDate = format(new Date(year, 0, 1), 'yyyy-MM-dd');  // Jan 1
        const endDate = format(new Date(year, 11, 31), 'yyyy-MM-dd');
        const data = await caseFilterWithDateData2(startDate, endDate, '', ExportTypeEnum.All) as any;
        const fileName = `${year}-မှတ်တမ်းများ.xlsx`;
        await saveExcelToDownloads(data, fileName);
        if (data?.length) {
            await deleteFullCaseDataByDateRangeSmart(startDate, endDate, ExportTypeEnum.All);
        }

        setLoading(false);
        setSuccess(true)
    };

    return (
        <View style={styles.root}>
            <Header title="ဖျတ်ခြင်း" />

            <AlertModal
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false);

                }}
                onConfirm={() => {
                    setModalVisible(false);
                    handleRemove()
                }}
                message="မှတ်တမ်းများ ဖျတ်ရန် သေချာပါသလား။?"
                confirmText='သေချာပါသည်။'
                cancelText='မလုပ်တော့ပါ။'
                icon={<Ionicons name="shield-checkmark" size={70} color="#4CAF50" />}
            />

            <AlertModal
                visible={success}
                onCancel={() => {
                    setSuccess(false);
                }}
                onConfirm={() => {
                    setSuccess(false);
                    router.push("/(tabs)")
                }}
                message="မှတ်တမ်း ဖျတ်ခြင်းအောင်မြင်ပါသည်။"
                confirmText='မူလ'
                cancelText='ပိတ်မည်။'
                icon={<Ionicons name="shield-checkmark" size={70} color="#4CAF50" />}
            />
            {
                loading ? (
                    <LoadingSpinner />
                ) : (
                    <View style={styles.container}>
                        <View style={styles.card}>
                            <Text style={styles.year}>{year}</Text>
                            <Text style={styles.subtitle}>မှတ်တမ်းများ ကို ဖျတ်မည်။</Text>

                            <TouchableOpacity style={styles.removeButton} onPress={() => setModalVisible(true)}>
                                <Text style={styles.removeButtonText}>ဖျတ်မည်။</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        </View>
    );
};

export default TrashRecord;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    year: {
        fontSize: 48,
        fontWeight: 'bold',
        color: primaryColor,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        marginTop: 5,
    },
    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: primaryColor,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
