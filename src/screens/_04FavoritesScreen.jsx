import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useUser } from '../../utils/UserContext';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const FavoritesScreen = ({ navigation }) => {
  const theme = useTheme();
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
      style={[styles.listContainer, { borderBottomColor: theme.colors.onBackground }]}
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
  },
  FlatList: {},
  listContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 10,
  },
  listText: {
    fontSize: 18,
  },
  listDescription: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoritesScreen;


