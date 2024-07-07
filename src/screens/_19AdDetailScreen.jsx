import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useTheme, Card, Button } from 'react-native-paper';
import { useUser } from '../../utils/UserContext';
import { useSendbirdChat } from '@sendbird/uikit-react-native';

const AdDetails = ({ navigation, route }) => {
  const theme = useTheme();
  const { user, fetchUserProfile, isProfileComplete, fetchChatUserProfile, createChat } = useUser();
  const { ad } = route.params;
  const { sdk, currentUser } = useSendbirdChat();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          <Button mode="contained" onPress={handleContactPress}>
            Contact
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
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
});

export default AdDetails;
