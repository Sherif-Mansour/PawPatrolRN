import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const BookAppointmentScreen = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { chatId } = route.params;
  const user = auth().currentUser;

  const handleSubmit = async () => {
    if (!date || !time || !location || !price) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const appointmentData = {
        chatId,
        requesterId: user.uid,
        date,
        time,
        location,
        price,
        status: 'pending',
        participants: [user.uid, chatId],
      };

      await firestore().collection('appointments').add(appointmentData);
      Alert.alert('Appointment Request Sent', 'Your appointment request has been sent.');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting appointment:', error);
      Alert.alert('Error', 'There was an error submitting your appointment request.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Appointment</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="Date (YYYY-MM-DD)"
      />
      <TextInput
        style={styles.input}
        value={time}
        onChangeText={setTime}
        placeholder="Time (HH:MM)"
      />
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
      />
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Price"
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={handleSubmit} />
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
});

export default BookAppointmentScreen;
