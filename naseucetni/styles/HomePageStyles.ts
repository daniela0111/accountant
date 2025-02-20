import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
    marginTop: 20,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'column', 
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '80%', 
  },
  buttonText: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    textAlign: 'center',
  },
});