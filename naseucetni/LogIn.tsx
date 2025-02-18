import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Client, Account } from 'appwrite';

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
      // Handle errors such as invalid credentials
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
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default LoginPage;