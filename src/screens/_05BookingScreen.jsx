import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Button, Searchbar, useTheme } from 'react-native-paper';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from 'react';

const BookingScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  // will fetch data that user has booked in the future
  const bookings = [];

  // fake data from ChatGPT
  const bookingHistory = [
    { id: 1, serviceName: 'Dog Walking', name: 'John', date: '2022-05-20' },
    { id: 2, serviceName: 'Pet Grooming', name: 'Alice', date: '2022-06-15' },
    { id: 3, serviceName: 'Vet Appointment', name: 'Sarah', date: '2023-10-10' },
    { id: 4, serviceName: 'Pet Sitting', name: 'Bob', date: '2023-11-01' },
    { id: 5, serviceName: 'Pet Training', name: 'Emma', date: '2023-12-05' },
    { id: 6, serviceName: 'Pet Boarding', name: 'Mike', date: '2024-01-15' },
    { id: 7, serviceName: 'Pet Sitting', name: 'Bob', date: '2023-11-01' },
    { id: 8, serviceName: 'Pet Training', name: 'Emma', date: '2023-12-05' },
    { id: 9, serviceName: 'Pet Boarding', name: 'Mike', date: '2024-01-15' },
    { id: 10, serviceName: 'Pet Boarding', name: 'Mike', date: '2024-01-15' },
  ];

  // state to manage booking visble booking history, 
  // initial number set to display 3 entries.
  const [visibleEntries, setVisibleEntries] = useState(3);

  // copy from React Native Paper doc.
  const [searchQuery, setSearchQuery] = useState('');

  const handleShowMore = () => {
    // increse by 3 entries each time
    setVisibleEntries(visibleEntries + 3);
  }


  const handleStartSearching = () => {
    // CommonActions.reset: This will reset the navigation state of the navigator to the given routes and index. Setting index: 0 ensures the home screen is the one shown.
    // routes: [{ name: 'Home' }]: This specifies that the BottomTabNavigator should navigate to the route named 'Home', which corresponds to the initial screen (index 0).
    // ask for chatGPT's help.
    // made research on react navigation.
    // made almost four hours research( I know...)
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    )
  };

  // Filter booking history based on search query
  // snippet from chatGPT
  const filteredBookingHistory = bookingHistory.filter(booking =>
    booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.ScrollView}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Bookings</Text>
        </View>

        {/* if there are no upcoming bookings, show this card to let user go to the home page */}
        {bookings.length === 0 ? (
          <View style={styles.noBookingContainer}>
            <Text style={styles.emoji}>🐕‍🦺</Text>
            <Text style={styles.noBookingText}>No Bookings Yet!</Text>
            <Text style={styles.noBookingSubText}>
              Time to find some lovely services for your pets
            </Text>
            <Button mode="contained" onPress={handleStartSearching}>
              Start Searching
            </Button>
          </View>
        ) : (
          <View>{/* display new bookings here */}</View>
        )}

        <View style={styles.bookingSearch}>
          <View style={styles.historyHeaderContainer}>
            <Text style={styles.historyHeaderText}>Booking History</Text>
          </View>
          <Searchbar
            placeholder="Search booking history"
            value={searchQuery}
            onChangeText={query => setSearchQuery(query)}
            style={styles.searchBar}
          />
        </View>

        {/* Display filtered and visible entries of booking history */}
        {filteredBookingHistory.slice(0, visibleEntries).map((booking) => (
          <View key={booking.id} style={styles.historyContainer}>
            <Text style={styles.historyText}>
              Service Name: {booking.serviceName}
            </Text>
            <Text style={styles.historyText}>
              Name: {booking.name}
            </Text>
            <Text style={styles.historyText}>
              Date: {booking.date}
            </Text>
          </View>
        ))}

        {/* show more button */}
        {visibleEntries < bookingHistory.length && (
          <View style={styles.showMoreButton}>
            <Button
              mode="contained"
              onPress={handleShowMore}
            >
              Show More
            </Button>
          </View>
        )}

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
  showMoreButton: {
    margin: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
  }
});

export default BookingScreen;

