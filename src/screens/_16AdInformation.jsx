import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../utils/UserContext';

const UserAdsScreen = () => {
  const { user, deleteAd } = useUser();
  const [ads, setAds] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsSnapshot = await firestore()
          .collection('ads')
          .doc(user.uid)
          .collection('userAds')
          .get();
        const adsList = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAds(adsList);
      } catch (error) {
        console.error('Error fetching ads: ', error);
      }
    };

    fetchAds();
  }, [user]);

  const handleDeleteAd = async (adId) => {
    Alert.alert(
      'Delete Ad',
      'Are you sure you want to delete this ad?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const adRef = firestore()
                .collection('ads')
                .doc(user.uid)
                .collection('userAds')
                .doc(adId);

              await adRef.delete();
              setAds(ads.filter(ad => ad.id !== adId));
              Alert.alert('Ad Deleted', 'Your ad has been deleted successfully.');
            } catch (error) {
              console.error('Error deleting ad: ', error);
              Alert.alert('Error', 'There was an error deleting the ad.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.adContainer}>
      <Text style={styles.adTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Button
        title="Edit"
        onPress={() => navigation.navigate('Ad', { ad: item })}
      />
      <Button
        title="Delete"
        onPress={() => handleDeleteAd(item.id)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={ads}
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
  },
  adContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default UserAdsScreen;
