import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import { ID, Client, Databases } from 'appwrite';
import { styles } from './styles/DokladyPrijateStyles'; 

// Appwrite Configuration
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite endpoint
  .setProject('67a39d4d001c684cead2'); // project ID

const databases = new Databases(client);

const DokladyPrijate = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await databases.listDocuments(
          '67a48b26003ac5af5e62', // database ID
          '67ab9e15000feb8037b1' // collection ID 
        );
        setDocuments(response.documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
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
      <FlatList
        data={documents}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.documentContainer}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.documentImage}
            />
            <Text style={styles.documentText}>
              Uploaded on: {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default DokladyPrijate;