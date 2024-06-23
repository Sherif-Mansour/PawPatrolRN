import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {GiftedChat, Bubble, Send} from 'react-native-gifted-chat';
import {IconButton, Button, useTheme} from 'react-native-paper';
import {useUser} from '../../utils/UserContext';
import {launchImageLibrary} from 'react-native-image-picker';

const IndividualChat = () => {
  const theme = useTheme();
  const {user, sendMessage, subscribeToMessages, sendMultimediaMessage} =
    useUser();
  const route = useRoute();
  const navigation = useNavigation();
  const {chatId} = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(chatId, msgs => {
      console.log('Messages received:', msgs);
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [chatId]);

  const onSend = useCallback(
    (messages = []) => {
      console.log('Sending messages:', messages);
      messages.forEach(message => {
        if (message.image) {
          sendMultimediaMessage(chatId, message.image);
        } else {
          sendMessage(chatId, message.text);
        }
      });
    },
    [chatId],
  );

  const renderBubble = props => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#6200ee',
        },
        left: {
          backgroundColor: '#f1f1f1',
        },
      }}
    />
  );

  const renderSend = props => (
    <Send {...props}>
      <View style={styles.sendingContainer}>
        <IconButton icon="send" size={24} color="#6200ee" />
      </View>
    </Send>
  );

  const pickImage = () => {
    launchImageLibrary({}, async response => {
      if (
        !response.didCancel &&
        !response.error &&
        response.assets &&
        response.assets.length > 0
      ) {
        const imageUri = response.assets[0].uri;
        sendMultimediaMessage(chatId, imageUri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: user.uid,
          name: user.displayName,
          avatar: user.photoURL,
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
      />
      <View style={styles.buttonContainer}>
        <Button
          icon="calendar"
          mode="contained"
          onPress={() => navigation.navigate('BookAppointment', {chatId})}>
          Book Appointment
        </Button>
        <Button
          icon="alert"
          mode="contained"
          onPress={() => navigation.navigate('PendingAppointments', {chatId})}>
          Pending Approvals
        </Button>
      </View>
      <Button
        icon="camera"
        mode="contained"
        onPress={pickImage}
        style={styles.imageButton}>
        Send Image
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  imageButton: {
    margin: 10,
  },
});

export default IndividualChat;
