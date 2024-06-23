import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, Alert} from 'react-native';
import {useTheme, Card, Button} from 'react-native-paper';
import {useUser} from '../../utils/UserContext';

const AdDetails = ({navigation, route}) => {
  const theme = useTheme();
  const {user, createChat, fetchUserProfile, isProfileComplete} = useUser();
  const {ad} = route.params;

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

      const adUserProfile = await fetchUserProfile(ad.userId);
      if (!isProfileComplete(adUserProfile)) {
        Alert.alert(
          'Seller Profile Incomplete',
          'The seller has an incomplete profile. Contacting them is not allowed at the moment.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home'),
            },
          ],
          {cancelable: false},
        );
        return;
      }

      const chatId = await createChat(user.uid, ad.userId);
      if (chatId) {
        navigation.navigate('IndividualChat', {chatId});
      } else {
        console.error('Error creating or fetching chat.');
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
