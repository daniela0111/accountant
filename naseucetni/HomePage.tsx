import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { styles } from './styles/HomePageStyles'; 


type RootStackParamList = {
  IssuedDoc: undefined;
  ReceivedDoc: undefined;
  Receipts: undefined;
  OtherDoc: undefined;
  HomePage: undefined; 
};


type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomePage'>;

const HomePage = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />

      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => navigation.navigate('IssuedDoc')} 
          >
            <View style={{ alignItems: 'center' }}> 
              <Image source={require('./assets/dokladyvydane.png')} />
              <Text style={styles.buttonText}>Issued Document</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ReceivedDoc')}>
            <View style={{ alignItems: 'center' }}> 
              <Image source={require('./assets/dokladyprijate.png')} />
              <Text style={styles.buttonText}>Received Document</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity onPress={() => navigation.navigate('Receipts')}>
            <View style={{ alignItems: 'center' }}> 
              <Image source={require('./assets/uctenky.png')} />
              <Text style={styles.buttonText}>Receipts</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('OtherDoc')}>
            <View style={{ alignItems: 'center' }}> 
              <Image source={require('./assets/ostatnidoklady.png')} />
              <Text style={styles.buttonText}>Other Document</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomePage;