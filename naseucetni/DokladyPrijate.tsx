import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DokladyPrijate = () => {
  return (
    <View style={styles.container}>
      <Text>Doklady Přijaté</Text> 
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

export default DokladyPrijate;