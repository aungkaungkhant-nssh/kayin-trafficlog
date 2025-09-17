import confirmLabels from '@/constants/ConfirmLabels';
import { LabelTypeEnum } from '@/utils/enum/LabelEnum';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Badge } from 'react-native-paper';

interface OffenderVehicleDetailsProp {
    labelType: LabelTypeEnum;
    data: any;
    isEditing?: boolean;
    onChange?: (updatedData: any) => void;
}

const OffenderVehicleDetails = ({
    labelType,
    data,
    isEditing = false,
    onChange,
}: OffenderVehicleDetailsProp) => {
    const labels = confirmLabels.filter((label) => label.type === labelType);

    const [fieldEditing, setFieldEditing] = useState<{ [key: string]: boolean }>({});
    const [formData, setFormData] = useState({ ...data });

    const handleChange = (name: string, value: string) => {
        const updated = { ...formData, [name]: value };
        setFormData(updated);

        if (onChange) {
            onChange(updated); // send to parent
        }
    };

    return (
        <View style={styles.container}>
            {labels.map(({ id, name, label }) => {
                let valueContent;

                if (name === 'disciplinary_input') {
                    const article = formData['article_number'];
                    const offense = formData['offense_name'];

                    if (isEditing && fieldEditing[name]) {
                        // Show two input boxes side by side
                        valueContent = (
                            <View style={styles.disciplineInputRow}>
                                <TextInput
                                    style={[styles.input, styles.disInput]}
                                    placeholder="ဆောင်းပါး အမှတ်"
                                    value={article ? String(article) : ''}
                                    onChangeText={(text) => handleChange('article_number', text)}
                                />
                                <TextInput
                                    style={[styles.input, styles.disInput]}
                                    placeholder="ပြစ်မှုအမည်"
                                    value={offense ? String(offense) : ''}
                                    onChangeText={(text) => handleChange('offense_name', text)}
                                />
                            </View>
                        );
                    } else {
                        valueContent =
                            article && offense ? (
                                <Badge style={styles.disciplineBadge} size={26}>
                                    {`${article}/${offense}`}
                                </Badge>
                            ) : (
                                <Text style={styles.missing}>မရှိ</Text>
                            );
                    }
                } else if (isEditing && fieldEditing[name]) {
                    valueContent = (
                        <TextInput
                            style={styles.input}
                            value={formData[name] ? String(formData[name]) : ''}
                            onChangeText={(text) => handleChange(name, text)}
                            autoFocus
                        />
                    );
                } else {
                    const value = formData[name];
                    valueContent =
                        value !== undefined && value !== null && value !== '' ? (
                            <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
                                {value}
                            </Text>
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

                        <View style={styles.valueRow}>
                            {valueContent}
                            {isEditing && (
                                <TouchableOpacity
                                    onPress={() =>
                                        setFieldEditing((prev) => ({ ...prev, [name]: !prev[name] }))
                                    }
                                >
                                    <MaterialIcons
                                        name={fieldEditing[name] ? 'check' : 'edit'}
                                        size={20}
                                        color="#00796b"
                                        style={{ marginLeft: 8 }}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

export default OffenderVehicleDetails;

const styles = StyleSheet.create({
    container: { paddingHorizontal: 4, paddingTop: 4 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    labelRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    icon: { marginRight: 6 },
    label: { fontSize: 15, color: '#333' },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
        maxWidth: '65%',
    },
    value: {
        fontSize: 15,
        fontFamily: 'Myanmar-Bold',
        color: '#212121',
        textAlign: 'right',
        flexShrink: 1,
    },
    missing: { fontSize: 14, fontStyle: 'italic', color: '#b0bec5' },
    disciplineBadge: {
        backgroundColor: '#d32f2f',
        color: 'white',
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#888',
        fontSize: 15,
        minWidth: 100,
        textAlign: 'right',
        flexShrink: 1,
    },
    disciplineInputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    disInput: {
        flex: 1,
        marginRight: 8,
    },
});
