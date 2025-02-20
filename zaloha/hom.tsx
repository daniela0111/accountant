import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the type for the navigation stack
type RootStackParamList = {
  DokladyVydane: undefined;
  DokladyPrijate: undefined;
  Uctenky: undefined;
  OstatniDoklady: undefined;
  HomePage: undefined; 
};

// Define the navigation prop type for the HomePage
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomePage'>;

const HomePage = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />

      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => navigation.navigate('DokladyVydane')} 
          >
            <View style={{ alignItems: 'center' }}> 
              <Image source={require('./assets/dokladyvydane.png')} />
              <Text style={styles.buttonText}>Doklady vydané</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('DokladyPrijate')}>
            <View style={{ alignItems: 'center' }}> 
              <Image source={require('./assets/dokladyprijate.png')} />
              <Text style={styles.buttonText}>Doklady přijaté</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.navigate('Uctenky')}>
            <View style={{ alignItems: 'center' }}> 
              <Image source={require('./assets/uctenky.png')} />
              <Text style={styles.buttonText}>Účtenky</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('OstatniDoklady')}>
            <View style={{ alignItems: 'center' }}> 
              <Image source={require('./assets/ostatnidoklady.png')} />
              <Text style={styles.buttonText}>Ostatní Doklady</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
    marginTop: 20,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'column', 
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '80%', 
  },
  buttonText: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default HomePage;