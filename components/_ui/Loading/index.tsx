import React from 'react';
import { ActivityIndicator, ColorValue, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  size?: number;
  color?: ColorValue;
  style?: ViewStyle;
};

export function Loading({ size = 24, color = '#ffffff', style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      <Text style={{ fontSize: 16 }}>Carregando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30%',
  },
});
