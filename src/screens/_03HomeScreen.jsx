import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, Image, Share } from 'react-native';
import { useUser } from '../../utils/UserContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { Searchbar, useTheme, Chip, Button, Card, Text, Modal, Portal, IconButton } from 'react-native-paper';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Map from '../../components/Map';
import SaveToFavoritesModal from '../../components/SaveToFavoritesModal';
import analytics from '@react-native-firebase/analytics';

const categories = ['All', 'Grooming', 'Walking', 'Boarding', 'Training', 'Veterinary', 'Sitting'];

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();  // Use the useTheme hook here
  const { ads, user, favorites, handleAddToFavorites, fetchAllAds, loadingAllAds, loadingFavorites, fetchUserFavorites, loading } = useUser();
  const [filteredAds, setFilteredAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [adsFetched, setAdsFetched] = useState(false);

  const [isFavoritesModalVisible, setIsFavoritesModalVisible] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);

  const showMapModal = () => setIsMapModalVisible(true);
  const hideMapModal = () => setIsMapModalVisible(false);

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
      filtered = filtered.filter(ad => ad.category === selectedCategory);
    }

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(ad => ad.title.toLowerCase().includes(searchQuery.toLowerCase()));
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

  const renderCategory = category => (
    <Chip key={category} onPress={() => setSelectedCategory(category)} selected={selectedCategory === category} style={[styles.categoryChip]}>
      {category}
    </Chip>
  );

  const shareAd = async ad => {
    try {
      const result = await Share.share({
        message: `Check out this ad: ${ad.title} - ${ad.description}\n\nPrice: ${ad.price}\n\nServices: ${ad.services.join(', ')}\n\nAddress: ${ad.address}\n\n To view more details, download the PawPatrol app now!`,
        url: ad.mainPicture,
        title: 'Ad from PawPatrol',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with activity type: ${result.activityType}`);
        } else {
          console.log('Ad shared successfully');
        }
        await analytics().logEvent('ad_share', {
          ad_id: ad.id,
          user_id: user.uid,
        });
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing ad:', error);
    }
  };

  const handleFavorite = async adId => {
    await handleAddToFavorites(adId);
    await analytics().logEvent('ad_favourite', {
      ad_id: adId,
      user_id: user.uid,
    });
  };

  const renderItem = ({ item }) => (
    <Card
      style={styles.adContainer}
      onPress={async () => {
        try {
          await analytics().logEvent('ad_tap', {
            ad_id: item.id,
            user_id: user.uid,
          });
          console.log('Navigating to AdDetails with item:', item);
          navigation.navigate('AdDetails', { ad: item });
        } catch (error) {
          console.error('Error navigating to AdDetails:', error);
        }
      }}>
      <Card.Cover source={{ uri: item.mainPicture || 'https://picsum.photos/id/237/200/' }} style={styles.adImage} />
      <Card.Title title={item.title} subtitle={`Price: ${item.price}`} subtitleStyle={styles.adSubtitle} titleStyle={styles.adTitle} />
      <View style={styles.favoriteButton}>
        <Icon name={favorites.includes(item.id) ? 'heart' : 'heart-outline'} size={24} color="#ff0000" onPress={() => {
          showFavoritesModal(item.id);
          handleFavorite(item.id);
        }} />
      </View>
      <View style={styles.shareButton}>
        <IconButton icon="share" color={theme.colors.primary} size={24} onPress={() => shareAd(item)} />
      </View>
    </Card>
  );

  return (
    <SafeAreaProvider>
      <Portal>
        <Modal visible={isMapModalVisible} onDismiss={hideMapModal} contentContainerStyle={styles.modalStyle}>
          <View style={styles.modalContent}>
            <Map />
          </View>
        </Modal>
      </Portal>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button style={{ backgroundColor: 'transparent' }} onPress={showMapModal} icon="map-marker" labelStyle={{ color: theme.colors.onBackground }}>
            Location
          </Button>
        </View>
        <Searchbar
          style={{ backgroundColor: theme.colors.elevation.level5, borderWidth: 1, borderColor: theme.colors.outline }}
          placeholder="Search for services"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
          numColumns={2}
          key={selectedCategory}
          ListEmptyComponent={<Text>No ads found.</Text>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
        />
      </View>
      <SaveToFavoritesModal visible={isFavoritesModalVisible} onClose={hideFavoritesModal} adId={selectedAdId} onSave={() => {
        console.log('Ad added to list');
      }} />
    </SafeAreaProvider>
  );
};

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
    color: '#000', // Use a default color instead of theme.colors
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

export default HomeScreen;
