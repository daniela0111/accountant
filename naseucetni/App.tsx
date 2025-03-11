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
import IssuedDoc from './IssuedDoc';
import ReceivedDoc from './ReceivedDoc';
import Receipts from './Receipts';
import OtherDoc from './OtherDoc';
import LoginPage from './LogIn';


type TabParamList = {
  Documents: undefined;
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
const DocumentsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Doklady" component={HomePage} options={{ headerShown: false }} />
      <Stack.Screen name="IssuedDoc" component={IssuedDoc} />
      <Stack.Screen name="ReceivedDoc" component={ReceivedDoc} />
      <Stack.Screen name="Receipts" component={Receipts} />
      <Stack.Screen name="OtherDoc" component={OtherDoc} />
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
            case 'Documents':
              iconName = 'home'; // Home icon
              break;
            case 'Scanner':
              iconName = 'plus'; // Add icon
              break;
            case 'Support':
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
        name="Documents"
        component={DocumentsStack}
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
        name="Support"
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