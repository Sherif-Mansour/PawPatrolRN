import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Avatar,
  SegmentedButtons,
  useTheme,
  Divider
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
    uid: user.uid,
    email: user.email,
    firstName: '',
    lastName: '',
    age: '',
    phoneNo: '',
    address: {
      street: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
    },
    occupation: '',
    bio: '',
    profilePicture: '',
    pets: [
      {
        name: '',
        species: '',
        breed: '',
        age: '',
        gender: '',
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
          if (userProfile) {
            if (!userProfile.pets) {
              userProfile.pets = [
                {
                  name: '',
                  species: '',
                  breed: '',
                  age: '',
                  gender: '',
                },
              ];
            }
            if (!userProfile.otherInfo) {
              userProfile.otherInfo = {
                favoriteHobby: '',
                favoriteFood: '',
              };
            }
            if (!userProfile.address) {
              userProfile.address = {
                street: '',
                city: '',
                province: '',
                postalCode: '',
                country: '',
              };
            }
            console.log('Fetched user profile:', userProfile);
            setProfileData(userProfile);
          } else {
            console.log('No user profile found, using default profile data');
            setProfileData({
              uid: user.uid,
              email: user.email,
              firstName: '',
              lastName: '',
              age: '',
              phoneNo: '',
              address: {
                street: '',
                city: '',
                province: '',
                postalCode: '',
                country: '',
              },
              occupation: '',
              bio: '',
              profilePicture: '',
              pets: [
                {
                  name: '',
                  species: '',
                  breed: '',
                  age: '',
                  gender: '',
                },
              ],
              otherInfo: {
                favoriteHobby: '',
                favoriteFood: '',
              },
            });
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    };
    getData();
  }, [user]);

  const handleSaveProfile = async () => {
    const profileWithUID = { ...profileData, uid: user.uid };
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
          <Avatar.Icon size={100} icon="account" style={styles.profilePicture} />
        )}
      </View>
      <Button
        mode="contained"
        onPress={handleSelectImage}
        style={styles.button}
      >
        Select Profile Picture
      </Button>

      {/* Email and Phone Number stacked */}
      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          value={profileData.email}
          onChangeText={(text) =>
            setProfileData({ ...profileData, email: text })
          }
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Phone Number"
          value={profileData.phoneNo}
          onChangeText={(text) =>
            setProfileData({ ...profileData, phoneNo: text })
          }
          style={styles.input}
        />
      </View>
      <Divider style={styles.divider} />
      {/* First Name and Last Name in a row */}
      <View style={styles.inputContainer}>
        <TextInput
          label="First Name"
          value={profileData.firstName}
          onChangeText={(text) =>
            setProfileData({ ...profileData, firstName: text })
          }
          style={[styles.input, { flex: 1, marginRight: 8 }]}
        />
        <TextInput
          label="Last Name"
          value={profileData.lastName}
          onChangeText={(text) =>
            setProfileData({ ...profileData, lastName: text })
          }
          style={[styles.input, { flex: 1, marginLeft: 8 }]}
        />
      </View>
      <Divider style={styles.divider} />
      {/* Address Inputs */}
      <TextInput
        label="Street"
        value={profileData.address.street}
        onChangeText={(text) =>
          setProfileData({
            ...profileData,
            address: { ...profileData.address, street: text },
          })
        }
        style={styles.input}
      />
      <View style={styles.inputContainer}>
        <TextInput
          label="City"
          value={profileData.address.city}
          onChangeText={(text) =>
            setProfileData({
              ...profileData,
              address: { ...profileData.address, city: text },
            })
          }
          style={[styles.input, { flex: 1, marginRight: 8 }]}
        />
        <TextInput
          label="Province"
          value={profileData.address.province}
          onChangeText={(text) =>
            setProfileData({
              ...profileData,
              address: { ...profileData.address, province: text },
            })
          }
          style={[styles.input, { flex: 1, marginLeft: 8 }]}
        />
      </View>
      <TextInput
        label="Country"
        value={profileData.address.country}
        onChangeText={(text) =>
          setProfileData({
            ...profileData,
            address: { ...profileData.address, country: text },
          })
        }
        style={styles.input}
      />
      <TextInput
        label="Postal Code"
        value={profileData.address.postalCode}
        onChangeText={(text) =>
          setProfileData({
            ...profileData,
            address: { ...profileData.address, postalCode: text },
          })
        }
        style={styles.input}
      />
      <Divider style={styles.divider} />

      <TextInput
        label="Age"
        value={profileData.age}
        onChangeText={(text) => setProfileData({ ...profileData, age: text })}
        style={styles.input}
      />
      <TextInput
        label="Occupation"
        value={profileData.occupation}
        onChangeText={(text) =>
          setProfileData({ ...profileData, occupation: text })
        }
        style={styles.input}
      />
      <TextInput
        label="Bio"
        value={profileData.bio}
        onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
        style={styles.input}
        multiline={true}
        numberOfLines={10}
      />
      <Divider style={styles.divider} />
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => {
          handleSaveProfile();
          navigation.navigate('Home');
        }}
      >
        Save Profile
      </Button>
    </View>
  );

  const renderPetInfo = () => (
    <View style={styles.section}>
      {(profileData.pets || []).map((pet, index) => (
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
            pets: [
              ...profileData.pets,
              { name: '', species: '', breed: '', age: '', gender: '' },
            ],
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
        value={profileData.otherInfo?.favoriteHobby || ''}
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
        value={profileData.otherInfo?.favoriteFood || ''}
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
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <SegmentedButtons
          value={selectedSegment}
          onValueChange={setSelectedSegment}
          buttons={[
            { value: 'user', label: 'About Me' },
            { value: 'pets', label: 'My Pets' },
            { value: 'other', label: 'Other Info' },
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
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: '100%',
    marginBottom: 8
  },
  divider: {
    width: '100%',
    marginVertical: 8,
  },
});


export default Profile;
