import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { ID, Client, Storage, Databases } from 'appwrite';
import * as ImageManipulator from 'expo-image-manipulator';
import { styles } from './styles/PhotoScreenStyles';
import { cloudyUpl } from './cloudinary';
import { sendCN } from './sendCN';

// Appwrite Configuration
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67a39d4d001c684cead2');

const storage = new Storage(client);
const databases = new Databases(client);

interface PhotoScreenProps {
  navigation: any; 
}

const PhotoScreen: React.FC<PhotoScreenProps> = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [selectedBucket] = useState<string>('67a48afb0025416339a1'); // bucket ID
  const [selectedDatabase] = useState<string>('67a48b26003ac5af5e62'); // database ID
  const [selectedCollection, setSelectedCollection] = useState<string>('67a48b3e002354d58d73'); // collection ID
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
        quality: 0.01,
        base64: true,
        exif: true,
      });
      console.log(">data", data)
      await sendCN(data?.base64)
      // Resize the image to avoid memory issues
      const resizedImage = await ImageManipulator.manipulateAsync(
        data.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.05, format: ImageManipulator.SaveFormat.JPEG }
      );

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
    setPhoto(photo);

    setSelectedCollection(collectionId);
    setIsModalVisible(false);

    setUploading(true);
    
    try {
      /*   console.log('Converting photo to blob...');
        const response = await fetch(photo);
        const blob = await response.blob();
        console.log('Blob created:', blob);
  
        // Use FormData to upload the file
        const formData = new FormData();
        formData.append('file', blob, `photo-${Date.now()}.jpg`);
  
        console.log('Uploading to Appwrite Storage...');
        const fileId = ID.unique();
        const databases = new Databases(client);
        const result = await databases.createDocument(
          '67a48b26003ac5af5e62', // databaseId
          '67ab9fba001a639fd162', // collectionId
          fileId, // documentId
          {neco:"pokus"}, // data
          
      );
      console.log(result); */
      /*   const uploadResponse = await fetch(
          `${client.config.endpoint}/storage/buckets/${selectedBucket}/files`,
          {
            method: 'POST',
            headers: {
              'X-Appwrite-Project': client.config.project,
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          }
        ); */

      /*  if (!uploadResponse.ok) {
         console.error('Upload failed:', await uploadResponse.text());
         throw new Error('Failed to upload file');
       } */
      /* 
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
      
            Alert.alert('Success', 'Image uploaded successfully!'); */

      // Reset the photo state and return to the camera view
      setPhoto(null);
      setUploading(false);
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
        <View style={StyleSheet.absoluteFillObject}>
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
                facing="back"
                ref={cameraRef}
                onCameraReady={() => setIsCameraReady(true)} 
              >
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={handleTakePicture}
                    disabled={!isCameraReady} 
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
              onPress={() => handleDocumentTypeSelection('67ab9e15000feb8037b1')} // collection ID for Documents Received
            >
              <Text style={styles.modalButtonText}>Documents Received</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleDocumentTypeSelection('67a48b3e002354d58d74')} //collection ID for Documents Issued
            >
              <Text style={styles.modalButtonText}>Documents Issued</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleDocumentTypeSelection('67ab9fba001a639fd162')} //collection ID for Receipts
            >
              <Text style={styles.modalButtonText}>Receipts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleDocumentTypeSelection('67a48b3e002354d58d76')} //collection ID for Other Documents
            >
              <Text style={styles.modalButtonText}>Other Documents</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PhotoScreen;