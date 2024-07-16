import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../utils/UserContext';
import { Card } from 'react-native-paper';
import { Agenda } from 'react-native-calendars';

const BookingScreen = ({ navigation }) => {
  const [requests, setRequests] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading indicator
  const { user } = useUser();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true); // Set loading state to true when fetching starts
      try {
        const requestsSnapshot = await firestore()
          .collection('appointments')
          .where('status', '==', 'approved')
          .where('participants', 'array-contains', user.uid)
          .get();

        const fetchedRequests = {};

        requestsSnapshot.docs.forEach(doc => {
          const requestData = doc.data();
          const date = requestData.date; // Assuming requestData.date is in YYYY-MM-DD format

          if (!fetchedRequests[date]) {
            fetchedRequests[date] = [];
          }

          fetchedRequests[date].push({
            id: doc.id,
            ...requestData,
          });
        });

        setRequests(fetchedRequests);
      } catch (error) {
        console.error('Error fetching approved requests:', error);
        Alert.alert('Error', 'There was an error fetching approved requests.');
      } finally {
        setLoading(false); // Set loading state to false when fetching ends
      }
    };

    fetchRequests();
  }, [user.uid]);

  const renderRequest = (request) => (
    <Card style={styles.card} onPress={() => navigation.navigate('BookingDetailsScreen', { request })}>
      <View style={styles.cardContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.dateText}>Date: {request.date}</Text>
          <Text style={styles.timeText}>Time: {request.time}</Text>
          <Text style={styles.locationText}>Location: {request.location}</Text>
          <Text style={styles.priceText}>Price: {request.price}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text> // Display loading indicator while fetching data
      ) : Object.keys(requests).length === 0 ? (
        <Text>No bookings found for this date.</Text> // Display message if no bookings found
      ) : (
        <Agenda
          items={requests}
          selected={selectedDate}
          renderItem={(item) => renderRequest(item)}
          renderEmptyDate={() => (
            <View style={styles.emptyDate}>
              <Text>No bookings on this date.</Text>
            </View>
          )}
          rowHasChanged={(r1, r2) => r1.id !== r2.id}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markingType={'multi-dot'}
          markedDates={{
            ...Object.keys(requests).reduce((acc, date) => {
              acc[date] = { marked: true, dots: [{ color: 'blue' }] };
              return acc;
            }, {}),
          }}
          theme={{
            selectedDayBackgroundColor: '#00adf5',
            todayTextColor: '#00adf5',
            agendaKnobColor: '#00adf5',
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3D6',
  },
  card: {
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  infoContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 16,
  },
  locationText: {
    fontSize: 16,
  },
  priceText: {
    fontSize: 16,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
    paddingLeft: 20,
  },
});

export default BookingScreen;
