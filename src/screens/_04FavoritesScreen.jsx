import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useUser } from '../../utils/UserContext';

const FavoritesScreen = ({ navigation }) => {
  const { user, lists, fetchUserLists, loadingFavorites } = useUser();
  const [fetchedLists, setFetchedLists] = useState([]);

  useEffect(() => {
    const unsubscribe = fetchUserLists();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  useEffect(() => {
    setFetchedLists(lists);
  }, [lists]);

  const renderList = ({ item }) => (
    <TouchableOpacity
      style={styles.listContainer}
      onPress={() => navigation.navigate('FavoriteAdsScreen', { list: item })}
    >
      <Text style={styles.listText}>{item.name}</Text>
      <Text style={styles.listDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  if (loadingFavorites) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Favorites</Text>
      </View>
      <FlatList
        style={styles.FlatList}
        data={fetchedLists}
        renderItem={renderList}
        keyExtractor={item => item.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 5,
  },
  headerText: {
    fontSize: 32,
    color: 'black',
  },
  FlatList: {},
  listContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 10,
  },
  listText: {
    fontSize: 18,
    color: '#000',
  },
  listDescription: {
    fontSize: 14,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoritesScreen;


