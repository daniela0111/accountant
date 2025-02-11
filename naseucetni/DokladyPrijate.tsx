import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ID, Client, Databases } from 'appwrite';

// Appwrite Configuration
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('67a39d4d001c684cead2'); // Replace with your project ID

const databases = new Databases(client);

const DokladyPrijate = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await databases.listDocuments(
          '67a48b26003ac5af5e62', // Replace with your database ID
          '67a48b3e002354d58d73' // Replace with your collection ID for Documents Received
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
  documentContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  documentImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  documentText: {
    marginTop: 10,
    fontSize: 14,
    color: '#060663',
  },
});

export default DokladyPrijate;