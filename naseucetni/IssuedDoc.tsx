import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, Image } from 'react-native';
import { ID, Client, Databases } from 'appwrite';
import { styles } from './styles/ReceiptsStyles'; 

// Appwrite Configuration
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') //Appwrite endpoint
  .setProject('67a39d4d001c684cead2'); //project ID

const databases = new Databases(client);

const IssuedDoc = () => {
  const [receipts, setIssued] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch receipts from the Receipts collection
  const fetchIssued = async () => {
    try {
      const response = await databases.listDocuments(
        '67a48b26003ac5af5e62', 
        '67b8d456000827d847f1' 
      );
      setIssued(response.documents);
    } catch (error) {
      console.error('Error fetching receipts:', error);
      Alert.alert('Error', 'Failed to fetch receipts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssued();
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
      {}
      <Image
        source={require('./assets/logo.png')} 
        style={styles.logo}
      />
      <Text style={styles.title}>Uploaded Issued documents</Text>
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

export default IssuedDoc;