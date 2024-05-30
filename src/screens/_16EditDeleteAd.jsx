import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../utils/UserContext';

const EditDeleteAd = () => {
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
        mode="contained"
        title="Edit"
        onPress={() => navigation.navigate('Ad', { ad: item })}
      />
      <Button
        mode="contained"
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
    borderColor: 'rgb(0, 104, 123)',
    backgroundColor: 'rgb(0, 104, 123)',
    marginBottom: 10,
  },
  adTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'rgb(255, 155, 83)',
  },
});

export default EditDeleteAd;


// read document from firebase for firestore security rules
// https://firebase.google.com/docs/firestore/security/rules-structure