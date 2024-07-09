import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, Alert} from 'react-native';
import {useTheme, Card, Button} from 'react-native-paper';
import {useUser} from '../../utils/UserContext';
import {useSendbirdChat} from '@sendbird/uikit-react-native';

const AdDetails = ({navigation, route}) => {
  const theme = useTheme();
  const {
    user,
    fetchUserProfile,
    isProfileComplete,
    fetchChatUserProfile,
    createChat,
  } = useUser();
  const {ad} = route.params;
  const {sdk, currentUser} = useSendbirdChat();

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
            {cancelable: false},
          );
        }
      }
    };
    checkProfileCompletion();
  }, [user, fetchUserProfile, isProfileComplete, navigation]);

  const handleContactPress = async () => {
    if (!user || !ad.userId) {
      console.error('User or ad userId is missing.', {user, ad});
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
          {cancelable: false},
        );
        return;
      }

      const adUserProfile = await fetchChatUserProfile(ad.userId);
      if (!adUserProfile) {
        Alert.alert(
          'Error',
          'Could not fetch the ad user profile. Please try again later.',
          [{text: 'OK'}],
          {cancelable: false},
        );
        return;
      }

      console.log('Attempting to create chat with', {
        currentUserId: user.uid,
        otherUserId: ad.userId,
      });
      const channelUrl = await createChat(user.uid, ad.userId);
      if (channelUrl) {
        navigation.navigate('IndividualChat', {channelUrl});
      } else {
        Alert.alert(
          'Error',
          'Could not create the chat. Please try again later.',
          [{text: 'OK'}],
          {cancelable: false},
        );
      }
    } catch (err) {
      console.error('Error handling contact press: ', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.adContainer}>
        {ad.picture ? (
          <Card.Cover source={{uri: ad.picture}} style={styles.adImage} />
        ) : (
          <Image
            source={require('../../assets/images/OIP.jpeg')}
            style={styles.adImage}
          />
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
  adImage: {
    height: 200,
    width: '90%',
    alignSelf: 'center',
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
