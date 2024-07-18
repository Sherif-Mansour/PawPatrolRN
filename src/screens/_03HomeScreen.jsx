import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { useUser } from '../../utils/UserContext';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Searchbar,
  useTheme,
  Chip,
  Button,
  Card,
  Text,
  Modal,
  Portal,
  IconButton
} from 'react-native-paper';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Map from '../../components/Map';
import analytics from '@react-native-firebase/analytics';
import SaveToFavoritesModal from '../../components/SaveToFavoritesModal';

const categories = [
  'All',
  'Grooming',
  'Walking',
  'Boarding',
  'Training',
  'Veterinary',
  'Sitting',
];

const HomeScreen = ({ navigation }) => {

  const theme = useTheme();
  const {
    ads,
    user,
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

  const showMapModal = () => setIsMapModalVisible(true);
  const hideMapModal = () => setIsMapModalVisible(false);

  // State to control the visibility of the SaveToFavoritesModal
  const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState(false);

  // State to keep track of the selected ad ID when the favorite button is clicked
  const [selectedAdId, setSelectedAdId] = useState(null);

  // Change Map modal state for better readability
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);


  // Function to show the SaveToFavoritesModal
  // Takes the ad ID as an argument and sets it as the selected ad ID
  // Also sets the modal visibility state to true
  const showFavoritesModal = adId => {
    setSelectedAdId(adId);
    setIsFavoritesModalVisible(true);
  };

  // Function to hide the SaveToFavoritesModal
  // Resets the modal visibility state to false and clears the selected ad ID
  const hideFavoritesModal = () => {
    setIsFavoritesModalVisible(false);
    setSelectedAdId(null);
  };



  useEffect(() => {
    if (user) {
      const loadFavorites = async () => {
        await fetchUserFavorites();
        console.log(await analytics().logEvent('cool_event', { eventpayload: 12 }));
      };
      loadFavorites();
    }
  }, [user]);

  useEffect(() => {
    if (!adsFetched && !loadingAllAds) {
      fetchAllAds();
      setAdsFetched(true);
    }
  }, [adsFetched, loadingAllAds, fetchAllAds]);

  useEffect(() => {
    filterAds();
  }, [searchQuery, selectedCategory, ads, favorites]);

  const filterAds = () => {
    let filtered = ads;

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter((ad) => ad.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((ad) =>
        ad.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAds(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    console.log('Refreshing ads...');
    try {
      await fetchAllAds();
      await fetchUserFavorites();
      console.log('Ads and favorites refreshed successfully.');
    } catch (error) {
      console.error('Error refreshing ads:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderCategory = (category) => (
    <Chip
      key={category}
      onPress={() => setSelectedCategory(category)}
      selected={selectedCategory === category}
      style={[styles.categoryChip]}
    >
      {category}
    </Chip>
  );

  const shareAd = async (ad) => {
    try {
      const result = await Share.share({
        message: `Check out this ad: ${ad.title} - ${ad.description}\n\nPrice: ${ad.price}\n\nServices: ${ad.services.join(', ')}\n\nAddress: ${ad.address}\n\nMain Picture: ${ad.mainPicture}`,
        url: ad.mainPicture,
        title: 'Ad from PawPatrol',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with activity type: ${result.activityType}`);
        } else {
          console.log('Ad shared successfully');
        }
        await analytics().logEvent('ad_share', { ad_id: ad.id });
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing ad:', error);
    }
  };

  const handleFavorite = async (adId) => {
    await handleAddToFavorites(adId);
    await analytics().logEvent('ad_favorite', { ad_id: adId });
  };

  const renderItem = ({ item }) => (
    <Card
      style={styles.adContainer}
      onPress={() => navigation.navigate('AdDetails', { ad: item })}>
      <Card.Cover
        source={{ uri: item.mainPicture || 'https://picsum.photos/id/237/200/' }}
        style={styles.adImage}
      />
      <Card.Title
        title={item.title}
        subtitle={`Price: ${item.price}`}
        subtitleStyle={styles.adSubtitle}
        titleStyle={styles.adTitle}
      />
      <View style={styles.favoriteButton}>
        <Icon
          name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
          size={24}
          color="#ff0000"
          onPress={() => {
            showFavoritesModal(item.id)
          }}
        />
      </View>
      <View style={styles.shareButton}>
        <IconButton
          icon="share"
          color={theme.colors.primary}
          size={24}
          onPress={() => shareAd(item)}
        />
      </View>
    </Card >
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    categoryChip: {
      marginRight: 10,
    },
    categoriesScrollContainer: {
      flexDirection: 'row',
      marginVertical: 10,
    },
    adTouchableContainer: {
      flex: 1,
      maxWidth: '50%',
      padding: 5,
    },
    adContainer: {
      borderWidth: 1,
      borderColor: '#ddd',
      marginBottom: 10,
      position: 'relative',
      width: '46%',
      margin: '2%',
    },
    adImage: {
      height: 150,
      width: '100%',
      alignSelf: 'center',
    },
    adTitle: {
      fontWeight: 'bold',
      color: theme.colors.onPrimaryContainer,
      fontSize: 14,
    },
    favoriteButton: {
      position: 'absolute',
      bottom: 40,
      right: 6,
    },
    shareButton: {
      position: 'absolute',
      right: -8,
      bottom: -8
    },
    modalStyle: {
      backgroundColor: 'white',
      margin: 20,
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%',
      height: '66%',
      borderRadius: 10,
      zIndex: 1071,
    },
    modalContent: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1051,
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
    <SafeAreaProvider>
      <Portal>
        <Modal
          visible={isMapModalVisible}
          onDismiss={hideMapModal}
          contentContainerStyle={styles.modalStyle}
        >
          <View style={styles.modalContent}>
            <Map />
          </View>
        </Modal>
      </Portal>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button
            style={{ backgroundColor: 'transparent' }}
            onPress={showMapModal}
            icon="map-marker"
            labelStyle={{ color: theme.colors.onBackground }}
          >
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
          }}
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
          keyExtractor={(item) => item.id}
          numColumns={2}
          key={selectedCategory}
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
      {/* add SaveToFavoritesModal with the visible and onClose props.  */}
      <SaveToFavoritesModal
        visible={isFavoritesModalVisible}
        onClose={hideFavoritesModal}
        // Pass the selected ad ID
        adId={selectedAdId}
        onSave={() => {
          console.log('Ad added to list');
        }}
      />
    </SafeAreaProvider>
  );
};

export default HomeScreen;
