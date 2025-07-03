import { Collapsible } from '@/components/Collapsible';
import OffenderDetails from '@/components/OffenderDetails';
import Header from '@/components/ui/Header';
import { LabelTypeEnum } from '@/utils/enum/LabelEnum';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';


const Details = () => {
  const { result } = useLocalSearchParams();

  const searchData = JSON.parse(Array.isArray(result) ? result[0] : result);

  console.log(searchData.national_id_number)
  return (
    <View>
      <Header
        title='အသေးစိတ်'
      />
      <ScrollView style={styles.container}>
        <View style={styles.collapseItem}>
          <Collapsible title="ယာဉ်မောင်းသူ အချက်အလက်">
            <OffenderDetails
              labelType={LabelTypeEnum.Offender}
              data={searchData}
            />
          </Collapsible>
        </View>

        <View style={styles.collapseItem}>
          <Collapsible title="ယာဉ်အချက်အလက်">
            <OffenderDetails
              labelType={LabelTypeEnum.Vehicle}
              data={searchData}
            />
          </Collapsible>
        </View>

        <View style={styles.collapseItem}>
          <Collapsible title="ကျူးလွန်ပြစ်မှုများ">
            <OffenderDetails
              labelType={LabelTypeEnum.Record}
              data={searchData}
            />
          </Collapsible>
        </View>

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
  }
})