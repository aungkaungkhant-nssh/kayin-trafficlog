import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Modal, Portal, useTheme } from 'react-native-paper';
import AppButton from './AppButton';


type LogoutModalProps = {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    onLogin: () => void;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    loginText?: string;
    icon?: React.ReactNode;
}; // assuming you have a custom AppButton

export function LogoutModal({
    visible,
    onConfirm,
    onCancel,
    onLogin,
    message = 'ထွက်ရန်သေချာပါသလား',
    confirmText = 'ထွက်မည်။',
    cancelText = 'ပယ်ဖျတ်မည်။',
    loginText = 'လော့အင်စာမျက်နှာ',
    icon,
}: LogoutModalProps) {
    const theme = useTheme();

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onCancel}
                contentContainerStyle={{
                    backgroundColor: 'white',
                    marginHorizontal: 24,
                    paddingVertical: 28,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    alignItems: 'center',
                    elevation: 4,
                }}
            >
                {/* Icon */}
                <View style={{ marginBottom: 16 }}>
                    {icon || (
                        <AntDesign name="warning" size={48} color={theme.colors.error} />
                    )}
                </View>

                {/* Message */}
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: '600',
                        textAlign: 'center',
                        marginBottom: 24,
                        color: theme.colors.onSurface,
                    }}
                >
                    {message}
                </Text>

                {/* Buttons */}
                <View style={{ width: '100%', gap: 12 }}>
                    {/* Confirm Button */}
                    <AppButton label={confirmText} onPress={onConfirm} />
                    <View style={{ width: '100%', alignItems: 'center', gap: 10 }}>
                        {/* Login Link */}
                        <TouchableOpacity
                            onPress={onLogin}
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 16,
                                borderRadius: 6,
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.primary,
                                    textDecorationLine: 'underline',
                                    fontWeight: '600',
                                    fontSize: 16,
                                }}
                            >
                                {loginText}
                            </Text>
                        </TouchableOpacity>

                        {/* Cancel Link */}
                        <TouchableOpacity
                            onPress={onCancel}
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 16,
                                borderRadius: 6,
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.secondary ?? '#6B7280', // fallback gray
                                    textDecorationLine: 'underline',
                                    fontWeight: '500',
                                    fontSize: 15,
                                }}
                            >
                                {cancelText}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        </Portal>
    );
}
