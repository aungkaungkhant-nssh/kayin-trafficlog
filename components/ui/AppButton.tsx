import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'

interface AppButtonProps {
  onPress: () => void
  label: string
  icon?: string
  disabled?: boolean;
  loading?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  onPress,
  label,
  icon,
  disabled = false,
  loading = false
}) => {
  return (
    <Button
      icon={icon}
      mode="contained"
      onPress={onPress}
      disabled={disabled}
      style={styles.button}
      labelStyle={styles.label}
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
