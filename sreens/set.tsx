import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  StyleSheet,
  Animated,
  FlatList,
} from 'react-native';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'How to upload a document?',
    answer: 'To upload a document, click the "+" button, select the document from your device, and follow the on-screen instructions.',
  },
  {
    question: 'How to classify a document correctly?',
    answer: 'Classify documents by type (e.g., invoice, receipt, bank statement) for easier organization and search.',
  },
  {
    question: 'How can I find uploaded documents?',
    answer: 'Use the search bar or filter options to quickly locate specific documents.',
  },
];

const SettingsScreen: React.FC = () => { // Removed SettingsScreenProps as it's not used

  const [isExpanded, setIsExpanded] = useState<boolean[]>(Array(faqs.length).fill(false));

  const toggleExpand = useCallback((index: number) => {
    const newExpanded = [...isExpanded];
    newExpanded[index] = !newExpanded[index];
    setIsExpanded(newExpanded);
  }, [isExpanded]);

  const renderFAQ = ({ item, index }: { item: FAQ; index: number }) => { // Added type annotations for item and index
    return (
      <View style={styles.faqContainer}>
        <TouchableOpacity
          onPress={() => toggleExpand(index)}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}
        >
          <Text style={styles.faqQuestion}>{item.question}</Text>
          <Animated.View style={[styles.faqIconContainer, rotateIcon(isExpanded[index])]}>
            <Text style={styles.faqIcon}>&#8595;</Text>
          </Animated.View>
        </TouchableOpacity>
        {isExpanded[index] && (
          <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  const rotateIcon = (isOpen: boolean) => {
    return isOpen ? { transform: [{ rotate: '180deg' }] } : {};
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} /> {/* Assumes 'your_logo.png' is in the same directory */}
      <Text style={styles.supportTitle}>Support</Text>
      <FlatList
        data={faqs}
        renderItem={renderFAQ}
        keyExtractor={(item) => item.question}
      />
      <View style={styles.supportContact}>
        <Text style={styles.supportContactTitle}>Accounting Support:</Text>
        <Text>Name: Danielle Fedorková</Text>
        <Text>Email: daniela@naseucetni.eu</Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:777117667')}>
          <Text style={styles.supportContactPhone}>Phone number: 777 117 667</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default SettingsScreen;