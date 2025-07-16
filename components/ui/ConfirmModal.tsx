import confirmLabels from '@/constants/ConfirmLabels';
import getDisciplinaryFormat from '@/helpers/getDisplinaryFormat';
import getNrcFormat from '@/helpers/getNrcFormat';
import { AddPunishmentInfoSchemaType } from '@/schema/addPunishmentInfo.schema';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';


type ConfirmModalProps = {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    icon?: React.ReactNode;
    data: AddPunishmentInfoSchemaType
};

export function ConfirmModal({
    visible,
    onConfirm,
    onCancel,
    message = 'ထွက်ရန်သေချာပါသလား',
    confirmText = 'သေချာပါသည်။',
    cancelText = 'မပြုလုပ်တော့ပါ',
    icon,
    data
}: ConfirmModalProps) {
    const theme = useTheme();
    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onCancel}
                contentContainerStyle={{
                    backgroundColor: 'white',
                    paddingTop: 12,
                    paddingBottom: 0,
                    margin: 20,
                    borderRadius: 8,
                }}
            >
                <View style={{ marginBottom: 16, alignItems: "center" }}>
                    {icon ? (
                        icon
                    ) : (
                        <AntDesign
                            name="warning"
                            size={40}
                            color={theme.colors.error}

                        />
                    )}
                </View>
                <Text style={{ textAlign: 'center', fontSize: 18, marginBottom: 20, fontWeight: 'bold' }}>
                    {message}
                </Text>

                <ScrollView
                    style={{ maxHeight: 500 }} // You can adjust height as needed
                    showsVerticalScrollIndicator={true}
                >
                    <View style={{ paddingHorizontal: 16 }}>
                        {
                            confirmLabels.map(({ id, name, label }) => (
                                <View style={styles.row} key={id}>
                                    <Text style={styles.label}>{label}</Text>
                                    <Text style={styles.value}>
                                        {
                                            name === "national_id_number"
                                                ? getNrcFormat(data.nrcNumber, data.nrcState, data.nrcType, data.nrcTownShip)
                                                : name === "disciplinary_input"
                                                    ? getDisciplinaryFormat(data.article_label, data.committed_label)
                                                    : data[name as keyof AddPunishmentInfoSchemaType] || "မရှိ"
                                        }
                                    </Text>
                                </View>
                            ))
                        }

                    </View>
                </ScrollView>


                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        borderTopWidth: 1,
                        borderTopColor: '#ccc',
                        paddingVertical: 8,
                    }}
                >
                    <Button
                        onPress={onCancel}
                        textColor={theme.colors.primary}
                        style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#ccc' }}
                        mode="text"
                    >
                        {cancelText}
                    </Button>
                    <View
                        style={{
                            width: 1,
                            backgroundColor: '#ccc',
                        }}
                    />
                    <Button
                        onPress={onConfirm}
                        textColor={theme.colors.error}
                        style={{ flex: 1 }}
                        mode="text"
                    >
                        {confirmText}
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
}


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    label: {
        fontSize: 16,
        color: '#555',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});