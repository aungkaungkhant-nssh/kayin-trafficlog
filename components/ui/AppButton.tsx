import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';

interface AppButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  label: string;
  icon?: string | ((props: IconProps) => React.ReactNode); // Supports string name or custom component
  disabled?: boolean;
  loading?: boolean;
  mode?: "contained" | "outlined";
  fullWidth?: boolean;
}

const PRIMARY_COLOR = '#000080';

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

  const backgroundColor = isOutlined ? 'transparent' : PRIMARY_COLOR;
  const borderColor = isOutlined ? 'gray' : PRIMARY_COLOR;
  const textColor = isOutlined ? 'gray' : '#fff';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor, borderColor },
        fullWidth ? { width: '100%' } : { flexBasis: '48%', flexGrow: 1 },
        disabled && { opacity: 0.5 },
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon && typeof icon === 'string' && (
            <Entypo name={icon} size={18} color={textColor} style={{ marginRight: 8 }} />
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
      )}
    </TouchableOpacity>
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
    gap:6
  },
})

export default AppButton;
