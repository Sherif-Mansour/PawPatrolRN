import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useUser } from '../../utils/UserContext';

const BookAppointment = ({ navigation }) => {
  const theme = useTheme();
  const route = useRoute();
  const { ad } = route.params;
  const { user, bookAppointment } = useUser();
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Ensure availableSlots is initialized as an array
  const availableSlots = ad.availableSlots || [];

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      Alert.alert('Error', 'Please select a date and time slot');
      return;
    }

    try {
      await bookAppointment(ad.id, selectedSlot, user.uid);
      Alert.alert('Success', 'Your appointment has been booked successfully');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'There was an error booking your appointment');
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Appointment for {ad.title}</Text>
      {availableSlots.length > 0 ? (
        availableSlots.map((slot, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.slotButton,
              selectedSlot === slot ? styles.selectedSlotButton : null,
            ]}
            onPress={() => setSelectedSlot(slot)}>
            <Text style={styles.slotButtonText}>{`${slot.date} - ${slot.time}`}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No available slots</Text>
      )}
      <Button
        mode="contained"
        buttonColor="#FFBF5D"
        contentStyle={{ width: '100%' }}
        onPress={handleBookAppointment}>
        Book Appointment
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  slotButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedSlotButton: {
    backgroundColor: '#0056b3',
  },
  slotButtonText: {
    color: 'white',
  },
});

export default BookAppointment;
