import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Avatar, Card, Button, Icon } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../utils/UserContext';

const ViewProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, fetchUserProfile, isProfileComplete, fetchChatUserProfile, createChat } = useUser();
  const { profile } = route.params;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    {/*ChatGPT: How to fetch ads with the same collection id as the profile? */ }
    const fetchUserListings = async () => {
      try {
        const userAdsRef = firestore()
          .collection('ads')
          .doc(profile.uid)
          .collection('userAds');
        const querySnapshot = await userAdsRef.get();
        const listingsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setListings(listingsArray);
      } catch (error) {
        console.error('Error fetching user listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, [profile.uid]);

  const handleContactPress = async () => {
    if (!user || !ad.userId) {
      console.error('User or ad userId is missing.', { user, ad });
      return;
    }
    try {
      const profileData = await fetchUserProfile();
      if (!isProfileComplete(profileData)) {
        Alert.alert(
          'Profile Incomplete',
          'Please complete your profile before contacting the seller.',
          [
            {
              text: 'Go to Profile',
              onPress: () => navigation.navigate('Profile'),
            },
          ],
          { cancelable: false },
        );
        return;
      }

      const adUserProfile = await fetchChatUserProfile(ad.userId);
      if (!adUserProfile) {
        Alert.alert(
          'Error',
          'Could not fetch the ad user profile. Please try again later.',
          [{ text: 'OK' }],
          { cancelable: false },
        );
        return;
      }

      console.log('Attempting to create chat with', {
        currentUserId: user.uid,
        otherUserId: ad.userId,
      });
      const channelUrl = await createChat(user.uid, ad.userId);
      if (channelUrl) {
        navigation.navigate('IndividualChat', { channelUrl });
      } else {
        Alert.alert(
          'Error',
          'Could not create the chat. Please try again later.',
          [{ text: 'OK' }],
          { cancelable: false },
        );
      }
    } catch (err) {
      console.error('Error handling contact press: ', err);
    }
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
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleContactPress}>
            Contact
          </Button>
        </View>
        <View style={styles.headerContainer}>
          {profile.profilePicture ? (
            <Image source={{ uri: profile.profilePicture }} style={styles.profilePicture} />
          ) : (
            <Avatar.Icon size={60} icon="account" style={styles.profilePicture} />
          )}
          <Text style={styles.username}>{profile.firstName} {profile.lastName}</Text>
          <Text>5.0<Icon source='star' color='gold' size={20}/> </Text>
        </View>
        <FlatList
          data={listings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={<Text>No ads found.</Text>}
        />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  flatListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  adContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    position: 'relative',
    backgroundColor: '#fff',
    width: '46%',
    margin: '2%',
  },
  adImage: {
    height: 150,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  adSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    position: 'absolute',
    paddingLeft: 50,
    paddingRight: 50,
    marginTop: 8,
    top: 8,
    right: -42
  },
});

export default ViewProfileScreen;
