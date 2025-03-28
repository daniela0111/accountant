import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';

// Screen imports
import HomePage from './HomePage';
import SettingsScreen from './SettingScreen';
import PhotoScreen from './PhotoScreen';
import DokladyVydane from './DokladyVydane';
import DokladyPrijate from './DokladyPrijate';
import Uctenky from './Uctenky';
import OstatniDoklady from './OstatniDoklady';
import LoginPage from './LogIn';


type TabParamList = {
  Doklady: undefined;
  Scanner: undefined;
  Support: undefined;
};


type RootStackParamList = {
  MainApp: undefined;
  Login: undefined;
};

const Tab = createBottomTabNavigator(); 
const Stack = createStackNavigator(); 

// Main App Stack (Tabs)
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

const MainApp = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<TabParamList, keyof TabParamList> }) => ({
        tabBarStyle: {
          backgroundColor: '#060663', 
          height: 80,
        },
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          // Icon name based on the route
          switch (route.name) {
            case 'Doklady':
              iconName = 'home'; // Home icon
              break;
            case 'Scanner':
              iconName = 'plus'; // Add icon
              break;
            case 'Nápověda':
              iconName = 'help-circle'; // Help circle icon
              break;
            default:
              iconName = 'alert-circle'; 
          }

          return (
            <MaterialCommunityIcons
              name={iconName}
              color={color} 
              size={size}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Doklady"
        component={DokladyStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Home', 
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={PhotoScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Scanner', 
        }}
      />
      <Tab.Screen
        name="Nápověda"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Help', 
        }}
      />
    </Tab.Navigator>
  );
};

// Root App Component
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator>
          {/* Check if the user is logged in */}
          {isLoggedIn ? (
            // If logged in, show the main app
            <Stack.Screen
              name="MainApp"
              component={MainApp}
              options={{ headerShown: false }}
            />
          ) : (
            // If not logged in, show the login screen
            <Stack.Screen
              name="Login"
              options={{ headerShown: false }}
            >
              {(props: StackScreenProps<RootStackParamList, 'Login'>) => (
                <LoginPage
                  {...props}
                  setIsLoggedIn={setIsLoggedIn} // Pass the setIsLoggedIn function to LoginPage
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
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