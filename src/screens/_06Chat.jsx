import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Avatar,
  Card,
  Divider,
  Text,
  useTheme,
  IconButton,
} from 'react-native-paper';
import {useUser} from '../../utils/UserContext';

const Chat = ({navigation}) => {
  const theme = useTheme();
  const {user, fetchUserChats} = useUser();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        const userChats = await fetchUserChats(user.uid);
        console.log('Fetched User Chats:', userChats); // Debugging log
        setChats(userChats);
        setLoading(false);
      }
    };
    fetchChats();
  }, [user, fetchUserChats]);

  const renderChatItem = ({item}) => {
    console.log('Rendering Chat Item:', item); // Debugging log
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('IndividualChat', {chatId: item.id})
        }>
        <Card style={styles.chatCard}>
          <View style={styles.chatCardContent}>
            {item.otherUserAvatar ? (
              <Avatar.Image size={48} source={{uri: item.otherUserAvatar}} />
            ) : (
              <Avatar.Icon size={48} icon="account" />
            )}
            <View style={styles.chatDetails}>
              <Text style={styles.chatName}>{item.otherUserName}</Text>
              <Text style={styles.chatLastMessage}>
                {item.lastMessageReceived}
              </Text>
            </View>
            <IconButton icon="arrow-right-thick" size={24} />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          renderItem={renderChatItem}
          ItemSeparatorComponent={() => <Divider />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No chats available.</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatCard: {
    width: '100%',
    marginVertical: 5,
    backgroundColor: 'white', // Ensure background color is set
  },
  chatCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  chatDetails: {
    flex: 1,
    marginLeft: 10,
  },
  chatName: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
  chatLastMessage: {
    color: '#777',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
  },
});

export default Chat;
