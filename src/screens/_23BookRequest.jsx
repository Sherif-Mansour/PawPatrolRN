import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {TextInput, Button, Text, useTheme} from 'react-native-paper';
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
  const theme = useTheme();

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
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={styles.title}>Book Request</Text>
      <TextInput
        label="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
        mode="outlined"
        placeholder="Enter Date"
      />
      <TextInput
        label="Time (HH:MM)"
        value={time}
        onChangeText={setTime}
        style={styles.input}
        mode="outlined"
        placeholder="Enter Time"
      />
      <TextInput
        label="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
        mode="outlined"
        placeholder="Enter Location"
      />
      <TextInput
        label="Price"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
        mode="outlined"
        placeholder="Enter Price"
      />
      <Button
        mode="contained"
        style={styles.button}
        onPress={handleSubmit}
        buttonColor="#009B7D">
        Submit
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default BookRequestScreen;
