import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function CalendarInput() {
    const [date, setDate] = useState<Date | null>(null);
    const [show, setShow] = useState(false);

    return (
        <View >
            <TextInput
                style={[styles.input]}
                label="ဖမ်းဆည်းသည့်နေ့"
                value={date ? date.toLocaleDateString() : ''}
                onFocus={() => setShow(true)}
                left={<TextInput.Icon icon="calendar" onPress={() => setShow(true)} />}
            />

            {show && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="default"
                    onChange={(_, selectedDate) => {
                        setShow(false);
                        if (selectedDate) setDate(selectedDate);
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

