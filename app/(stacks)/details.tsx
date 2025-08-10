import { Collapsible } from '@/components/Collapsible';
import OffenderVehicleDetails from '@/components/OffenderVehicleDetails';
import AddCaseFormModal from '@/components/ui/AddCaseFormModal';
import { AlertModal } from '@/components/ui/AlertModal';
import AppButton from '@/components/ui/AppButton';
import Divider from '@/components/ui/Divider';
import Header from '@/components/ui/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Pagination from '@/components/ui/Pagination';
import YearFilter from '@/components/ui/YearFilter';
import { useOffenderDetail } from '@/hooks/useOffenderDetail';
import { LabelTypeEnum } from '@/utils/enum/LabelEnum';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const Details = () => {
  const router = useRouter();
  const { result } = useLocalSearchParams();
  const searchData = JSON.parse(Array.isArray(result) ? result[0] : result);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [page, setPage] = useState(1);       // <-- Pagination page state
  const limit = 4;                           // <-- Records per page

  // Destructure data from your hook
  const {
    offenderDetails,
    loading,
    totalCount,   // <-- Add this to your hook, see note below
  } = useOffenderDetail({
    offenderVehicleId: searchData.offender_vehicle_id,
    year: selectedYear,
    page,
    limit,
  });

  // Calculate total pages based on totalCount and limit
  const totalPages = Math.ceil(totalCount / limit);

  // Reset page to 1 whenever year changes
  useEffect(() => {
    setPage(1);
  }, [selectedYear]);

  // Modal state unchanged
  const [modalState, setModalState] = useState<{
    open: boolean;
    success: boolean;
    seizure_id: number | null;
  }>({
    open: false,
    success: false,
    seizure_id: null,
  });

  // Pagination UI component

  return (
    <View style={{ flex: 1 }}>
      <Header title="အသေးစိတ်" />

      {/* success modal */}
      <AlertModal
        visible={modalState.success}
        onCancel={() => {
          router.push('/(tabs)');
          setModalState({ open: false, success: false, seizure_id: null });
        }}
        onConfirm={() => {
          router.push('/(tabs)/search');
          setModalState({ open: false, success: false, seizure_id: null });
        }}
        message="အောင်မြင်ပါသည်။"
        confirmText="ဆက်လက် ရှာဖွေမည်"
        cancelText="မူလ စာမျက်နှာ"
        icon={<MaterialIcons name="check-circle" size={70} color="#4CAF50" />}
      />

      <AddCaseFormModal
        item={{ seizure_id: modalState.seizure_id }}
        visible={modalState.open}
        onCancel={() => {
          setModalState({ open: false, success: false, seizure_id: null });
        }}
        onConfirm={async () => {
          setModalState({ open: false, success: true, seizure_id: null });
        }}
      />

      <ScrollView style={styles.container}>
        <View style={styles.collapseItem}>
          <Collapsible title="👤 ယာဉ်မောင်းသူ အချက်အလက်">
            <OffenderVehicleDetails labelType={LabelTypeEnum.Offender} data={searchData} />
          </Collapsible>
        </View>

        <View style={styles.collapseItem}>
          <Collapsible title="🚗 ယာဉ်အချက်အလက်">
            <OffenderVehicleDetails labelType={LabelTypeEnum.Vehicle} data={searchData} />
          </Collapsible>
        </View>

        <View style={{ marginVertical: 12 }}>
          <Text style={styles.recordTitle}>
            ပြစ်မှု မှတ်တမ်းဟောင်းများကို နှစ်အလိုက် အောက်တွင် ဖော်ပြထားသည်။
          </Text>
        </View>

        <YearFilter years={years} selectedYear={selectedYear} onSelectYear={setSelectedYear} />

        {loading ? (
          <LoadingSpinner />
        ) : offenderDetails.length > 0 ? (
          offenderDetails.map((record: any, index: number) => (
            <View style={styles.collapseItem} key={index}>
              <Collapsible title={`📆 ${record.seized_date}`}>
                <OffenderVehicleDetails labelType={LabelTypeEnum.Record} data={record} />
                <Divider />
                {!record.case_number && !record.action_date ? (
                  <AppButton
                    label="တရားစွဲ အမှတ်ထည့်မည်။"
                    onPress={() => {
                      setModalState({ open: true, success: false, seizure_id: record.seizure_id });
                    }}
                    loading={false}
                  />
                ) : (
                  <View style={styles.caseInfoContainer}>
                    <Text style={styles.caseInfoText}>
                      🧾 တရားစွဲအမှတ်: <Text style={styles.caseNumber}>{record.case_number}</Text>
                    </Text>
                    <Text style={styles.caseInfoText}>
                      📅 လုပ်ဆောင်သည့်ရက်စွဲ: <Text style={styles.caseDate}>{record.action_date}</Text>
                    </Text>
                  </View>
                )}
              </Collapsible>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20, fontFamily: 'Myanmar-Bold' }}>{`${selectedYear} ခုနှစ်တွင် မှတ်တမ်းမရှိပါ။`}</Text>
        )}
        {/* Pagination */}
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      </ScrollView>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingVertical: 15,
    maxHeight: '89%',
  },
  collapseItem: {
    marginVertical: 8,
  },
  recordTitle: {
    fontSize: 14,
    color: 'red',
  },
  caseInfoContainer: {
    marginBottom: 4,
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
  caseInfoText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#00796b',
  },
  caseNumber: {
    fontWeight: 'bold',
    color: '#004d40',
  },
  caseDate: {
    fontWeight: 'bold',
    color: '#00695c',
  },
  loadMoreContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  loadMoreText: {
    backgroundColor: '#000080',
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    fontSize: 16,
    fontWeight: '500',
    overflow: 'hidden',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  pageNumberButton: {
    marginHorizontal: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  activePage: {
    backgroundColor: '#000080',
  },
  pageNumberText: {
    color: '#000',
    fontWeight: '600',
  },
  activePageText: {
    color: '#fff',
  },
});
