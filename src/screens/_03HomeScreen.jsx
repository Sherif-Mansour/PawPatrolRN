

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const categories = [
  'Grooming',
  'Walking',
  'Boarding',
  'Training',
  'Veterinary',
  'Sitting',
];

const HomeScreen = () => {
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsSnapshot = await firestore()
          .collectionGroup('userAds')
          .get();
        const adsList = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAds(adsList);
        setFilteredAds(adsList);
      } catch (error) {
        console.error('Error fetching ads: ', error);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAds(ads);
    } else {
      const filtered = ads.filter(ad =>
        ad.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAds(filtered);
    }
  }, [searchQuery, ads]);

  const renderCategory = (category) => (
    <TouchableOpacity key={category} style={styles.categoryButton}>
      <Text style={styles.categoryButtonText}>{category}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.adContainer}>
      <Text style={styles.adTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text>Address: {item.address}</Text>
      <Text>Services: {item.services.join(', ')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for services..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.categoriesContainer}>
        {categories.map(renderCategory)}
      </View>
      <FlatList
        data={filteredAds}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No ads found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  categoryButtonText: {
    color: 'white',
  },
  adContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default HomeScreen;
