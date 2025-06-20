// components/CustomDropdown.tsx
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Option {
    label: string;
    value: string;
}

interface CustomDropdownProps {
    label?: string;
    options: Option[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
}

const AppDropDown: React.FC<CustomDropdownProps> = ({
    label,
    options,
    selectedValue,
    onValueChange,
    placeholder = 'Select an option',
}) => {
    const [visible, setVisible] = useState(false);

    const selectedLabel =
        options.find(option => option.value === selectedValue)?.label || placeholder;

    return (
        <View>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity style={styles.dropdown} onPress={() => setVisible(true)}>
                <Text style={styles.dropdownText}>{selectedLabel}</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="#888" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>

            <Modal transparent visible={visible} animationType="fade">
                <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={options}
                            keyExtractor={item => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => {
                                        onValueChange(item.value);
                                        setVisible(false);
                                    }}
                                >

                                    <Text>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default AppDropDown;

const styles = StyleSheet.create({
    label: { fontSize: 16, marginBottom: 4 },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        backgroundColor: '#fff',
    },
    dropdownText: { fontSize: 16 },
    overlay: {
        flex: 1,
        backgroundColor: '#00000077',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        maxHeight: 300,
    },
    option: {
        padding: 16,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
});
