import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  Animated,
  FlatList,
} from 'react-native';
import { styles } from './styles/SettingScreenStyles'; 

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

const SettingsScreen: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean[]>(Array(faqs.length).fill(false));

  const toggleExpand = useCallback((index: number) => {
    const newExpanded = [...isExpanded];
    newExpanded[index] = !newExpanded[index];
    setIsExpanded(newExpanded);
  }, [isExpanded]);

  const renderFAQ = ({ item, index }: { item: FAQ; index: number }) => {
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
      <Image source={require('./assets/logo.png')} style={styles.logo} />
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

export default SettingsScreen;