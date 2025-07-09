import confirmLabels from '@/constants/ConfirmLabels';
import { LabelTypeEnum } from '@/utils/enum/LabelEnum';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from 'react-native-paper';

interface OffenderVehicleDetailsProp {
    labelType: LabelTypeEnum;
    data: any;
}

const OffenderVehicleDetails = ({ labelType, data }: OffenderVehicleDetailsProp) => {
    const labels = confirmLabels.filter((label) => label.type === labelType);

    return (
        <View style={styles.container}>
            {labels.map(({ id, name, label }) => {
                let valueContent;

                // Handle special field: disciplinary_input
                if (name === 'disciplinary_input') {
                    const article = data['article_number'];
                    const offense = data['offense_name'];

                    if (article && offense) {
                        valueContent = (
                            <Badge style={styles.disciplineBadge} size={26}>
                                {`${article}/${offense}`}
                            </Badge>
                        );
                    } else {
                        valueContent = <Text style={styles.missing}>မရှိ</Text>;
                    }
                } else {
                    const value = data[name];

                    valueContent =
                        value !== undefined && value !== null && value !== '' ? (
                            <Text style={styles.value}>{value}</Text>
                        ) : (
                            <Text style={styles.missing}>မရှိ</Text>
                        );
                }

                return (
                    <View style={styles.row} key={id}>
                        <View style={styles.labelRow}>
                            <MaterialIcons name="info-outline" size={16} color="#555" style={styles.icon} />
                            <Text style={styles.label}>{label}</Text>
                        </View>
                        {valueContent}
                    </View>
                );
            })}
        </View>
    );
};

export default OffenderVehicleDetails;
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 4,
        paddingTop: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: 6,
    },
    label: {
        fontSize: 15,
        color: '#333',
    },
    value: {
        fontSize: 15,
        fontFamily: 'Myanmar-Bold',
        color: '#212121',
        maxWidth: '60%',
        textAlign: 'right',
    },
    missing: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#b0bec5',
    },
    disciplineBadge: {
        backgroundColor: '#d32f2f',
        color: 'white',
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
});
