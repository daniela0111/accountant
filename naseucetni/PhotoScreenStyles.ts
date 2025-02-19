import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
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