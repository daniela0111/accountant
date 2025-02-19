import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#C00006',
    textAlign: 'center',
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 30,
    marginTop: 100,
  },
  faqContainer: {
    borderBottomWidth: 1,
    borderColor: '#060663',
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 16,
    color: '#060663',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#060663',
  },
  faqIconContainer: {
    marginLeft: 5,
  },
  faqIcon: {
    fontSize: 18,
    color: '#060663',
  },
  supportContact: {
    marginTop: 60,
    borderWidth: 1,
    borderColor: '#060663',
    padding: 12,
    borderRadius: 10,
    marginBottom: 40,
  },
  supportContactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#060663',
  },
  supportContactPhone: {
    color: '#060663',
  },
});