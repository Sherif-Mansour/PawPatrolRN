import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useUser} from '../../utils/UserContext';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Searchbar,
  useTheme,
  Chip,
  Button,
  Card,
  Text,
} from 'react-native-paper';
import {FlatList, ScrollView} from 'react-native-gesture-handler';

const categories = [
  'All',
  'Grooming',
  'Walking',
  'Boarding',
  'Training',
  'Veterinary',
  'Sitting',
];

const HomeScreen = ({navigation}) => {
  const theme = useTheme();
  const {
    ads,
    favorites,
    handleAddToFavorites,
    fetchAllAds,
    loadingAllAds,
    loadingFavorites,
    fetchUserFavorites,
    loading,
  } = useUser();
  const [filteredAds, setFilteredAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [adsFetched, setAdsFetched] = useState(false);

  useEffect(() => {
    if (!adsFetched && !loadingAllAds) {
      fetchAllAds();
      setAdsFetched(true);
    }
    const loadFavorites = async () => {
      await fetchUserFavorites();
    };
    loadFavorites();
  }, [adsFetched, loadingAllAds, fetchAllAds, fetchUserFavorites]);

  useEffect(() => {
    filterAds();
  }, [searchQuery, selectedCategory, ads, favorites]);

  const filterAds = () => {
    let filtered = ads;

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(ad => ad.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(ad =>
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredAds(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    console.log('Refreshing ads...');
    try {
      await fetchAllAds();
      console.log('Ads refreshed successfully.');
    } catch (error) {
      console.error('Error refreshing ads:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // https://callstack.github.io/react-native-paper/docs/components/Chip/

  const renderCategory = category => (
    <Chip
      key={category}
      onPress={() => setSelectedCategory(category)}
      selected={selectedCategory === category}
      style={[styles.categoryChip]}>
      {category}
    </Chip>
  );

  const renderItem = ({item}) => (
    <Card style={styles.adContainer}>
      <Card.Title
        titleStyle={styles.adTitle}
        title={item.title}
        subtitle={`Address: ${item.address}\nServices: ${item.services.join(
          ', ',
        )}\nCategory: ${item.category}`}
        subtitleNumberOfLines={3}
        subtitleStyle={styles.adTitle}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={styles.adContent}>
          {item.description}
        </Text>
      </Card.Content>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleAddToFavorites(item.id)}>
        <Icon
          name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
          size={24}
          color="#ff0000"
        />
      </TouchableOpacity>
    </Card>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingTop: 5,
      backgroundColor: '#FFF3D6',
    },
    categoryChip: {
      marginRight: 10,
    },
    categoriesScrollContainer: {
      flexDirection: 'row',
      marginVertical: 10,
    },
    adContainer: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
      paddingTop: 5,
      marginBottom: 10,
      position: 'relative',
      backgroundColor: theme.colors.secondaryContainer,
    },
    adTitle: {
      fontWeight: 'bold',
      color: theme.colors.onPrimaryContainer,
    },
    adContent: {
      color: theme.colors.onPrimaryContainer,
      marginBottom: 10,
    },
    favoriteButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
  });

  if (loading || loadingAllAds || loadingFavorites) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Button
          style={{backgroundColor: 'transparent'}}
          onPress={() => navigation.navigate('Location')}
          icon="map-marker">
          Location
        </Button>
      </View>
      <Searchbar
        style={{
          backgroundColor: theme.colors.elevation.level5,
          borderWidth: 1,
          borderColor: theme.colors.outline,
        }}
        placeholder="Search for services"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      />
    </View>
  );
};

export default HomeScreen;

// took help of chatgpt to get contrasting colors for the app
// what color is gonna look good with : 'rgb(0, 104, 123)', for app

// got icons for home screen from react-icons
// https://react-icons.github.io/react-icons/
