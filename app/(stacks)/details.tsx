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
import { updateCollapseData } from '@/database/offenderVehicles/offenderVehicles';
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
  const [page, setPage] = useState(1);
  const limit = 4;

  const { offenderDetails, loading, totalCount } = useOffenderDetail({
    offenderVehicleId: searchData.offender_vehicle_id,
    year: selectedYear,
    page,
    limit,
  });

  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    setPage(1);
  }, [selectedYear]);

  const [editOffender, setEditOffender] = useState(false);
  const [editVehicle, setEditVehicle] = useState(false);
  const [offenderData, setOffenderData] = useState(searchData);
  const [vehicleData, setVehicleData] = useState(searchData);
  const [originalOffenderData] = useState(searchData);
  const [originalVehicleData] = useState(searchData);

  const [editableRecords, setEditableRecords] = useState<any[]>([]);
  const [recordEditState, setRecordEditState] = useState<{ [key: number]: boolean }>({});
  const [activeEdit, setActiveEdit] = useState<{ type: 'offender' | 'vehicle' | 'record'; id: number | null } | null>(null);

  const [modalState, setModalState] = useState<{
    open: boolean;
    success: boolean;
    seizure_id: number | null;
  }>({ open: false, success: false, seizure_id: null });

  useEffect(() => {
    setEditableRecords(offenderDetails);
  }, [offenderDetails]);

  const handleCancel = () => {
    if (!activeEdit) return;
    switch (activeEdit.type) {
      case 'offender':
        setOffenderData({ ...originalOffenderData });
        setEditOffender(false);
        break;
      case 'vehicle':
        setVehicleData({ ...originalVehicleData });
        setEditVehicle(false);
        break;
      case 'record':
        if (activeEdit.id !== null) {
          const originalRecord = offenderDetails.find(r => r.seizure_id === activeEdit.id);
          setEditableRecords(prev =>
            prev.map(r => (r.seizure_id === activeEdit.id ? { ...originalRecord! } : r))
          );
          setRecordEditState(prev => ({ ...prev, [activeEdit.id!]: false }));
        }
        break;
    }
    setActiveEdit(null);
  };

  // ✅ Save function
  const handleSave = async () => {
    if (!activeEdit) return;

    let dataToSave: any;
    let isChangeRecord = false; // default

    switch (activeEdit.type) {
      case 'offender':
        dataToSave = offenderData;
        break;
      case 'vehicle':
        dataToSave = vehicleData;
        break;
      case 'record':
        if (activeEdit.id !== null) {
          dataToSave = editableRecords.find(r => r.seizure_id === activeEdit.id);
          isChangeRecord = true; // <-- set true for record edits
        }
        break;
    }


    if (!dataToSave) return;
    try {
      const res = await updateCollapseData(dataToSave, isChangeRecord);
      if (res.success) {
        setModalState({ open: false, success: true, seizure_id: null });

        // Close edit mode
        if (activeEdit.type === 'offender') setEditOffender(false);
        if (activeEdit.type === 'vehicle') setEditVehicle(false);
        if (activeEdit.type === 'record' && activeEdit.id !== null)
          setRecordEditState(prev => ({ ...prev, [activeEdit.id!]: false }));

        setActiveEdit(null);
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <Header title="အသေးစိတ်" />

      {/* Success modal */}
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
        onCancel={() => setModalState({ open: false, success: false, seizure_id: null })}
        onConfirm={async () => setModalState({ open: false, success: true, seizure_id: null })}
      />

      <ScrollView style={styles.container}>
        {/* 👤 Offender */}
        <View style={styles.collapseItem}>
          <Collapsible title="👤 ယာဉ်မောင်းသူ အချက်အလက်">
            <OffenderVehicleDetails
              labelType={LabelTypeEnum.Offender}
              data={offenderData}
              isEditing={editOffender}
              onChange={setOffenderData}
            />
            <Divider />
            <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: editOffender ? 'space-between' : 'flex-start' }}>
              <View style={{ flex: editOffender ? 0.48 : 1 }}>
                <AppButton
                  label={editOffender ? 'သေချာပါသည်။' : 'ပြင်ဆင်မည်။'}
                  onPress={() => {
                    if (!editOffender) {
                      setActiveEdit({ type: 'offender', id: null });
                      setEditOffender(true);
                    } else {
                      handleSave();
                    }
                  }}
                />
              </View>
              {editOffender && (
                <View style={{ flex: 0.48 }}>
                  <AppButton label="မလုပ်တော့ပါ။" onPress={handleCancel} mode="outlined" />
                </View>
              )}
            </View>
          </Collapsible>
        </View>

        {/* 🚗 Vehicle */}
        <View style={styles.collapseItem}>
          <Collapsible title="🚗 ယာဉ်အချက်အလက်">
            <OffenderVehicleDetails
              labelType={LabelTypeEnum.Vehicle}
              data={vehicleData}
              isEditing={editVehicle}
              onChange={setVehicleData}
            />
            <Divider />
            <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: editVehicle ? 'space-between' : 'flex-start' }}>
              <View style={{ flex: editVehicle ? 0.48 : 1 }}>
                <AppButton
                  label={editVehicle ? 'သေချာပါသည်။' : 'ပြင်ဆင်မည်။'}
                  onPress={() => {
                    if (!editVehicle) {
                      setActiveEdit({ type: 'vehicle', id: null });
                      setEditVehicle(true);
                    } else {
                      handleSave();
                    }
                  }}
                />
              </View>
              {editVehicle && (
                <View style={{ flex: 0.48 }}>
                  <AppButton label="မလုပ်တော့ပါ။" onPress={handleCancel} mode="outlined" />
                </View>
              )}
            </View>
          </Collapsible>
        </View>

        {/* 🔹 Records */}
        <View style={{ marginVertical: 12 }}>
          <Text style={styles.recordTitle}>
            ပြစ်မှု မှတ်တမ်းဟောင်းများကို နှစ်အလိုက် အောက်တွင် ဖော်ပြထားသည်။
          </Text>
        </View>

        <YearFilter years={years} selectedYear={selectedYear} onSelectYear={setSelectedYear} />

        {loading ? (
          <LoadingSpinner />
        ) : editableRecords.length > 0 ? (
          editableRecords.map(record => (
            <View style={styles.collapseItem} key={record.seizure_id}>
              <Collapsible title={`📆 ${record.seized_date}`}>
                <OffenderVehicleDetails
                  labelType={LabelTypeEnum.Record}
                  data={record}
                  isEditing={recordEditState[record.seizure_id] || false}
                  onChange={updated =>
                    setEditableRecords(prev =>
                      prev.map(r => (r.seizure_id === record.seizure_id ? updated : r))
                    )
                  }
                />
                <Divider />

                {/* Edit / Cancel buttons */}
                <View style={{
                  flexDirection: 'row',
                  marginTop: 8,
                  justifyContent: recordEditState[record.seizure_id] ? 'space-between' : 'flex-start'
                }}>
                  <View style={{ flex: recordEditState[record.seizure_id] ? 0.48 : 1 }}>
                    <AppButton
                      label={recordEditState[record.seizure_id] ? 'သေချာပါသည်။' : 'ပြင်ဆင်မည်။'}
                      onPress={() => {
                        if (!recordEditState[record.seizure_id]) {
                          setActiveEdit({ type: 'record', id: record.seizure_id });
                          setRecordEditState(prev => ({ ...prev, [record.seizure_id]: true }));
                        } else {
                          handleSave();
                        }
                      }}
                    />
                  </View>
                  {recordEditState[record.seizure_id] && (
                    <View style={{ flex: 0.48 }}>
                      <AppButton label="မလုပ်တော့ပါ။" onPress={handleCancel} mode="outlined" />
                    </View>
                  )}
                </View>

                {!record.case_number && !record.action_date && (
                  <AppButton
                    label="တရားစွဲ အမှတ်ထည့်မည်။"
                    onPress={() => setModalState({ open: true, success: false, seizure_id: record.seizure_id })}
                    loading={false}
                  />
                )}
              </Collapsible>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20, fontFamily: 'Myanmar-Bold' }}>
            {`${selectedYear} ခုနှစ်တွင် မှတ်တမ်းမရှိပါ။`}
          </Text>
        )}

        {/* Pagination */}
        <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
      </ScrollView>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: { marginHorizontal: 20, paddingVertical: 15, maxHeight: '89%' },
  collapseItem: { marginVertical: 8 },
  recordTitle: { fontSize: 14, color: 'red' },
  caseInfoContainer: { marginBottom: 4, padding: 10, backgroundColor: '#e0f7fa', borderRadius: 8 },
  caseInfoText: { fontSize: 16, marginBottom: 4, color: '#00796b' },
  caseNumber: { fontWeight: 'bold', color: '#004d40' },
  caseDate: { fontWeight: 'bold', color: '#00695c' },
});
