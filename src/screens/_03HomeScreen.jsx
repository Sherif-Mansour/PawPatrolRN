import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../utils/UserContext';
import Icon from 'react-native-vector-icons/Ionicons';

const categories = [
  'All',
  'Grooming',
  'Walking',
  'Boarding',
  'Training',
  'Veterinary',
  'Sitting',
];

const HomeScreen = () => {
  const { user } = useUser();
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        console.log('Fetching ads from Firestore...');
        const adsSnapshot = await firestore()
          .collectionGroup('userAds')
          .get();
        const adsList = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched ads:', adsList);
        setAds(adsList);
        setFilteredAds(adsList);
      } catch (error) {
        console.error('Error fetching ads:', error);
        Alert.alert('Error', 'Failed to fetch ads. Please try again later.');
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    filterAds();
  }, [searchQuery, selectedCategory, ads]);

  const filterAds = () => {
    let filtered = ads;

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(ad => ad.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(ad =>
        ad.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAds(filtered);
  };

  const handleAddToFavorites = (ad) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(ad.id)) {
        return prevFavorites.filter(favId => favId !== ad.id);
      } else {
        return [...prevFavorites, ad.id];
      }
    });
  };

  const renderCategory = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category ? styles.selectedCategoryButton : null,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === category ? styles.selectedCategoryButtonText : null,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.adContainer}>
      <View style={styles.adContent}>
        <Text style={styles.adTitle}>{item.title}</Text>
        <Text>{item.description}</Text>
        <Text>Address: {item.address}</Text>
        <Text>Services: {item.services.join(', ')}</Text>
        <Text>Category: {item.category}</Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleAddToFavorites(item)}
      >
        <Icon name={favorites.includes(item.id) ? "heart" : "heart-outline"} size={24} color="#ff0000" />
      </TouchableOpacity>
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
  selectedCategoryButton: {
    backgroundColor: '#0056b3',
  },
  categoryButtonText: {
    color: 'white',
  },
  selectedCategoryButtonText: {
    fontWeight: 'bold',
  },
  adContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
    position: 'relative',
  },
  adContent: {
    marginBottom: 10,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default HomeScreen;
