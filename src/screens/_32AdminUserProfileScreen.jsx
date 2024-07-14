import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const UserProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await firestore().collection('profiles').doc(userId).get();
        setUser({ id: userDoc.id, ...userDoc.data() });
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleDeleteUser = async () => {
    try {
      await firestore().collection('profiles').doc(userId).delete();
      Alert.alert('Success', 'User deleted successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'There was an error deleting the user.');
    }
  };

  const handleBlockUser = async () => {
    try {
      await firestore().collection('profiles').doc(userId).delete();
      await firestore().collection('blockedEmails').doc(user.email).set({ blocked: true });
      Alert.alert('Success', 'User blocked successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error blocking user:', error);
      Alert.alert('Error', 'There was an error blocking the user.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
      <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
      <Text style={styles.userDetails}>Phone: {user.phoneNo}</Text>
      <Text style={styles.userDetails}>Address: {user.address}</Text>
      <Text style={styles.userDetails}>Age: {user.age}</Text>
      <Text style={styles.userDetails}>Occupation: {user.occupation}</Text>
      <Text style={styles.userDetails}>Bio: {user.bio}</Text>
      <Text style={styles.userDetails}>Favorite Food: {user.favoriteFood}</Text>
      <Text style={styles.userDetails}>Favorite Hobby: {user.favoriteHobby}</Text>
      <Text style={styles.userDetails}>Pets:</Text>
      {user.pets && user.pets.map((pet, index) => (
        <View key={index} style={styles.petContainer}>
          <Text style={styles.petDetails}>Name: {pet.name}</Text>
          <Text style={styles.petDetails}>Species: {pet.species}</Text>
          <Text style={styles.petDetails}>Breed: {pet.breed}</Text>
          <Text style={styles.petDetails}>Gender: {pet.gender}</Text>
          <Text style={styles.petDetails}>Age: {pet.age}</Text>
        </View>
      ))}
      <Button mode="contained" onPress={handleDeleteUser} style={styles.deleteButton}>
        Delete User
      </Button>
      <Button mode="contained" onPress={handleBlockUser} style={styles.blockButton}>
        Block User
      </Button>
    </ScrollView>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 18,
    color: '#777',
    marginBottom: 20,
  },
  userDetails: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  petContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '100%',
  },
  petDetails: {
    fontSize: 14,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    marginBottom: 10,
  },
  blockButton: {
    backgroundColor: '#ff8800',
  },
});
