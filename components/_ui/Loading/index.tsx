import React from 'react';
import { ActivityIndicator, ColorValue, StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  size?: number;
  color?: ColorValue;
  style?: ViewStyle;
};

export function Loading({ size = 24, color = '#ffffff', style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
