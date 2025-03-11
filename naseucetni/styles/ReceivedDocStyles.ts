import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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