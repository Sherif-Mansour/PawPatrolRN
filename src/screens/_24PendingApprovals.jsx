import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../utils/UserContext';
import { Button, Card } from 'react-native-paper';

const PendingRequestsScreen = () => {
  const [requests, setRequests] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsSnapshot = await firestore()
          .collection('appointments') // Assuming your collection is named 'appointments'
          .where('status', '==', 'pending')
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

        setRequests(fetchedRequests);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        Alert.alert('Error', 'There was an error fetching pending requests.');
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

  const handleApprove = async requestId => {
    try {
      await firestore().collection('appointments').doc(requestId).update({
        status: 'approved',
      });
      Alert.alert('Success', 'Request approved successfully.');
      setRequests(requests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error approving request:', error);
      Alert.alert('Error', 'There was an error approving the request.');
    }
  };

  const handleReject = async requestId => {
    try {
      await firestore().collection('appointments').doc(requestId).update({
        status: 'rejected',
      });
      Alert.alert('Success', 'Request rejected successfully.');
      setRequests(requests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
      Alert.alert('Error', 'There was an error rejecting the request.');
    }
  };

  const renderItem = ({ item }) => (
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
      <Card.Actions>
        <Button onPress={() => handleApprove(item.id)}>Approve</Button>
        <Button onPress={() => handleReject(item.id)}>Reject</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No pending requests.</Text>}
      />
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

export default PendingRequestsScreen;
