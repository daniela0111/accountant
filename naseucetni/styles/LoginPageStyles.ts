import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Position elements closer to the top
    backgroundColor: '#f5f5f5', // Light background color
    padding: 24,
  },
  logo: {
    width: 350, // Adjust the width of the logo
    height: 190, // Adjust the height of the logo
    alignSelf: 'center', // Center the logo horizontally
    marginBottom: 16, // Add spacing below the logo
    resizeMode: 'contain', // Ensure the logo scales properly
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#060663',
  },
  input: {
    height: 50,
    borderColor: '#060663',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff', // White input background
  },
  error: {
    color: '#C00006', 
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#060663', // Dark blue background
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
});