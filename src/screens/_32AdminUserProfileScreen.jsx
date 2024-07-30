import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Card, Title, Paragraph } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const UserProfileScreen = ({ route }) => {
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
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Image
            source={user.profilePicture ? { uri: user.profilePicture } : require('../../assets/images/default-profile.jpg')}
            style={styles.profileImage}
          />
          <Title style={styles.userName}>{user.firstName} {user.lastName}</Title>
          <Paragraph style={styles.userEmail}>{user.email}</Paragraph>
          <Paragraph style={styles.userDetails}>Phone: {user.phoneNo}</Paragraph>
          {user.address && (
            <Paragraph style={styles.userDetails}>
              Address: {user.address.street}, {user.address.city}, {user.address.province}, {user.address.country}, {user.address.postalCode}
            </Paragraph>
          )}
          <Paragraph style={styles.userDetails}>Age: {user.age}</Paragraph>
          <Paragraph style={styles.userDetails}>Occupation: {user.occupation}</Paragraph>
          <Paragraph style={styles.userDetails}>Bio: {user.bio}</Paragraph>
          <Paragraph style={styles.userDetails}>Favorite Food: {user.favoriteFood}</Paragraph>
          <Paragraph style={styles.userDetails}>Favorite Hobby: {user.favoriteHobby}</Paragraph>
          <Title style={styles.sectionTitle}>Pets:</Title>
          {user.pets && user.pets.map((pet, index) => (
            <Card key={index} style={styles.petCard}>
              <Card.Content>
                <Title style={styles.petName}>{pet.name}</Title>
                <Paragraph style={styles.petDetails}>Species: {pet.species}</Paragraph>
                <Paragraph style={styles.petDetails}>Breed: {pet.breed}</Paragraph>
                <Paragraph style={styles.petDetails}>Gender: {pet.gender}</Paragraph>
                <Paragraph style={styles.petDetails}>Age: {pet.age}</Paragraph>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>
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
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  cardContent: {
    alignItems: 'center',
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
    marginBottom: 10,
  },
  userDetails: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  petCard: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  petDetails: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});
