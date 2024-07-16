import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../utils/UserContext';
import { Card } from 'react-native-paper';

const BookingScreen = () => {
  const [upcomingRequests, setUpcomingRequests] = useState([]);
  const [pastRequests, setPastRequests] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsSnapshot = await firestore()
          .collection('appointments')
          .where('status', '==', 'approved')
          .where('participants', 'array-contains', user.uid)
          .get();

        const fetchedRequests = await Promise.all(
          requestsSnapshot.docs.map(async doc => {
            const requestData = doc.data();
            const otherUserId = requestData.participants.find(
              participant => participant !== user.uid
            );
            const otherUserProfile = await fetchUserProfile(otherUserId);
            return {
              id: doc.id,
              ...requestData,
              otherUserProfile,
            };
          })
        );

        const now = new Date();
        const upcoming = fetchedRequests.filter(request => new Date(request.date) >= now);
        const past = fetchedRequests.filter(request => new Date(request.date) < now);

        setUpcomingRequests(upcoming);
        setPastRequests(past);
      } catch (error) {
        console.error('Error fetching approved requests:', error);
        Alert.alert('Error', 'There was an error fetching approved requests.');
      }
    };

    fetchRequests();
  }, [user.uid]);

  const fetchUserProfile = async userId => {
    const userProfileRef = firestore().collection('profiles').doc(userId);
    const userProfileDoc = await userProfileRef.get();
    if (userProfileDoc.exists) {
      return userProfileDoc.data();
    }
    return null;
  };

  const renderRequest = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        {item.otherUserProfile?.profilePicture ? (
          <Image
            source={{ uri: item.otherUserProfile.profilePicture }}
            style={styles.profilePicture}
          />
        ) : (
          <Image
            source={require('../../assets/images/default-profile.jpg')}
            style={styles.profilePicture}
          />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>
            Request with {item.otherUserProfile?.firstName} {item.otherUserProfile?.lastName}
          </Text>
          <Text style={styles.dateText}>Date: {item.date} - Time: {item.time}</Text>
          <Text style={styles.locationText}>Location: {item.location}</Text>
          <Text style={styles.priceText}>Price: {item.price}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Upcoming Requests</Text>
      {upcomingRequests.length === 0 ? (
        <Text>No upcoming requests available.</Text>
      ) : (
        <FlatList
          data={upcomingRequests}
          renderItem={renderRequest}
          keyExtractor={item => item.id}
        />
      )}

      <Text style={styles.sectionTitle}>Past Requests</Text>
      {pastRequests.length === 0 ? (
        <Text>No past requests available.</Text>
      ) : (
        <FlatList
          data={pastRequests}
          renderItem={renderRequest}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
  },
  locationText: {
    fontSize: 16,
  },
  priceText: {
    fontSize: 16,
  },
});

export default BookingScreen;