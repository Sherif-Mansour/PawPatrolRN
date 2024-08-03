import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useUser } from '../../utils/UserContext';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const FavoritesScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user, lists, fetchUserLists, handleDeleteList, loadingFavorites } = useUser();
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

  const deleteList = (listName) => {
    Alert.alert(
      "Delete List",
      `Are you sure you want to delete the list "${listName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => handleDeleteList(listName) }
      ],
      { cancelable: false }
    );
  };

  const renderList = ({ item }) => (
    <View style={[styles.listContainer, { borderBottomColor: theme.colors.onBackground }]}>
      <TouchableOpacity
        style={styles.listTextContainer}
        onPress={() => navigation.navigate('FavoriteAdsScreen', { list: item })}
      >
        <Text style={styles.listText}>{item.name}</Text>
        <Text style={styles.listDescription}>{item.description}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteList(item.name)}
      >
        <Icon name="trash-bin-outline" size={24} color="#ff0000" />
      </TouchableOpacity>
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 10,
  },
  listTextContainer: {
    flex: 1,
  },
  listText: {
    fontSize: 18,
  },
  listDescription: {
    fontSize: 14,
  },
  deleteButton: {
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoritesScreen;
