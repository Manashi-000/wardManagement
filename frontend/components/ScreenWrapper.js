import React from 'react';
import { View, StyleSheet } from 'react-native';

const ScreenWrapper = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
