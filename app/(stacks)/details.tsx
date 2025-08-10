import AddCaseFormModal from '@/components/ui/AddCaseFormModal';
import { AlertModal } from '@/components/ui/AlertModal';
import Header from '@/components/ui/Header';
import { useOffenderDetail } from '@/hooks/useOffenderDetail';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';


const Details = () => {
  const { offenderVehicleId } = useLocalSearchParams();
  const searchId = JSON.parse(Array.isArray(offenderVehicleId) ? offenderVehicleId[0] : offenderVehicleId);

  const { offenderDetails } = useOffenderDetail({ offenderVehicleId: searchId });
  console.log(offenderDetails)
  // const searchData = JSON.parse(Array.isArray(result) ? result[0] : result);
  const router = useRouter()
  const [modalState, setModalState] = useState<{
    open: boolean;
    success: boolean;
    seizure_id: number | null;
  }>({
    open: false,
    success: false,
    seizure_id: null
  });
  return (
    <View>
      <Header
        title='အသေးစိတ်'
      />

      {/* success modal */}
      <AlertModal
        visible={modalState.success}
        onCancel={() => {
          router.push("/(tabs)");
          setModalState({ open: false, success: false, seizure_id: null });
        }}
        onConfirm={() => {
          router.push("/(tabs)/search");
          setModalState({ open: false, success: false, seizure_id: null });
        }}
        message="အောင်မြင်ပါသည်။"
        confirmText='ဆက်လက် ရှာဖွေမည်'
        cancelText='မူလ စာမျက်နှာ'
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


      {/* <ScrollView style={styles.container}>
        <View style={styles.collapseItem}>
          <Collapsible title="👤 ယာဉ်မောင်းသူ အချက်အလက်">
            <OffenderVehicleDetails
              labelType={LabelTypeEnum.Offender}
              data={searchData}
            />
          </Collapsible>
        </View>

        <View style={styles.collapseItem}>
          <Collapsible title="🚗 ယာဉ်အချက်အလက်">
            <OffenderVehicleDetails
              labelType={LabelTypeEnum.Vehicle}
              data={searchData}
            />
          </Collapsible>
        </View>

        <View style={{ marginVertical: 12 }}>
          <Text style={styles.recordTitle}>ပြစ်မှုမှတ်တမ်းများကို ရက်စွဲနှင့်အလိုက် အောက်တွင် ဖော်ပြထားသည်။</Text>
        </View>
        {
          searchData?.vehicle_seizure_records && (
            searchData?.vehicle_seizure_records.map((record: any, index: number) => (
              <View style={styles.collapseItem} key={index}>
                <Collapsible title={`📆 ${record.seized_date}`}>
                  <OffenderVehicleDetails
                    labelType={LabelTypeEnum.Record}
                    data={record}
                  />
                  <Divider />
                  {
                    !record.case_number && !record.action_date ? (
                      <AppButton
                        label='တရားစွဲ အမှတ်ထည့်မည်။'
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
                    )
                  }

                </Collapsible>
              </View>
            ))
          )
        }
      </ScrollView> */}
    </View>
  )
}

export default Details;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingVertical: 15,
    maxHeight: "89%"
  },
  collapseItem: {
    marginVertical: 8
  },
  recordTitle: {
    fontSize: 14,
    color: "red"
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

})