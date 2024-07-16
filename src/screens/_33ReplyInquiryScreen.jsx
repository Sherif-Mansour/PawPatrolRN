import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const ReplyInquiryScreen = ({ route, navigation }) => {
  const { inquiry } = route.params;
  const [reply, setReply] = useState('');

  const handleSendReply = async () => {
    try {
      await firestore().collection('inquiries').doc(inquiry.id).update({
        reply,
        repliedAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Success', 'Reply sent successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error sending reply:', error);
      Alert.alert('Error', 'There was an error sending the reply.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.inquiryText}>Subject: {inquiry.subject}</Text>
      <Text style={styles.inquiryText}>Details: {inquiry.details}</Text>
      <Text style={styles.inquiryText}>Contact Info: {inquiry.contactInfo}</Text>
      <TextInput
        label="Reply"
        value={reply}
        onChangeText={setReply}
        mode="outlined"
        multiline
        style={styles.textInput}
      />
      <Button mode="contained" onPress={handleSendReply} style={styles.sendButton}>
        Send Reply
      </Button>
    </View>
  );
};

export default ReplyInquiryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inquiryText: {
    fontSize: 16,
    marginBottom: 10,
  },
  textInput: {
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#007BFF',
  },
});
