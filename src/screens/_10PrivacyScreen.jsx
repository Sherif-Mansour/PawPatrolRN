import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Button, Alert, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const PrivacySettingsScreen = () => {
  const [isPublicProfile, setIsPublicProfile] = useState(false);
  const [shareDataWithThirdParties, setShareDataWithThirdParties] = useState(false);
  const [isDataTrackingEnabled, setIsDataTrackingEnabled] = useState(false);
  const [isLiveLocationEnabled, setIsLiveLocationEnabled] = useState(false);
  const [inquiry, setInquiry] = useState('');

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth().currentUser;
              if (user) {
                await firestore().collection('users').doc(user.uid).delete();
                await user.delete();
                Alert.alert('Account deleted', 'Your account has been deleted successfully.');
              }
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'There was an error deleting your account.');
            }
          },
        },
      ]
    );
  };

  const handleSubmitInquiry = async () => {
    if (inquiry.trim() === '') {
      Alert.alert('Submit Inquiry', 'Please enter your inquiry.');
      return;
    }

    try {
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('inquiries').add({
          userId: user.uid,
          inquiry,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
        setInquiry('');
        Alert.alert('Inquiry Submitted', 'Your inquiry has been submitted successfully.');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      Alert.alert('Error', 'There was an error submitting your inquiry.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy Settings</Text>
      <View style={styles.setting}>
        <Text>Public Profile</Text>
        <Switch
          value={isPublicProfile}
          onValueChange={setIsPublicProfile}
        />
      </View>
      <View style={styles.setting}>
        <Text>Share Data with Third Parties</Text>
        <Switch
          value={shareDataWithThirdParties}
          onValueChange={setShareDataWithThirdParties}
        />
      </View>
      <View style={styles.setting}>
        <Text>Data Tracking</Text>
        <Switch
          value={isDataTrackingEnabled}
          onValueChange={setIsDataTrackingEnabled}
        />
      </View>
      <View style={styles.setting}>
        <Text>Live Location</Text>
        <Switch
          value={isLiveLocationEnabled}
          onValueChange={setIsLiveLocationEnabled}
        />
      </View>
      <View style={styles.inquiryContainer}>
        <Text style={styles.label}>Submit a Privacy Inquiry</Text>
        <TextInput
          style={styles.input}
          value={inquiry}
          onChangeText={setInquiry}
          placeholder="Enter your inquiry"
        />
        <Button title="Submit Inquiry" onPress={handleSubmitInquiry} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Delete Account" onPress={handleDeleteAccount} />
      </View>
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
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  inquiryContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default PrivacySettingsScreen;
