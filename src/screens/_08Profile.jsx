import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import {
  TextInput,
  Button,
  Avatar,
  SegmentedButtons,
  useTheme,
} from 'react-native-paper';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useUser } from '../../utils/UserContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const Profile = ({ navigation }) => {
  const theme = useTheme();
  const { user, createOrUpdateProfile, fetchUserProfile, uploadImage } =
    useUser();
  const [selectedSegment, setSelectedSegment] = useState('user');
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);
  const [profileData, setProfileData] = useState({
    email: user.email,
    firstName: '',
    lastName: '',
    age: '',
    phoneNo: '',
    address: '',
    occupation: '',
    bio: '',
    profilePicture: '',
    pets: [
      {
        name: '',
        species: '',
        breed: '',
        age: '',
        gender: ''
      },
    ],
    otherInfo: {
      favoriteHobby: '',
      favoriteFood: '',
    },
  });

  useEffect(() => {
    const getData = async () => {
      if (user) {
        try {
          const userProfile = await fetchUserProfile();
          setProfileData(userProfile || profileData);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    };
    getData();
  }, [user]);

  const handleSaveProfile = async () => {
    await createOrUpdateProfile(profileData);
  };

  const handleSelectImage = () => {
    launchImageLibrary({}, async response => {
      if (
        !response.didCancel &&
        !response.error &&
        response.assets &&
        response.assets.length > 0
      ) {
        const imageUri = response.assets[0].uri;
        console.log('Selected Image URI:', imageUri);
        try {
          const downloadUrl = await uploadImage(imageUri);
          console.log('Download URL:', downloadUrl);
          setProfileData(prevState => ({
            ...prevState,
            profilePicture: downloadUrl,
          }));
          await createOrUpdateProfile({
            ...profileData,
            profilePicture: downloadUrl,
          });
          Alert.alert('Profile Picture Updated Successfully');
        } catch (err) {
          console.error('Error uploading profile picture:', err);
          Alert.alert('Error', 'Failed to upload profile picture');
        }
      }
    });
  };

  const handlePetChange = (index, field, value) => {
    const updatedPets = [...profileData.pets];
    updatedPets[index][field] = value;
    setProfileData({ ...profileData, pets: updatedPets });
  };

  const renderUserInfo = () => (
    <View style={styles.section}>
      <View style={styles.avatarContainer}>
        {profileData.profilePicture ? (
          <Avatar.Image
            size={100}
            source={{ uri: profileData.profilePicture }}
            style={styles.profilePicture}
          />
        ) : (
          <Avatar.Icon
            size={100}
            icon="account"
            style={styles.profilePicture}
          />
        )}
      </View>
      <Button
        mode="contained"
        onPress={handleSelectImage}
        style={styles.button}>
        Select Profile Picture
      </Button>
      <TextInput
        label="Email"
        value={user.email}
        disabled={true}
        style={styles.input}
      />
      <TextInput
        label="First Name"
        value={profileData.firstName}
        onChangeText={text => setProfileData({ ...profileData, firstName: text })}
        style={styles.input}
      />
      <TextInput
        label="Last Name"
        value={profileData.lastName}
        onChangeText={text => setProfileData({ ...profileData, lastName: text })}
        style={styles.input}
      />
      <TextInput
        label="Age"
        value={profileData.age}
        onChangeText={text => setProfileData({ ...profileData, age: text })}
        style={styles.input}
      />
      <TextInput
        label="Address"
        value={profileData.address}
        onChangeText={text => setProfileData({ ...profileData, address: text })}
        style={styles.input}
      />
      <TextInput
        label="Occupation"
        value={profileData.occupation}
        onChangeText={text => setProfileData({ ...profileData, occupation: text })}
        style={styles.input}
      />
      <TextInput
        label="Bio"
        value={profileData.bio}
        onChangeText={text => setProfileData({ ...profileData, bio: text })}
        style={styles.input}
      />
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => {
          handleSaveProfile();
          navigation.navigate('Home');
        }}>
        Save Profile
      </Button>
    </View>
  );

  const renderPetInfo = () => (
    <View style={styles.section}>
      {profileData.pets.map((pet, index) => (
        <View key={index} style={styles.petContainer}>
          <TextInput
            label="Pet Name"
            value={pet.name}
            onChangeText={text => handlePetChange(index, 'name', text)}
            style={styles.input}
          />
          <TextInput
            label="Pet Type"
            value={pet.species}
            onChangeText={text => handlePetChange(index, 'species', text)}
            style={styles.input}
          />
          <TextInput
            label="Pet Breed"
            value={pet.breed}
            onChangeText={text => handlePetChange(index, 'breed', text)}
            style={styles.input}
          />
          <TextInput
            label="Pet Age"
            value={pet.age}
            onChangeText={text => handlePetChange(index, 'age', text)}
            style={styles.input}
          />
          <TextInput
            label="Pet Gender"
            value={pet.gender}
            onChangeText={text => handlePetChange(index, 'gender', text)}
            style={styles.input}
          />
        </View>
      ))}
      <Button
        mode="contained"
        onPress={() =>
          setProfileData({
            ...profileData,
            pets: [...profileData.pets, { name: '', type: '', age: '' }],
          })
        }
        style={styles.button}>
        Add Another Pet
      </Button>
      <Button
        mode="contained"
        onPress={handleSaveProfile}
        style={styles.button}>
        Save Pet Info
      </Button>
    </View>
  );

  const renderOtherInfo = () => (
    <View style={styles.section}>
      <TextInput
        label="Favorite Hobby"
        value={profileData.otherInfo.favoriteHobby}
        onChangeText={text =>
          setProfileData({
            ...profileData,
            otherInfo: { ...profileData.otherInfo, favoriteHobby: text },
          })
        }
        style={styles.input}
      />
      <TextInput
        label="Favorite Food"
        value={profileData.otherInfo.favoriteFood}
        onChangeText={text =>
          setProfileData({
            ...profileData,
            otherInfo: { ...profileData.otherInfo, favoriteFood: text },
          })
        }
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSaveProfile}
        style={styles.button}>
        Save Other Info
      </Button>
    </View>
  );

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <SegmentedButtons
          value={selectedSegment}
          onValueChange={setSelectedSegment}
          buttons={[
            { value: 'user', label: 'User Info' },
            { value: 'pets', label: 'Pets' },
            { value: 'other', label: 'Other' },
          ]}
        />
        {selectedSegment === 'user' && renderUserInfo()}
        {selectedSegment === 'pets' && renderPetInfo()}
        {selectedSegment === 'other' && renderOtherInfo()}
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginVertical: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  button: {
    marginBottom: 20,
    marginTop: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 0,
  },
});

export default Profile;
