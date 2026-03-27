import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LockOverlay() {
  return (
    <View testID="lock-overlay" style={styles.overlay}>
      <Text style={styles.icon}>🔒</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 28,
  },
});
