import { PropsWithChildren, useState } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Divider, useTheme } from 'react-native-paper';

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const rotation = new Animated.Value(isOpen ? 1 : 0);

  const toggle = () => {
    setIsOpen((prev) => {
      Animated.timing(rotation, {
        toValue: prev ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();
      return !prev;
    });
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['90deg', '270deg'],
  });

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.heading}
        onPress={toggle}
        activeOpacity={0.7}
      >
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <IconSymbol
            name="chevron.right"
            size={24}
            weight="medium"
            color={theme.colors.primary}
          />
        </Animated.View>
      </TouchableOpacity>
      {isOpen && (
        <>
          <Divider />
          <ThemedView style={styles.content}>
            {children}
          </ThemedView>
        </>

      )}
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    elevation: 3,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Myanmar-Bold',
    color: "#000"
  },
  content: {
    marginTop: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5"
  },
});