import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, FlatList } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const InquirySubmissionScreen = () => {
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryDetails, setInquiryDetails] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const navigation = useNavigation();

  const fetchInquiries = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const inquiriesSnapshot = await firestore().collection('inquiries').where('userId', '==', user.uid).get();
        const inquiriesList = inquiriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInquiries(inquiriesList);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleSubmitInquiry = async () => {
    if (inquirySubject.trim() === '' || inquiryDetails.trim() === '' || contactInfo.trim() === '') {
      Alert.alert('Submit Inquiry', 'Please fill in all fields.');
      return;
    }

    try {
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('inquiries').add({
          userId: user.uid,
          subject: inquirySubject,
          details: inquiryDetails,
          contactInfo,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
        setInquirySubject('');
        setInquiryDetails('');
        setContactInfo('');
        Alert.alert('Inquiry Submitted', 'Your inquiry has been submitted successfully.');
        fetchInquiries();  // Refresh inquiries after submitting a new one
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      Alert.alert('Error', 'There was an error submitting your inquiry.');
    }
  };

  const renderInquiryItem = ({ item }) => (
    <View style={styles.inquiryContainer}>
      <Text style={styles.inquiryText}>Subject: {item.subject}</Text>
      <Text style={styles.inquiryText}>Details: {item.details}</Text>
      <Text style={styles.inquiryText}>Contact Info: {item.contactInfo}</Text>
      {item.reply && (
        <Text style={styles.inquiryText}>Reply: {item.reply}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submit Inquiry</Text>
      <TextInput
        style={styles.input}
        value={inquirySubject}
        onChangeText={setInquirySubject}
        placeholder="Subject"
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        value={inquiryDetails}
        onChangeText={setInquiryDetails}
        placeholder="Details"
        multiline
      />
      <TextInput
        style={styles.input}
        value={contactInfo}
        onChangeText={setContactInfo}
        placeholder="Contact Information"
      />
      <Button title="Submit Inquiry" onPress={handleSubmitInquiry} />

      <Text style={styles.title}>Your Inquiries</Text>
      <FlatList
        data={inquiries}
        renderItem={renderInquiryItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  inquiryContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inquiryText: {
    fontSize: 16,
  },
  list: {
    marginTop: 20,
  },
});

export default InquirySubmissionScreen;
