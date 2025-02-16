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
import * as MediaLibrary from 'expo-media-library';
import { ID, Client, Storage, Databases } from 'appwrite';

// Appwrite Configuration
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('67a39d4d001c684cead2'); // Replace with your project ID

const storage = new Storage(client);
const databases = new Databases(client);

interface PhotoScreenProps {
  navigation: any; // Navigation prop for navigating to other screens
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
    width: '100%',
    zIndex: 1,
  },
  logo: {
    width: 350,
    height: 100,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 10,
    width: '100%',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cameraContainer: {
    height: height * 0.5,
    width: width * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100, // Moved lower to avoid overlapping with text
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f00',
    marginBottom: -150, // Adjusted to position the button vertically
    marginLeft: -50, // Adjusted to move the button more to the left
  },
  buttonText: {
    color: '#060663',
    fontSize: 16,
    padding: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#060663',
    textAlign: 'center',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5, 
  },
  modalButton: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#060663',
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

const PhotoScreen: React.FC<PhotoScreenProps> = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false); // Add camera ready state
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
    if (!cameraPermission?.granted) {
      Alert.alert('Error', 'Camera permission is required');
      return;
    }

    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera is not ready');
      return;
    }

    try {
      const data = await cameraRef.current.takePictureAsync({
        quality: 0.05, // Further reduce quality to minimize file size
        base64: true,
        exif: true,
      });
      setPhoto(data.uri);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error capturing photo');
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
      console.log('Converting photo to blob...');
      const response = await fetch(photo);
      const blob = await response.blob();
      console.log('Blob created:', blob);

      // Use FormData to upload the file
      const formData = new FormData();
      formData.append('file', blob, `photo-${Date.now()}.jpg`);

      console.log('Uploading to Appwrite Storage...');
      const fileId = ID.unique();
      const uploadResponse = await fetch(
        `${client.config.endpoint}/storage/buckets/${selectedBucket}/files`,
        {
          method: 'POST',
          headers: {
            'X-Appwrite-Project': client.config.project,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const storageResponse = await uploadResponse.json();
      console.log('File uploaded:', storageResponse);

      console.log('Constructing public URL...');
      const fileUrl = `${client.config.endpoint}/storage/buckets/${selectedBucket}/files/${storageResponse.$id}/view?project=${client.config.project}&mode=admin`;
      console.log('Public URL:', fileUrl);

      console.log('Saving to Appwrite Database...');
      await databases.createDocument(
        selectedDatabase,
        collectionId,
        ID.unique(),
        {
          imageUrl: fileUrl,
          timestamp: new Date().toISOString(),
        }
      );
      console.log('Document saved to database.');

      Alert.alert('Success', 'Image uploaded successfully!');
      setPhoto(null); // Reset photo state
      setUploading(false); // Stop uploading indicator
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo at the top */}
      <View style={styles.logoContainer}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.instructionText}>Please take a picture of the whole document</Text>
        <Text style={styles.instructionText}>Check if the document is in focus</Text>
      </View>

      {uploading && (
        <View style={StyleSheet.absoluteFill}>
          <ActivityIndicator size="large" color="#060663" />
          <Text style={{ color: '#060663' }}>Uploading...</Text>
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
            <TouchableOpacity onPress={handleImageUpload} disabled={uploading}>
              <Text style={[styles.buttonText, uploading && { opacity: 0.5 }]}>
                Upload
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Uctenky')}>
              <Text style={styles.buttonText}>View Receipts</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : (
        <View style={styles.container}>
          {cameraPermission?.granted ? (
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.preview}
                facing="back" // Use 'facing' for CameraView
                ref={cameraRef}
                onCameraReady={() => setIsCameraReady(true)} // Set camera ready state
              >
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={handleTakePicture}
                    disabled={!isCameraReady} // Disable button until camera is ready
                  />
                </View>
              </CameraView>
            </View>
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
              onPress={() => handleDocumentTypeSelection('67ab9e15000feb8037b1')} // Replace with your collection ID for Documents Received
            >
              <Text style={{ color: '#060663' }}>Documents Received</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleDocumentTypeSelection('67a48b3e002354d58d74')} // Replace with your collection ID for Documents Issued
            >
              <Text style={{ color: '#060663' }}>Documents Issued</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleDocumentTypeSelection('67ab9fba001a639fd162')} // Replace with your collection ID for Receipts
            >
              <Text style={{ color: '#060663' }}>Receipts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleDocumentTypeSelection('67a48b3e002354d58d76')} // Replace with your collection ID for Other Documents
            >
              <Text style={{ color: '#060663' }}>Other Documents</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PhotoScreen;