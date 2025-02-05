import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

//screen import
import HomePage from './HomePage'; 
import SettingsScreen from './SettingScreen';
import PhotoScreen from './PhotoScreen';
import DokladyVydane from './DokladyVydane'; 
import DokladyPrijate from './DokladyPrijate';
import Uctenky from './Uctenky';
import OstatniDoklady from './OstatniDoklady';

// Define the parameter list for the bottom tab navigator
type TabParamList = {
  Doklady: undefined;
  Scanner: undefined;
  Nápověda: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DokladyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Doklady" component={HomePage} options={{ headerShown: false }} />
      <Stack.Screen name="DokladyVydane" component={DokladyVydane} />
      <Stack.Screen name="DokladyPrijate" component={DokladyPrijate} />
      <Stack.Screen name="Uctenky" component={Uctenky} />
      <Stack.Screen name="OstatniDoklady" component={OstatniDoklady} />
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }: { route: RouteProp<any, any> }) => ({
            tabBarStyle: {
              backgroundColor: '#060663', // Tab bar background color
              height: 80, 
            },
            tabBarIcon: ({ color }: { color: string }) => { // Explicitly type 'color' as string
              let iconName: string;

              //icon name based on the route
              switch (route.name) {
                case 'Doklady':
                  iconName = 'home';
                  break;
                case 'Scanner':
                  iconName = 'plus'; 
                  break;
                case 'Nápověda':
                  iconName = 'help';
                  break;
                default:
                  iconName = 'alert-circle';
              }

              return (
                <MaterialCommunityIcons
                  name={iconName as keyof typeof MaterialCommunityIcons.glyphMap}
                  color={color} // Button icon color
                  size={30} 
                />
              );
            },
          })}
        >
          <Tab.Screen name="Doklady" component={DokladyStack} options={{ headerShown: false }} /> 
          <Tab.Screen name="Scanner" component={PhotoScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Nápověda" component={SettingsScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
