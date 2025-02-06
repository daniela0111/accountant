import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { Client, Storage, ID } from 'appwrite';

// Appwrite configuration
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject('YOUR_PROJECT_ID'); // Your Appwrite project ID

const storage = new Storage(client);

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
  const [selectedCollection] = useState<string>('default');
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      try {
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
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

    try {
      const response = await fetch(photo);
      const blob = await response.blob();
      const fileId = ID.unique(); // Generate a unique file ID
      const file = new File([blob], `${fileId}.jpg`, { type: 'image/jpeg' });

      const uploadResponse = await storage.createFile(
        'YOUR_BUCKET_ID', // Replace with your Appwrite bucket ID
        fileId,
        file
      );

      if (uploadResponse) {
        Alert.alert('Upload successful!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload failed');
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
            <TouchableOpacity onPress={handleImageUpload}>
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : (
        <View style={styles.container}>
          {hasCameraPermission ? (
            <Camera
              style={styles.preview}
              type={CameraType.back}
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
            </Camera>
          ) : (
            <Text style={styles.buttonText}>Camera permission required</Text>
          )}
        </View>
      )}
    </View>
  );
};

export default PhotoScreen;

