import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { useTheme, Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const AdminAdDetails = ({ route }) => {
  const theme = useTheme();
  const { ad } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
          </Card>
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
