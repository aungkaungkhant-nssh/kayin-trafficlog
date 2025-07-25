import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
  style?: any
}

function AppDropDown(props: CustomDropdownProps) {
  const {
    label,
    options,
    selectedValue,
    onValueChange,
    placeholder = 'Select an option',
    style,
  } = props;

  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const selectedLabel =
    options.find(option => option.value === selectedValue)?.label || placeholder;

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.wrapper,]}>
      {label && (
        <Text style={[
          styles.floatingLabel,
          selectedValue ? styles.floatingLabelActive : null
        ]}>
          {label}
        </Text>
      )}

      <TouchableOpacity style={[styles.dropdown, style, { borderColor: "#000080" }]} onPress={() => setVisible(true)}>
        <Text style={[
          styles.dropdownText
        ]}>
          {selectedLabel}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#888" style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={search}
              onChangeText={setSearch}
            />
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={filteredOptions}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item.value);
                    setSearch('');
                    setVisible(false);
                  }}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noResult}>No matching option</Text>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default AppDropDown;
const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginTop: 8, // Space for label
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    fontSize: 12,
    color: '#000080',
    zIndex: 1,
  },
  floatingLabelActive: {
    color: '#000080', // Active label color
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#f2f2f2',
    minHeight: 55,
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#00000077',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: 350,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  option: {
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  noResult: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 20,
  },
});

