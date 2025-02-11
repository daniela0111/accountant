import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { ID, Client, Databases } from 'appwrite';

// Appwrite Configuration
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('67a39d4d001c684cead2'); // Replace with your project ID

const databases = new Databases(client);

const Uctenky = () => {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch receipts from the Receipts collection
  const fetchReceipts = async () => {
    try {
      const response = await databases.listDocuments(
        '67a48b26003ac5af5e62', // Replace with your database ID
        '67ab9fba001a639fd162' // Replace with your collection ID for Receipts
      );
      setReceipts(response.documents);
    } catch (error) {
      console.error('Error fetching receipts:', error);
      Alert.alert('Error', 'Failed to fetch receipts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#060663" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uploaded Receipts</Text>
      <FlatList
        data={receipts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.receiptContainer}>
            <Text style={styles.receiptText}>ID: {item.$id}</Text>
            <Text style={styles.receiptText}>Uploaded on: {new Date(item.timestamp).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#060663',
    marginBottom: 20,
    textAlign: 'center',
  },
  receiptContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  receiptText: {
    fontSize: 16,
    color: '#060663',
  },
});

export default Uctenky;