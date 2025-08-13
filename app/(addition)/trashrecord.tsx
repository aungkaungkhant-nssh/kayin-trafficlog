import { AlertModal } from '@/components/ui/AlertModal';
import AppButton from '@/components/ui/AppButton';
import Divider from '@/components/ui/Divider';
import Header from '@/components/ui/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import NotFound from '@/components/ui/NotFound';
import YearFilter from '@/components/ui/YearFilter';
import { caseFilterWithDateData2, deleteFullCaseDataByDateRangeSmart } from '@/database/offenderVehicles/offenderVehicles';
import { saveExcelToDownloads } from '@/helpers/saveExcelToDownLoad';
import { useTrashYear } from '@/hooks/useTrashYear';
import { ExportTypeEnum } from '@/utils/enum/ExportType';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const primaryColor = '#000080';

const TrashRecord = () => {
    const router = useRouter()
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { trashYearLoading, trashYears, selectedYear, setSelectedYear, setTrashYears } = useTrashYear();

    const handleRemove = async () => {
        if (selectedYear) {
            setLoading(true)
            const startDate = format(new Date(selectedYear, 0, 1), 'yyyy-MM-dd');
            const endDate = format(new Date(selectedYear, 11, 31), 'yyyy-MM-dd');
            const updatedTrashYear = trashYears.filter((year) => year !== selectedYear);
            const data = await caseFilterWithDateData2(startDate, endDate, '', ExportTypeEnum.All) as any;
            const fileName = `${selectedYear}-မှတ်တမ်းများ.xlsx`;
            await saveExcelToDownloads(data, fileName);
            if (data?.length) {
                await deleteFullCaseDataByDateRangeSmart(startDate, endDate, ExportTypeEnum.All);
            }
            setLoading(false);
            setSuccess(true)
            setTrashYears(updatedTrashYear);
        }

    };


    return (
        <View style={styles.root}>
            <Header title="မှတ်တမ်းဟောင်းများ ဖယ်ထုတ်ခြင်း" />

            <AlertModal
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false);

                }}
                onConfirm={() => {
                    setModalVisible(false);
                    handleRemove()
                }}
                message={`(${selectedYear})မှတ်တမ်းများ ဖယ်ထုတ်ရန် သေချာပါသလား။`}
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
                message="မှတ်တမ်းများ ဖယ်ထုတ်ခြင်း အောင်မြင်ပါသည်။"
                confirmText='မူလ'
                cancelText='ပိတ်မည်။'
                icon={<Ionicons name="shield-checkmark" size={70} color="#4CAF50" />}
            />
            {
                loading || trashYearLoading ? (
                    <LoadingSpinner />
                ) : trashYears.length === 0 ? (
                    <NotFound
                        subtitle='လွန်ခဲ့သော ၄ နှစ် နောက်ပိုင်း မှတ် တမ်း ဟောင်းများ မရှိပါ။'
                    />
                ) : (
                    <View style={styles.container}>
                        <View style={styles.card}>
                            <View>
                                <YearFilter years={trashYears} selectedYear={selectedYear} onSelectYear={(year: number) => year && setSelectedYear(year)} />
                            </View>
                            <Divider />
                            <View style={styles.instructionWrap}>
                                <Text style={styles.instructionText}>
                                    မှတ်တမ်းဟောင်းများအား
                                    <Text style={styles.highlight}> Excel ဖိုင် </Text>
                                    ဖြင့် သိမ်းဆည်းပေးပါမည်။
                                </Text>
                                <Text style={styles.instructionText}>
                                    ဖယ်ထုတ်ပြီးသော မှတ်တမ်းဟောင်းများကို ဆော့ဖ်ဝဲ အတွင်းသို ပြန်လည်သွင်း၍ ရမည် မဟုတ်ပါ။
                                </Text>
                            </View>
                            <Divider />
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                <AppButton
                                    label='နောက်သို့'
                                    onPress={() => router.push("/(tabs)")}
                                    loading={false}
                                    mode={"outlined"}

                                />

                                <AppButton
                                    label='ဖယ်ထုတ်မည်။'
                                    onPress={() => setModalVisible(true)}
                                    loading={false}
                                    mode={"outlined"}

                                />
                            </View>

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
        backgroundColor: primaryColor,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: "center"
    },
    instructionWrap: {
        marginVertical: 10,
        gap: 8,
    },
    instructionText: {
        fontSize: 15,
        color: '',
        lineHeight: 22,
    },
    highlight: {
        color: '#e74c3c', // darker for emphasis
    },
    warningHighlight: {
        fontWeight: '600',
        color: '#e74c3c', // red for warning
    },

});
