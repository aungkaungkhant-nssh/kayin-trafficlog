import React, { useState } from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

interface AppTextInputProps extends TextInputProps {
    isPassword?: boolean;
    rightIconName?: string;
    onRightIconPress?: () => void;
    leftIconName?: string;
    onLeftIconPress?: () => void;
    style?: StyleProp<TextStyle>;
}

function AppTextInput({
    isPassword = false,
    rightIconName,
    onRightIconPress,
    leftIconName,
    onLeftIconPress,
    style,
    ...rest
}: AppTextInputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const renderRightIcon = () => {
        if (isPassword) {
            return (
                <TextInput.Icon
                    icon={isPasswordVisible ? 'eye-off' : 'eye'}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                />
            );
        }
        if (rightIconName) {
            return <TextInput.Icon icon={rightIconName} onPress={onRightIconPress} />;
        }
        return undefined;
    };

    const renderLeftIcon = () => {
        if (leftIconName) {
            return <TextInput.Icon icon={leftIconName} onPress={onLeftIconPress} />;
        }
        return undefined;
    };

    return (
        <TextInput
            mode="flat"
            secureTextEntry={isPassword && !isPasswordVisible}
            style={[styles.input, style]}
            left={renderLeftIcon()}
            right={renderRightIcon()}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#f2f2f2',
    },
});

export default AppTextInput;
