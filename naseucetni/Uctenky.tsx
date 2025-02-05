import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Uctenky = () => {
  return (
    <View style={styles.container}>
      <Text>Účtenky</Text> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Uctenky;