import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';

interface CalendarInputProps {
    value: string;  // Assuming you store date as string in form state
    onChange: (val: string) => void;
}

export default function CalendarInput({ value, onChange }: CalendarInputProps) {
    const [show, setShow] = useState(false);

    return (
        <View>
            <TextInput
                style={[styles.input]}
                label="ဖမ်းဆည်းသည့်နေ့"
                value={value}
                onFocus={() => setShow(true)}
                left={<TextInput.Icon icon="calendar" onPress={() => setShow(true)} />}
            />

            {show && (
                <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(_, selectedDate) => {
                        setShow(false);
                        if (selectedDate) {
                            const formatted = selectedDate.toISOString().split('T')[0];  // Example: "2024-06-26"
                            onChange(formatted);
                        }
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#f2f2f2',
    },
});

