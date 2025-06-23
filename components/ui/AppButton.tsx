import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'

interface AppButtonProps {
  onPress: () => void
  label: string
  icon?: string
  disabled?: boolean;
  loading?: boolean;
  mode?: "contained" | "text" | "outlined" | "elevated" | "contained-tonal"
}

const AppButton: React.FC<AppButtonProps> = ({
  onPress,
  label,
  icon,
  disabled = false,
  loading = false,
  mode = "contained"
}) => {
  const isOutlined = mode === "outlined";
  return (
    <Button
      icon={icon}
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        isOutlined && { borderColor: 'gray', borderWidth: 1 }, // Optional: for border color
      ]}
      labelStyle={[
        styles.label,
        isOutlined && { color: 'gray' },
      ]}
      contentStyle={styles.content}
      loading={loading}
    >
      {label}
    </Button>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    color: '#fff',
  },
  content: {
    height: 50,
  },
})

export default AppButton
