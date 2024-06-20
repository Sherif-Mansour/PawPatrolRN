import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button, useTheme} from 'react-native-paper';

const BookingScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  // will fetch data future
  const bookings = [];

  // fake booking history here now:
  const bookingHistory = [
    {id: 1, serviceName: 'Dog Walking', name: 'John', date: '2022-05-20'},
    {id: 2, serviceName: 'Pet Grooming', name: 'Alice', date: '2022-06-15'},
    {id: 3, serviceName: 'Vet Appointment', name: 'Sarah', date: '2023-10-10'},
  ];

  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.ScrollView}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Bookings</Text>
        </View>

        {/* if there is no upcoming booking, then show this card to let user go to home page */}
        {bookings.length === 0 ? (
          <View style={styles.noBookingContainer}>
            <Text style={styles.emoji}>🐕‍🦺</Text>
            <Text style={styles.noBookingText}>No Bookings Yet</Text>
            <Text style={styles.noBookingSubText}>
              Time to find some lovely services for your pets
            </Text>
            <Button
              mode="contained"
              // need to work out how to navigate to home page.
              onPress={() => navigation.navigate('Home')}>
              Start Searching
            </Button>
          </View>
        ) : (
          <View>{/* new bookings here */}</View>
        )}

        <View style={styles.historyHeaderContainer}>
          <Text style={styles.historyHeaderText}>Booking History</Text>
        </View>

        {bookingHistory.map(booking => (
          <View key={booking.id} style={styles.historyContainer}>
            <Text style={styles.historyText}>
              Service Name: {booking.serviceName}
            </Text>
            <Text style={styles.historyText}>Name: {booking.name}</Text>
            <Text style={styles.historyText}>Date: {booking.date}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  ScrollView: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#FFF3D6',
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 32,
    color: 'black',
  },
  noBookingContainer: {
    margin: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  emoji: {
    fontSize: 48,
  },
  noBookingText: {
    fontSize: 28,
    marginBottom: 8,
  },
  noBookingSubText: {
    margin: 12,
    textAlign: 'center',
    color: '#555',
  },
  historyHeaderContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  historyHeaderText: {
    fontSize: 20,
    color: 'black',
  },
  historyContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'grey',
  },
  historyText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
});

export default BookingScreen;
