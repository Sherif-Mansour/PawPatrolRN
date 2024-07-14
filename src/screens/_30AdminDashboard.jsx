import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Alert
} from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AdminDashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [currentSection, setCurrentSection] = useState('ads');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch ads
        const adsSnapshot = await firestore().collectionGroup('userAds').get();
        const adsList = adsSnapshot.docs.map(doc => ({
          id: doc.id,
          userId: doc.ref.parent.parent.id,
          ...doc.data(),
        }));

        // Fetch users
        const usersSnapshot = await firestore().collection('profiles').get();
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch inquiries and user info for each inquiry
        const inquiriesSnapshot = await firestore().collection('inquiries').get();
        const inquiriesList = await Promise.all(inquiriesSnapshot.docs.map(async (doc) => {
          const inquiry = { id: doc.id, ...doc.data() };
          const userDoc = await firestore().collection('profiles').doc(inquiry.userId).get();
          return { ...inquiry, user: userDoc.exists ? userDoc.data() : null };
        }));

        setAds(adsList);
        setUsers(usersList);
        setInquiries(inquiriesList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      navigation.navigate('AdminSignIn');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeleteAd = async (adId, userId) => {
    try {
      const adDoc = firestore().collection('ads').doc(userId).collection('userAds').doc(adId);
      await adDoc.delete();
      setAds(ads.filter(ad => ad.id !== adId));
      Alert.alert('Success', 'Ad deleted successfully.');
    } catch (error) {
      console.error('Error deleting ad:', error);
      Alert.alert('Error', 'There was an error deleting the ad.');
    }
  };

  const handleDeleteUser = async userId => {
    try {
      await firestore().collection('profiles').doc(userId).delete();
      setUsers(users.filter(user => user.id !== userId));
      Alert.alert('Success', 'User deleted successfully.');
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'There was an error deleting the user.');
    }
  };

  const renderAdItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AdminAdDetails', { ad: item })}
      style={styles.adTouchableContainer}
    >
      <Card style={styles.adContainer}>
        {item.mainPicture ? (
          <Card.Cover source={{ uri: item.mainPicture }} style={styles.adImage} />
        ) : (
          <Image
            source={require('../../assets/images/OIP.jpeg')}
            style={styles.adImage}
          />
        )}
        <Card.Title
          titleStyle={styles.adTitle}
          title={item.title}
          subtitle={`Price: ${item.price}`}
          subtitleStyle={styles.adTitle}
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleDeleteAd(item.id, item.userId)}
        >
          <Icon name="trash" size={24} color="#ff0000" />
        </TouchableOpacity>
      </Card>
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userContainer}
      onPress={() => navigation.navigate('UserProfileScreen', { userId: item.id })}
    >
      <Image source={{ uri: item.profilePicture }} style={styles.userImage} />
      <View style={styles.userInfo}>
        <Text style={styles.userText}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleDeleteUser(item.id)}
      >
        <Icon name="trash" size={24} color="#ff0000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderInquiryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ReplyInquiryScreen', { inquiry: item })}
      style={styles.inquiryContainer}
    >
      <Text style={styles.inquiryText}>Subject: {item.subject}</Text>
      <Text style={styles.inquiryText}>Details: {item.details}</Text>
      <Text style={styles.inquiryText}>Contact Info: {item.contactInfo}</Text>
      {item.user && (
        <>
          <Text style={styles.inquiryText}>User: {item.user.firstName} {item.user.lastName}</Text>
          <Text style={styles.inquiryText}>Email: {item.user.email}</Text>
          <Text style={styles.inquiryText}>Phone: {item.user.phoneNo}</Text>
        </>
      )}
    </TouchableOpacity>
  );

  const renderSection = () => {
    switch (currentSection) {
      case 'ads':
        return <FlatList data={ads} renderItem={renderAdItem} keyExtractor={item => item.id} style={styles.list} />;
      case 'users':
        return <FlatList data={users} renderItem={renderUserItem} keyExtractor={item => item.id} style={styles.list} />;
      case 'inquiries':
        return <FlatList data={inquiries} renderItem={renderInquiryItem} keyExtractor={item => item.id} style={styles.list} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Admin Dashboard</Text>
      <Button mode="contained" onPress={handleSignOut} style={styles.signOutButton}>
        Sign Out
      </Button>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View style={styles.contentContainer}>{renderSection()}</View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton} onPress={() => setCurrentSection('ads')}>
              <Text style={styles.footerButtonText}>Ads</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton} onPress={() => setCurrentSection('users')}>
              <Text style={styles.footerButtonText}>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton} onPress={() => setCurrentSection('inquiries')}>
              <Text style={styles.footerButtonText}>Inquiries</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  signOutButton: {
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  list: {
    width: '100%',
  },
  adTouchableContainer: {
    flex: 1,
    maxWidth: '50%',
    padding: 5,
  },
  adContainer: {
    borderWidth: 1,
    borderColor: 'black',
    paddingTop: 5,
    marginBottom: 10,
    position: 'relative',
    backgroundColor: 'white',
  },
  adImage: {
    height: 150,
    width: '100%',
    alignSelf: 'center',
  },
  adTitle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 14,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userText: {
    fontSize: 16,
  },
  userEmail: {
    fontSize: 14,
    color: '#555',
  },
  inquiryContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inquiryText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerButton: {
    padding: 10,
  },
  footerButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
});
