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

const Profile = ({ navigation }) => {
  const theme = useTheme();
  const { user, createOrUpdateProfile, fetchUserProfile, uploadProfilePicture } =
    useUser();
  const [selectedSegment, setSelectedSegment] = useState('user');
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    profilePicture: '',
    pets: [
      {
        name: '',
        breed: '',
        age: '',
      },
    ],
    otherInfo: {
      favoriteHobby: '',
      favoriteFood: '',
    },
  });
  const { signOut } = useUser();

  const handleSignOut = () => {
    signOut(navigation);
  };

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
          const downloadUrl = await uploadProfilePicture(imageUri);
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
        label="Name"
        value={profileData.name}
        onChangeText={text => setProfileData({ ...profileData, name: text })}
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
        onPress={handleSaveProfile}>
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
            value={pet.type}
            onChangeText={text => handlePetChange(index, 'type', text)}
            style={styles.input}
          />
          <TextInput
            label="Pet Age"
            value={pet.age}
            onChangeText={text => handlePetChange(index, 'age', text)}
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
        <View style={styles.container}>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('NotificationSettings')}>
            <Text style={styles.setting}>Notification Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PrivacySettings')}>
            <Text style={styles.setting}>Privacy Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('PaymentSettings')}>
            <Text style={styles.setting}>Payment Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AppPreferences')}>
            <Text style={styles.setting}>App Preferences</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('BookingSettings')}>
            <Text style={styles.setting}>Booking Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('UserAds')}>
            <Text style={styles.setting}>Ads</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.setting}>Sign Out</Text>
          </TouchableOpacity>
        </View>
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
