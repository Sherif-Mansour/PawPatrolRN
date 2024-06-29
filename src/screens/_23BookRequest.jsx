import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, Button, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSendbirdChat} from '@sendbird/uikit-react-native';

const BookRequestScreen = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [otherParticipantId, setOtherParticipantId] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const {channelUrl} = route.params;
  const user = auth().currentUser;
  const {sdk} = useSendbirdChat();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const channel = await sdk.groupChannel.getChannel(channelUrl);
        const otherParticipant = channel.members.find(
          member => member.userId !== user.uid,
        );
        setOtherParticipantId(otherParticipant.userId);
      } catch (error) {
        console.error('Error fetching chat participants:', error);
        Alert.alert('Error', 'There was an error fetching chat participants.');
      }
    };

    fetchParticipants();
  }, [channelUrl, user.uid, sdk]);

  const handleSubmit = async () => {
    if (!date || !time || !location || !price) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const requestData = {
        channelUrl,
        requesterId: user.uid,
        date,
        time,
        location,
        price,
        status: 'pending',
        participants: [user.uid, otherParticipantId],
      };

      await firestore().collection('appointments').add(requestData);
      Alert.alert('Request Sent', 'Your request has been sent.');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting request:', error);
      Alert.alert('Error', 'There was an error submitting your request.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Request</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="Date (YYYY-MM-DD)"
      />
      <TextInput
        style={styles.input}
        value={time}
        onChangeText={setTime}
        placeholder="Time (HH:MM)"
      />
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
      />
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Price"
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default BookRequestScreen;
