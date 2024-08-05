import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useUser } from '../../utils/UserContext';
import { useTheme, Card, Text, IconButton } from 'react-native-paper';

const EditDeleteAd = ({ navigation }) => {
  const theme = useTheme();
  const { user, ads, fetchUserAds, deleteAd, loadingUserAds, setCurrentAd } = useUser();

  useEffect(() => {
    if (user) {
      fetchUserAds();
    }
  }, [user]);

  const handleDeleteAd = async adId => {
    Alert.alert('Delete Ad', 'Are you sure you want to delete this ad?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteAd(adId),
      },
    ]);
  };

  const handleEditAd = ad => {
    setCurrentAd(ad); // Set the current ad in the context
    navigation.navigate('Ad'); // Navigate to the Ad screen
  };

  const renderItem = ({ item }) => (
    <Card style={styles.adContainer}
      onPress={() => navigation.navigate('AdDetails', { ad: item })}
    >
      <Card.Cover source={{ uri: item.mainPicture || 'https://picsum.photos/id/237/200/' }} style={styles.adImage} />
      <Card.Title
        title={item.title}
        subtitle={`Price: ${item.price}`}
        subtitleStyle={styles.adSubtitle}
        titleStyle={styles.adTitle}
      />
      <View style={styles.buttonsContainer}>
        <IconButton
          icon="square-edit-outline"
          iconColor='#009B7D'
          mode="contained"
          onPress={() => handleEditAd(item)} />
        <IconButton
          icon="trash-can-outline"
          iconColor='#ff0000'
          mode="contained"
          onPress={() => handleDeleteAd(item.id)} />
      </View>
    </Card>
  );




  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      marginBottom: 12,
      backgroundColor: 'white',
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
      height: 200,
      width: '100%',
    },
    adTitle: {
      fontWeight: 'bold',
    },
    adSubtitle: {
      fontSize: 14,
      color: '#666',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    editButton: {
      padding: 5,
      margin: 10,
    },
    deleteButton: {
      padding: 5,
      margin: 10,
    },
    flatListContent: {
      justifyContent: 'center',
    },
  });

  if (loadingUserAds) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant='headlineMedium'>My Ads</Text>
      <FlatList
        data={ads}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={<Text>No ads found.</Text>}
      />
    </View>
  );
};

export default EditDeleteAd;
