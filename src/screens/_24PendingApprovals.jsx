import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../utils/UserContext';
import { Button, Card } from 'react-native-paper';

const PendingAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsSnapshot = await firestore()
          .collection('appointments')
          .where('status', '==', 'pending')
          .where('participants', 'array-contains', user.uid)
          .get();

        const fetchedAppointments = appointmentsSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(appointment => appointment.requesterId  == user.uid);

        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error('Error fetching pending appointments:', error);
        Alert.alert('Error', 'There was an error fetching pending appointments.');
      }
    };

    fetchAppointments();
  }, [user.uid]);

  const handleApprove = async (appointmentId) => {
    try {
      await firestore().collection('appointments').doc(appointmentId).update({
        status: 'approved',
      });
      Alert.alert('Success', 'Appointment approved successfully.');
      setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
    } catch (error) {
      console.error('Error approving appointment:', error);
      Alert.alert('Error', 'There was an error approving the appointment.');
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      await firestore().collection('appointments').doc(appointmentId).update({
        status: 'rejected',
      });
      Alert.alert('Success', 'Appointment rejected successfully.');
      setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      Alert.alert('Error', 'There was an error rejecting the appointment.');
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={`Appointment with ${item.participants.filter(participant => participant !== user.uid)[0]}`}
        subtitle={`Date: ${item.date} - Time: ${item.time}`}
      />
      <Card.Content>
        <Text>Location: {item.location}</Text>
        <Text>Price: {item.price}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleApprove(item.id)}>Approve</Button>
        <Button onPress={() => handleReject(item.id)}>Reject</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No pending appointments.</Text>}
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
});

export default PendingAppointmentsScreen;
