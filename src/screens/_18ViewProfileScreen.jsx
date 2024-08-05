import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Avatar, Card, Button, Icon, Text, Divider, SegmentedButtons, useTheme } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../utils/UserContext';

const ViewProfileScreen = () => {
  const theme = useTheme()
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useUser();
  const [selectedSegment, setSelectedSegment] = useState('user');
  const { profile } = route.params;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    // Function implementation remains the same
  };

  const renderButton = () => {
    if (user) {
      return (
        <Button
          mode="contained"
          onPress={handleContactPress}
        >
          Contact
        </Button>
      );
    }
  };

  const renderUserInfo = () => (
    <View style={styles.section}>
      <Text>Age: {profile.age}</Text>
      <Text>Occupation: {profile.occupation}</Text>
      <Text>Bio: {profile.bio}</Text>
      <Divider style={styles.divider} />
      <Text>{profile.firstName}'s Listings</Text>
      {renderAds()}
    </View>
  );

  const renderPetInfo = () => (
    <View style={styles.section}>
      {profile.pets && profile.pets.map((pet, index) => (
        <View key={index}>
          <Text>Name: {pet.name}</Text>
          <Text>Species: {pet.species}</Text>
          <Text>Breed: {pet.breed}</Text>
          <Text>Age: {pet.age}</Text>
          <Text>Gender: {pet.gender}</Text>
        </View>
      ))}
    </View>
  );

  const renderOtherInfo = () => (
    <View style={styles.section}>
      <Text>Favorite Hobby: {profile.otherInfo.favoriteHobby}</Text>
      <Text>Favorite Food: {profile.otherInfo.favoriteFood}</Text>
    </View>
  );


  const renderAds = () => (
    <FlatList
      data={listings}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.flatListContent}
      ListEmptyComponent={<Text>No ads found.</Text>}
    />
  );

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
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.headerContainer}>
          <View style={styles.renderButtonContainer}>
            {renderButton()}
          </View>
          {profile.profilePicture ? (
            <Image source={{ uri: profile.profilePicture }} style={styles.profilePicture} />
          ) : (
            <Avatar.Icon size={60} icon="account" style={styles.profilePicture} />
          )}
          <Text style={styles.username}>{profile.firstName} {profile.lastName}</Text>
          <Text >5.0 <Icon source='star' color='gold' size={20} /></Text>
          <Text style={{ fontSize: 16 }}>
            {profile.address && profile.address.city ? (
              <><Icon source='map-marker' color='rgb(0, 104, 123)' size={20} />{profile.address.city}</>
            ) : null}
          </Text>
          <Divider style={styles.divider} />
        </View>
        <SegmentedButtons
          value={selectedSegment}
          onValueChange={setSelectedSegment}
          buttons={[
            { value: 'user', label: `About ${profile.firstName}` },
            { value: 'pets', label: `${profile.firstName}'s Pets` },
            { value: 'other', label: 'Other Info' },
          ]}
        />
        {selectedSegment === 'user' && renderUserInfo()}
        {selectedSegment === 'pets' && renderPetInfo()}
        {selectedSegment === 'other' && renderOtherInfo()}
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 20,
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
  renderButtonContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  sectionContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  divider: {
    width: '100%',
    marginVertical: 8,
  },
});

export default ViewProfileScreen;
