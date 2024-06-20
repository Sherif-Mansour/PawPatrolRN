import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const InquirySubmissionScreen = () => {
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryDetails, setInquiryDetails] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const navigation = useNavigation();

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
        navigation.navigate('PrivacySettings');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      Alert.alert('Error', 'There was an error submitting your inquiry.');
    }
  };

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
});

export default InquirySubmissionScreen;
