import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useUser} from '../../utils/UserContext';
import {Card, Text, Button, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const FavoritesScreen = ({navigation}) => {
  const theme = useTheme();
  const {
    favorites,
    ads,
    handleAddToFavorites,
    loadingAllAds,
    fetchUserFavorites,
    loadingFavorites,
  } = useUser();
  const [favoriteAds, setFavoriteAds] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      await fetchUserFavorites();
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    if (ads.length > 0) {
      const favAds = ads.filter(ad => favorites.includes(ad.id));
      setFavoriteAds(favAds);
    }
  }, [favorites, ads]);

  const renderAd = ({item}) => (
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
    headerText: {
      fontSize: 32,
      color: 'black',
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
    noFavoritesText: {
      textAlign: 'center',
      marginTop: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (loadingAllAds || loadingFavorites) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Favorites</Text>
      </View>
      {favoriteAds.length > 0 ? (
        <FlatList
          data={favoriteAds}
          renderItem={renderAd}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noFavoritesText}>No favorites added yet.</Text>
      )}
    </View>
  );
};

export default FavoritesScreen;
