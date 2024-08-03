import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
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

        for (const doc of requestsSnapshot.docs) {
          const requestData = doc.data();
          const date = requestData.date; // Assuming requestData.date is in YYYY-MM-DD format

          if (!fetchedRequests[date]) {
            fetchedRequests[date] = [];
          }

          const participantData = await fetchParticipantData(requestData.participants);

          fetchedRequests[date].push({
            id: doc.id,
            ...requestData,
            participantsData: participantData,
          });
        }

        setRequests(fetchedRequests);
      } catch (error) {
        console.error('Error fetching approved requests:', error);
        Alert.alert('Error', 'There was an error fetching approved requests.');
      } finally {
        setLoading(false); // Set loading state to false when fetching ends
      }
    };

    const fetchParticipantData = async (participantIds) => {
      const participants = [];
      for (const id of participantIds) {
        if (id !== user.uid) {
          const userDoc = await firestore().collection('profiles').doc(id).get();
          if (userDoc.exists) {
            participants.push(userDoc.data());
          }
        }
      }
      return participants;
    };

    fetchRequests();
  }, [user.uid]);

  const renderRequest = (request) => (
    <Card style={styles.card} >
      <View style={styles.cardContent}>
        {request.participantsData.map(participant => (
          <View key={participant.uid} style={styles.participantContainer}>
            <Image source={{ uri: participant.profilePicture }} style={styles.participantProfilePicture} />
            <Text style={styles.participantName}>{participant.firstName} {participant.lastName}</Text>
          </View>
        ))}
        <View style={styles.bookingInfoContainer}>
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
        <ActivityIndicator size="large" color="#00adf5" /> // Display loading spinner while fetching data
      ) : Object.keys(requests).length === 0 ? (
        <View style={styles.centeredView}>
          <Text style={styles.noBookingText}>No bookings found for this date.</Text>
        </View>
      ) : (
        <Agenda
          items={requests}
          selected={selectedDate}
          renderItem={(item) => renderRequest(item)}
          renderEmptyData={() => 
            <View style={styles.centeredView}>
              <Text style={styles.noBookingText}>No bookings on this date.</Text>
            </View>
          }
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
  card: {
    marginBottom: 10,
  },
  cardContent: {
    padding: 10,
  },
  participantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  participantProfilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  participantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookingInfoContainer: {
    marginTop: 20,
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
  container: {
    flex: 1,
    backgroundColor: '#FFF3D6',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBookingText: {
    fontSize: 18,
    color: '#333',
  },
});

export default BookingScreen;
