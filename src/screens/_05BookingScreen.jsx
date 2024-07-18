import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
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

          // Fetch user profile from chat participants
          const otherParticipantId = requestData.participants.find(participantId => participantId !== user.uid);
          const userProfile = await fetchUserProfile(otherParticipantId);

          fetchedRequests[date].push({
            id: doc.id,
            ...requestData,
            profilePicture: userProfile.profilePicture,
            name: `${userProfile.firstName} ${userProfile.lastName}`,
            otherParticipantId: otherParticipantId, // Add other participant ID for navigation
            channelUrl: requestData.channelUrl, // Assuming channelUrl is stored in requestData
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

    fetchRequests();
  }, [user.uid]);

  const fetchUserProfile = async (userId) => {
    const userProfileRef = firestore().collection('profiles').doc(userId);
    const userProfileDoc = await userProfileRef.get();

    if (userProfileDoc.exists) {
      return userProfileDoc.data();
    } else {
      return {
        firstName: 'Unknown',
        lastName: 'User',
        profilePicture: '',
      };
    }
  };

  const handleChatNavigation = async (channelUrl) => {
    if (channelUrl) {
      navigation.navigate('IndividualChat', { channelUrl });
    } else {
      Alert.alert('Error', 'No chat channel found for this booking.');
    }
  };

  const renderRequest = (request) => (
    <Card style={styles.card} onPress={() => handleChatNavigation(request.channelUrl)}>
      <View style={styles.cardContent}>
        <Image source={{ uri: request.profilePicture }} style={styles.profilePicture} />
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{request.name}</Text>
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
      ) : (
        <Agenda
          items={requests}
          selected={selectedDate}
          renderItem={(item) => renderRequest(item)}
          renderEmptyData={() => {
            return (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Booking on this day</Text>
              </View>
            );
          }}
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
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#555',
  },
});

export default BookingScreen;
