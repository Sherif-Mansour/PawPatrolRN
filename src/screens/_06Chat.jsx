import React, {useState, useEffect, useCallback} from 'react';
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
        setChats(userChats);
        setLoading(false);
      }
    };
    fetchChats();
  }, [user, fetchUserChats]);

  const renderChatItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('IndividualChat', {chatId: item.id})}>
      <Card style={styles.chatCard}>
        <Card.Title
          title={item.chatName}
          subtitle={item.lastMessage}
          left={props => <Avatar.Icon {...props} icon="chat" />}
          right={props => <IconButton {...props} icon="arrow-right-thick" />}
        />
      </Card>
    </TouchableOpacity>
  );

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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  chatCard: {
    width: '100%',
    padding: 15,
    marginVertical: 5,
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
