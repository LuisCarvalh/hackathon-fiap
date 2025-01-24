import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer() {

  return (
    <View style={styles.footer}>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 34,
    backgroundColor: '#391A5F',
  },
});