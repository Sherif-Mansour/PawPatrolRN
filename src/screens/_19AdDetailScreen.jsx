import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Alert, FlatList } from 'react-native';
import { useTheme, Card, Button, Divider, Avatar, Text } from 'react-native-paper';
import { useUser } from '../../utils/UserContext';
import { useSendbirdChat } from '@sendbird/uikit-react-native';
import firestore from '@react-native-firebase/firestore';
import analytics from '@react-native-firebase/analytics';

const AdDetails = ({ navigation, route }) => {
  const theme = useTheme();
  const { user, fetchUserProfile, isProfileComplete, fetchChatUserProfile, createChat } = useUser();
  const { ad } = route.params;
  const { sdk, currentUser } = useSendbirdChat();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState('');
  const [reviews, setReviews] = useState([]);
  const [adUserProfile, setAdUserProfile] = useState(null);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (user) {
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
        }
      }
    };
    checkProfileCompletion();
  }, [user, fetchUserProfile, isProfileComplete, navigation]);

  useEffect(() => {
    const fetchAdUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile(ad.userId);
        setAdUserProfile(userProfile);
      } catch (error) {
        console.error('Error fetching ad user profile:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewsSnapshot = await firestore()
          .collection('RatingReviews')
          .doc(ad.id)
          .collection('ratingsReviews')
          .get();

        const fetchedReviews = await Promise.all(
          reviewsSnapshot.docs.map(async doc => {
            const reviewData = doc.data();
            const userProfile = await fetchUserProfile(reviewData.userId);
            return {
              id: doc.id,
              ...reviewData,
              userProfile,
            };
          })
        );

        fetchAdUserProfile();
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [ad.id, ad.userId, fetchUserProfile]);

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
        await analytics().logEvent('ad_contact', { ad_id: ad.id });
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

  const handleNextImage = () => {
    if (currentImageIndex < ad.pictures.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleSaveReview = async () => {
    if (!review || !rating) {
      Alert.alert('Error', 'Please enter a review and rating.');
      return;
    }

    try {
      const reviewData = {
        userId: user.uid,
        review,
        rating: parseInt(rating, 10),
        date: new Date().toISOString(),
      };

      await firestore()
        .collection('RatingReviews')
        .doc(ad.id)
        .collection('ratingsReviews')
        .add(reviewData);

      setReview('');
      setRating('');
      setModalVisible(false);
      Alert.alert('Success', 'Review added successfully.');
      // Fetch reviews again to update the list
      const fetchReviews = async () => {
        try {
          const reviewsSnapshot = await firestore()
            .collection('RatingReviews')
            .doc(ad.id)
            .collection('ratingsReviews')
            .get();

          const fetchedReviews = await Promise.all(
            reviewsSnapshot.docs.map(async doc => {
              const reviewData = doc.data();
              const userProfile = await fetchUserProfile(reviewData.userId);
              return {
                id: doc.id,
                ...reviewData,
                userProfile,
              };
            })
          );

          setReviews(fetchedReviews);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };
      fetchReviews();
    } catch (error) {
      console.error('Error saving review:', error);
      Alert.alert('Error', 'There was an error saving the review.');
    }
  };

  const renderReview = ({ item }) => (
    <Card style={styles.reviewCard}>
      <Card.Content>
        <View style={styles.reviewHeader}>
          <Image source={{ uri: item.userProfile?.profilePicture }} style={styles.profilePicture} />
          <Text style={styles.username}>{item.userProfile?.firstName} {item.userProfile?.lastName}</Text>
        </View>
        <Text style={styles.reviewText}>Rating: {item.rating}</Text>
        <Text style={styles.reviewText}>{item.review}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <Card style={styles.adContainer}>
            {ad.pictures && ad.pictures.length > 0 && (
              <View style={styles.imageContainer}>
                <TouchableOpacity onPress={handlePreviousImage} disabled={currentImageIndex === 0} style={styles.navigationButton}>
                  <Text style={styles.navigationButtonText}>{'<'}</Text>
                </TouchableOpacity>
                <Image source={{ uri: ad.pictures[currentImageIndex] }} style={styles.adImage} />
                <TouchableOpacity onPress={handleNextImage} disabled={currentImageIndex === ad.pictures.length - 1} style={styles.navigationButton}>
                  <Text style={styles.navigationButtonText}>{'>'}</Text>
                </TouchableOpacity>
              </View>
            )}
            <Card.Title
              titleStyle={styles.adTitle}
              title={ad.title}
              subtitle={`Category: ${ad.category}`}
              subtitleStyle={styles.adTitle}
            />
            <Card.Content>
              <Text style={styles.adContent}>{ad.description}</Text>
              <Text style={styles.adContent}>Address: {ad.address}</Text>
              <Text style={styles.adContent}>
                Services: {ad.services.join(', ')}
              </Text>
              {/* ChatGPT: How do I retrieve the information of the user that posted the ad to be displayed in the ad detail screen? */}
              {adUserProfile && (
                <View style={styles.userInfo}>
                  {adUserProfile.profilePicture ? (
                    <Image source={{ uri: adUserProfile.profilePicture }} style={styles.profilePicture} />
                  ) : (
                    <Avatar.Icon size={60} icon="account" style={styles.profilePicture} />
                  )}
                  <Text style={styles.username}>{adUserProfile.firstName} {adUserProfile.lastName}</Text>
                  <View style={styles.viewProfButtonContainer}>
                    <Button
                      mode='outlined'
                      compact={true}
                      onPress={() => navigation.navigate('View Profile', { profile: adUserProfile })}
                      labelStyle={{ color: theme.colors.onBackground }}
                    >
                      View Profile
                    </Button>
                  </View>
                </View>
              )}
            </Card.Content>
          </Card>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonGroup}>
              <Button mode="contained" onPress={handleContactPress}>
                Contact
              </Button>
              <Button mode="contained" onPress={() => setModalVisible(true)} style={{ marginLeft: 10 }} buttonColor='#FFBF5D'>
                Add Review
              </Button>
            </View>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Add Review</Text>
              <TextInput
                style={styles.input}
                placeholder="Review"
                value={review}
                onChangeText={setReview}
              />
              <TextInput
                style={styles.input}
                placeholder="Rating (1-5)"
                value={rating}
                onChangeText={setRating}
                keyboardType="numeric"
              />
              <Button onPress={handleSaveReview}>Save Review</Button>
              <Button onPress={() => setModalVisible(false)}>Cancel</Button>
            </View>
          </Modal>
        </View>
      }
      data={reviews}
      renderItem={renderReview}
      keyExtractor={item => item.id}
      ListEmptyComponent={<Text style={styles.noReviewsText}>No reviews available.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  adContainer: {
    borderWidth: 1,
    paddingTop: 5,
    marginBottom: 10,
    position: 'relative',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  adImage: {
    height: 300,
    width: 300,
    borderRadius: 10,
  },
  navigationButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationButtonText: {
    fontSize: 24,
    color: 'black',
  },
  adTitle: {
    fontWeight: 'bold',
    color: 'black',
  },
  adContent: {
    color: 'black',
    marginBottom: 10,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  reviewCard: {
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 16,
  },
  noReviewsText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 40,
    marginRight: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    paddingLeft: 50,
    paddingRight: 50,
    marginTop: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  viewProfButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default AdDetails;
