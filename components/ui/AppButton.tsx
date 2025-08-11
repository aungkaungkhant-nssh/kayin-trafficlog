import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';

interface AppButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  label: string;
  icon?: string | ((props: IconProps) => React.ReactNode);
  disabled?: boolean;
  loading?: boolean;
  mode?: "contained" | "outlined";
  fullWidth?: boolean;
}

const PRIMARY_COLOR = '#000080';
const PRESSED_COLOR = '#0000cc';

const AppButton: React.FC<AppButtonProps> = ({
  onPress,
  label,
  icon,
  disabled = false,
  loading = false,
  mode = "contained",
  fullWidth = false,
}) => {
  const isOutlined = mode === "outlined";

  const borderColor = PRIMARY_COLOR;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isOutlined
            ? (pressed ? PRIMARY_COLOR : 'transparent')
            : (pressed ? PRESSED_COLOR : PRIMARY_COLOR),
          borderColor,
          opacity: disabled ? 0.5 : 1,
        },
        fullWidth && { width: '100%' },
      ]}
    >
      {({ pressed }) => {
        const textColor = pressed ? '#fff' : (isOutlined ? PRIMARY_COLOR : '#fff');

        return loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <View style={styles.content}>
            {icon && typeof icon === 'string' && (
              <Entypo name={icon as any} size={18} color={textColor} style={{ marginRight: 8 }} />
            )}
            {icon && typeof icon === 'function' && icon({
              size: 18, color: textColor,
              name: undefined,
              direction: 'ltr',
            })}
            <Text style={[styles.label, { color: textColor }]}>
              {label}
            </Text>
          </View>
        );
      }}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
});

export default AppButton;
