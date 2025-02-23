import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, Image } from 'react-native';
import { ID, Client, Databases } from 'appwrite';
import { styles } from './styles/UctenkyStyles'; 

// Appwrite Configuration
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') //Appwrite endpoint
  .setProject('67a39d4d001c684cead2'); //project ID

const databases = new Databases(client);

const Uctenky = () => {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch receipts from the Receipts collection
  const fetchReceipts = async () => {
    try {
      const response = await databases.listDocuments(
        '67a48b26003ac5af5e62', //database ID
        '67ab9fba001a639fd162' //collection ID for Receipts
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
      {/* Logo at the top */}
      <Image
        source={require('./assets/logo.png')} 
        style={styles.logo}
      />
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

export default Uctenky;