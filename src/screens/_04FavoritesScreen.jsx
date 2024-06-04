import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppHeader from '../../components/Header';

const UsersList = () => {
  const [users, setUsers] = useState([
    {
      id: '1',
      username: 'user1',
      name: 'User One',
      profileImage: 'https://via.placeholder.com/100',
    },
    {
      id: '2',
      username: 'user2',
      name: 'User Two',
      profileImage: 'https://via.placeholder.com/100',
    },
    {
      id: '3',
      username: 'user3',
      name: 'User Three',
      profileImage: 'https://via.placeholder.com/100',
    },
    // Add more users as needed
  ]);

  const renderUserItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image source={{uri: item.profileImage}} style={styles.profileImage} />
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.usernameText}>@{item.username}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {users.map(user => renderUserItem({item: user}))}
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFF3D6',
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  usernameText: {
    fontSize: 14,
    color: 'gray',
  },
});

export default UsersList;
