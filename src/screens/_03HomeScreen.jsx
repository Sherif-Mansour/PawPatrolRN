import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../utils/UserContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { Searchbar, useTheme, Chip, Button } from 'react-native-paper';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();
  const theme = useTheme()
  const { user } = useUser();
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [expanded, setExpanded] = React.useState(true);

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

  {/** https://callstack.github.io/react-native-paper/docs/components/Chip/  **/ }
  const renderCategory = (category) => (
    <Chip
      key={category}
      onPress={() => setSelectedCategory(category)}
      selected={selectedCategory === category}
      style={[
        styles.categoryChip,
      ]}
    >
      {category}
    </ Chip>
  );

  const renderItem = ({ item }) => (
    <View style={styles.adContainer}>
      <View style={styles.adContent}>
        <Text style={styles.adTitle}>{item.title}</Text>
        <Text style={styles.adData}>{item.description}</Text>
        <Text style={styles.adData}>Address: {item.address}</Text>
        <Text style={styles.adData}>Services: {item.services.join(', ')}</Text>
        <Text style={styles.adData}>Category: {item.category}</Text>
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
      <View style={{ flexDirection: 'row' }}>
        <Button
          icon='map-marker'
          onPress={() => navigation.navigate('Location')}
          style={{backgroundColor: 'transparent'}}
        >
          Location
        </Button>
      </View>
      <Searchbar
        style={{ backgroundColor: theme.colors.elevation.level5, borderWidth: 1 }}
        placeholder='Search for services'
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View
        style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
      >
        <View style={styles.categoriesScrollContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(renderCategory)}
          </ScrollView>
        </View>
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
    paddingTop: 5,
    backgroundColor: 'white',
  },
  categoryChip: {
    marginRight: 10
  },
  categoriesScrollContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  adContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgb(0, 104, 123)',
    backgroundColor: 'rgb(0, 104, 123)',
    marginBottom: 10,
    borderRadius: 5,
    position: 'relative',
  },
  adContent: {
    color: '#009B7D',
    marginBottom: 10,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(255, 155, 83)',
    marginBottom: 5,
  },
  adData: {
    color: 'rgb(200, 200, 200)',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default HomeScreen;

// took help of chatgpt to get contrasting colors for the app
// what colour is gonna look good with : 'rgb(0, 104, 123)', for app

// got icons for home screen from react-icons
// https://react-icons.github.io/react-icons/
