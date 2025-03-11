import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OtherDoc = () => {
  return (
    <View style={styles.container}>
      <Text>Ostatní Doklady</Text> 
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

export default OtherDoc;