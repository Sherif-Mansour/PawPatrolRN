import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Alert, FlatList } from 'react-native';
import { useTheme, Card, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const AdminAdDetails = ({ navigation, route }) => {
  const theme = useTheme();
  const { ad } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
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
            const userDoc = await firestore().collection('profiles').doc(reviewData.userId).get();
            const userProfile = userDoc.data();
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
  }, [ad.id]);

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
        userId: 'admin', // Placeholder user ID for admin
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
      fetchReviews(); // Refresh reviews list
    } catch (error) {
      console.error('Error saving review:', error);
      Alert.alert('Error', 'There was an error saving the review.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await firestore()
        .collection('RatingReviews')
        .doc(ad.id)
        .collection('ratingsReviews')
        .doc(reviewId)
        .delete();
      setReviews(reviews.filter(review => review.id !== reviewId));
      Alert.alert('Success', 'Review deleted successfully.');
    } catch (error) {
      console.error('Error deleting review:', error);
      Alert.alert('Error', 'There was an error deleting the review.');
    }
  };

  const handleDeleteAd = async () => {
    Alert.alert('Delete Ad', 'Are you sure you want to delete this ad?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Assuming the 'userAds' collection is nested within a user document
            const userDoc = await firestore().collection('profiles').doc(ad.userId).get();
            if (userDoc.exists) {
              await firestore()
                .collection('profiles')
                .doc(ad.userId)
                .collection('userAds')
                .doc(ad.id)
                .delete();
              Alert.alert('Success', 'Ad deleted successfully.');
              navigation.goBack();
            } else {
              Alert.alert('Error', 'User not found.');
            }
          } catch (error) {
            console.error('Error deleting ad:', error);
            Alert.alert('Error', 'There was an error deleting the ad.');
          }
        },
      },
    ]);
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
        <Button onPress={() => handleDeleteReview(item.id)}>Delete Review</Button>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
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
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => setModalVisible(true)} style={{ marginLeft: 10 }}>
                Add Review
              </Button>
              <Button mode="contained" onPress={handleDeleteAd} style={{ marginLeft: 10, backgroundColor: 'red' }}>
                Delete Ad
              </Button>
            </Card.Actions>
          </Card>
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
    backgroundColor: 'white',
  },
  adContainer: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
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
});

export default AdminAdDetails;
