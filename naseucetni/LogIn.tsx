import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert 
} from 'react-native';
import { Client, Account } from 'appwrite';
import { styles } from './styles/LoginPageStyles'; 

interface LoginPageProps {
  setIsLoggedIn: (value: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Initialize Appwrite client
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('67a39d4d001c684cead2'); // Replace with your project ID

  const account = new Account(client);

  const handleLogin = async () => {
    setError('');

    // Basic validation for email and password
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      let sessions;

      // Try to check if a session already exists
      try {
        sessions = await account.getSession('current');
      } catch (sessionErr: any) {
        if (sessionErr.message.includes('missing scope')) {
          // If the session check fails due to missing scope, assume no session exists
          sessions = null;
        } else {
          throw sessionErr; // Re-throw other errors
        }
      }

      if (sessions) {
        // If a session exists, log the user in automatically
        console.log('User is already logged in.');
        setIsLoggedIn(true); // Update login state
        return;
      }

      // Attempt to create a new session
      const response = await account.createEmailPasswordSession(email, password);
      console.log('Login successful:', response);

      // Update login state and navigate to the main app
      setIsLoggedIn(true);
    } catch (err: any) {
      // Handle errors
      if (err.message.includes('Creation of a session is prohibited')) {
        setError('You are already logged in.');
      } else if (err.message.includes('User (role: guests) missing scope')) {
        setError('Authentication failed. Please ensure you have the correct permissions.');
      } else {
        setError('Invalid credentials. Please try again.');
      }
      console.error('Login failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('./assets/logo.png')} // Ensure the path to your logo is correct
        style={styles.logo}
      />
      <Text style={styles.title}>Accounting Documents</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#060663"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#060663"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {/* Custom Log In Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;