import { Collapsible } from '@/components/Collapsible';
import OffenderVehicleDetails from '@/components/OffenderVehicleDetails';
import AppButton from '@/components/ui/AppButton';
import Divider from '@/components/ui/Divider';
import Header from '@/components/ui/Header';
import { LabelTypeEnum } from '@/utils/enum/LabelEnum';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';


const Details = () => {
  const { result } = useLocalSearchParams();

  const searchData = JSON.parse(Array.isArray(result) ? result[0] : result);

  console.log(searchData.vehicle_seizure_records)
  return (
    <View>
      <Header
        title='အသေးစိတ်'
      />
      <ScrollView style={styles.container}>
        <View style={styles.collapseItem}>
          <Collapsible title="ယာဉ်မောင်းသူ အချက်အလက်">
            <OffenderVehicleDetails
              labelType={LabelTypeEnum.Offender}
              data={searchData}
            />
          </Collapsible>
        </View>

        <View style={styles.collapseItem}>
          <Collapsible title="ယာဉ်အချက်အလက်">
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
                <Collapsible title={record.seized_date}>
                  <OffenderVehicleDetails
                    labelType={LabelTypeEnum.Record}
                    data={record}
                  />
                  <Divider />
                  <AppButton
                    label='တရားစွဲ အမှတ်ထည့်မည်။'
                    onPress={() => console.log("hello")}
                    loading={false}
                  />
                </Collapsible>
              </View>
            ))
          )
        }

        {
          searchData?.vehicle_seizure_records && (
            searchData?.vehicle_seizure_records.map((record: any, index: number) => (
              <View style={styles.collapseItem} key={index}>
                <Collapsible title={record.seized_date}>
                  <OffenderVehicleDetails
                    labelType={LabelTypeEnum.Record}
                    data={record}
                  />
                </Collapsible>
              </View>
            ))
          )
        }



      </ScrollView>

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
  }
})