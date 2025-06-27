import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { View } from 'react-native';
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';

type AlertModalProps = {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    icon?: React.ReactNode;
};

export function AlertModal({
    visible,
    onConfirm,
    onCancel,
    message = 'ထွက်ရန်သေချာပါသလား',
    confirmText = 'အတည်ပြုမည်',
    cancelText = 'မပြုလုပ်တော့ပါ',
    icon,
}: AlertModalProps) {
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
                    alignItems: 'center',
                    top: '-10%',
                }}
            >
                <View style={{ marginBottom: 16 }}>
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
                        onPressOut={onCancel}
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
                        onPressOut={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
}
