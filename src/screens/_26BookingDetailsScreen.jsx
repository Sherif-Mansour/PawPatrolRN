// src/screens/_26BookingDetailsScreen.jsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Card } from 'react-native-paper';

const BookingDetailsScreen = () => {
  const route = useRoute();
  const { booking } = route.params;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={`Booking with ${booking.otherUserProfile?.firstName} ${booking.otherUserProfile?.lastName}`} />
        <Card.Content>
          <Text style={styles.text}>Title: {booking.title}</Text>
          <Text style={styles.text}>Date: {booking.date}</Text>
          <Text style={styles.text}>Time: {booking.time}</Text>
          <Text style={styles.text}>Location: {booking.location}</Text>
          <Text style={styles.text}>Price: {booking.price}</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF3D6',
  },
  card: {
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default BookingDetailsScreen;
