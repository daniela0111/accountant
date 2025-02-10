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
  Dimensions,
  Modal,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
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

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    position: 'absolute',
    top: 40,
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 300,
    height: 50,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 20,
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  instructionText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayCutout: {
    width: width * 0.8, // Adjusted width to 80% of the screen
    height: height * 0.4, // Adjusted height to 40% of the screen for a rectangular shape
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  overlayBackground: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 20,
    bottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 10,
    left: 10,
    right: 20,
    bottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalButton: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
});

const PhotoScreen: React.FC<PhotoScreenProps> = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedBucket] = useState<string>('67a48afb0025416339a1'); // Replace with your bucket ID
  const [selectedDatabase] = useState<string>('67a48b26003ac5af5e62'); // Replace with your database ID
  const [selectedCollection, setSelectedCollection] = useState<string>('67a48b3e002354d58d73'); // Replace with your collection ID
  const [isModalVisible, setIsModalVisible] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Use the useCameraPermissions hook to handle camera permissions
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      try {
        // Request camera permissions
        if (!cameraPermission?.granted) {
          await requestCameraPermission();
        }

        // Request media library permissions
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
        setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
      } catch (error) {
        console.error('Permission error:', error);
      }
    })();
  }, [cameraPermission]);

  const handleTakePicture = async () => {
    if (cameraPermission?.granted && cameraRef.current) {
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

    setIsModalVisible(true);
  };

  const handleDocumentTypeSelection = async (collectionId: string) => {
    if (!photo) {
      Alert.alert('Error', 'No photo to upload');
      return;
    }
  
    setSelectedCollection(collectionId);
    setIsModalVisible(false);
  
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
        collectionId,
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
      {/* Logo at the top */}
      <View style={styles.logoContainer}>
        <Image
          source={require('./assets/logo.png')} // Replace with the path to your logo image
          style={styles.logo}
        />
        <Text style={styles.instructionText}>Accounting documents</Text>
        <Text style={styles.instructionText}>Please take a picture of the whole document</Text>
        <Text style={styles.instructionText}>Check if the document is in focus</Text>
      </View>

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
            <TouchableOpacity onPress={handleSave}>
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
          {cameraPermission?.granted ? (
            <CameraView
              style={styles.preview}
              facing="back" // Use 'facing' for CameraView
              ref={cameraRef}
            >
              {/* Grey rectangle overlay */}
              <View style={styles.overlay}>
                <View style={styles.overlayBackground} />
                <View style={styles.overlayCutout} />
              </View>
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

      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleDocumentTypeSelection('67a48b3e002354d58d73')} // Replace with your collection ID for Documents Received
            >
              <Text>Documents Received</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleDocumentTypeSelection('67a48b3e002354d58d74')} // Replace with your collection ID for Documents Issued
            >
              <Text>Documents Issued</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleDocumentTypeSelection('67a48b3e002354d58d75')} // Replace with your collection ID for Receipts
            >
              <Text>Receipts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleDocumentTypeSelection('67a48b3e002354d58d76')} // Replace with your collection ID for Other Documents
            >
              <Text>Other Documents</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PhotoScreen;