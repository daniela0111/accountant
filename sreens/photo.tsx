import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView } from 'expo-camera'; // Ensure correct import
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { ID, Client, Storage, Databases } from 'appwrite';

// Appwrite Configuration
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('67a39d4d001c684cead2'); // Replace with your project ID

const storage = new Storage(client);
const databases = new Databases(client);

interface PhotoScreenProps {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 20,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f00',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    padding: 10,
  },
});

const PhotoScreen: React.FC<PhotoScreenProps> = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedBucket] = useState<string>('67a48afb0025416339a1'); // Replace with your bucket ID
  const [selectedDatabase] = useState<string>('67a48b26003ac5af5e62'); // Replace with your database ID
  const [selectedCollection] = useState<string>('67a48b3e002354d58d73'); // Replace with your collection ID
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      try {
        const cameraPermission = await CameraView.requestCameraPermissionsAsync();
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
        setHasCameraPermission(cameraPermission.status === 'granted');
        setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
      } catch (error) {
        console.error('Permission error:', error);
      }
    })();
  }, []);

  const handleTakePicture = async () => {
    if (hasCameraPermission && cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          exif: true,
        });
        setPhoto(data.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error capturing photo');
      }
    }
  };

  const handleChooseFromLibrary = async () => {
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error accessing gallery');
    }
  };

  const handleImageUpload = async () => {
    if (!photo) return;

    setUploading(true);
    try {
      // Convert photo to blob
      const response = await fetch(photo);
      const blob = await response.blob();

      // Create File object for Appwrite
      const file = new File([blob], `photo-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });

      // Upload to Appwrite Storage
      const storageResponse = await storage.createFile(
        selectedBucket,
        ID.unique(),
        file
      );

      // Construct public URL
      const fileUrl = `${client.config.endpoint}/storage/buckets/${selectedBucket}/files/${storageResponse.$id}/view?project=${client.config.project}&mode=admin`;

      // Save to Appwrite Database
      await databases.createDocument(
        selectedDatabase,
        selectedCollection,
        ID.unique(),
        {
          imageUrl: fileUrl,
          timestamp: new Date().toISOString(),
        }
      );

      Alert.alert('Success', 'Image uploaded successfully!');
      setPhoto(null);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleShare = async () => {
    if (photo) {
      try {
        await shareAsync(photo);
      } catch (error) {
        console.error('Sharing error:', error);
        Alert.alert('Sharing failed');
      }
    }
  };

  const handleSave = async () => {
    if (photo && hasMediaLibraryPermission) {
      try {
        await MediaLibrary.saveToLibraryAsync(photo);
        Alert.alert('Photo saved to library!');
      } catch (error) {
        console.error('Save error:', error);
        Alert.alert('Error saving photo');
      }
    }
  };

  return (
    <View style={styles.container}>
      {uploading && (
        <View style={StyleSheet.absoluteFill}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Uploading...</Text>
        </View>
      )}

      {photo ? (
        <SafeAreaView style={styles.container}>
          <Image
            style={styles.preview}
            source={{ uri: photo }}
            resizeMode="contain"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setPhoto(null)}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare}>
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleImageUpload} disabled={uploading}>
              <Text style={[styles.buttonText, uploading && { opacity: 0.5 }]}>
                Upload
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : (
        <View style={styles.container}>
          {hasCameraPermission ? (
            <CameraView
              style={styles.preview}
              facing="back" // Use 'facing' instead of 'type'
              ref={cameraRef}
            >
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={handleTakePicture}
                />
                <TouchableOpacity onPress={handleChooseFromLibrary}>
                  <Text style={styles.buttonText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          ) : (
            <Text style={styles.buttonText}>Camera permission required</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default PhotoScreen;

