import confirmLabels from '@/constants/ConfirmLabels';
import { LabelTypeEnum } from '@/utils/enum/LabelEnum';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from 'react-native-paper';


interface OffenderVehicleDetailsProp {
    labelType: LabelTypeEnum,
    data: any
}
const OffenderVehicleDetails = ({ labelType, data }: OffenderVehicleDetailsProp) => {
    console.log(data)
    const labels = confirmLabels.filter((label) => label.type === labelType);
    return (
        <View>
            {labels.map(({ id, name, label }) => (
                <View style={styles.row} key={id}>
                    <Text style={styles.label}>{label}</Text>

                    {name === "disciplinary_input" ? (
                        <Badge
                            style={{ backgroundColor: 'red' }}
                            size={25}
                        >
                            {`${data["article_number"]}/${data["offense_name"]}`}
                        </Badge>
                    ) : (
                        <Text style={styles.value}>
                            {data[name] || "မရှိ"}
                        </Text>
                    )}

                </View>
            ))}
        </View>
    )
}

export default OffenderVehicleDetails;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        // borderBottomWidth: 1,
        // borderBottomColor: '#E0E0E0',
    },
    label: {
        fontSize: 16,
        color: '#555',
    },
    value: {
        fontSize: 16,
        fontFamily: 'Myanmar-Bold'
        // fontWeight: 'bold',
    },
});


