import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Alert, RefreshControl
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
  const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

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

  const handleDeleteInquiry = async inquiryId => {
    try {
      await firestore().collection('inquiries').doc(inquiryId).delete();
      setInquiries(inquiries.filter(inquiry => inquiry.id !== inquiryId));
      Alert.alert('Success', 'Inquiry deleted successfully.');
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      Alert.alert('Error', 'There was an error deleting the inquiry.');
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
      <View style={styles.userInfoContainer}>
        {item.profilePicture ? (
          <Image source={{ uri: item.profilePicture }} style={styles.userImage} />
        ) : (
          <Image
            source={require('../../assets/images/default-profile.jpg')} // Provide a default profile picture
            style={styles.userImage}
          />
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userText}>{`${item.firstName} ${item.lastName}`}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
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
      style={styles.userContainer}
      onPress={() => navigation.navigate('ReplyInquiryScreen', { inquiry: item })}
    >
    <Card style={styles.inquiryContainer}>
      <Card.Content>
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
      </Card.Content>
      <Card.Actions>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleDeleteInquiry(item.id)}
        >
          <Icon name="trash" size={24} color="#ff0000" />
        </TouchableOpacity>
      </Card.Actions>
    </Card>
  </TouchableOpacity>
  );

  const renderSection = () => {
    switch (currentSection) {
      case 'ads':
        return (
          <FlatList
            key={`ads-${currentSection}`} // Provide a unique key when numColumns changes
            data={ads}
            renderItem={renderAdItem}
            keyExtractor={item => item.id}
            style={styles.list}
            numColumns={2}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        );
      case 'users':
        return (
          <FlatList
            key={`users-${currentSection}`} // Provide a unique key when numColumns changes
            data={users}
            renderItem={renderUserItem}
            keyExtractor={item => item.id}
            style={styles.list}
            numColumns={1} // Display one profile container in one line
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        );
      case 'inquiries':
        return (
          <FlatList
            key={`inquiries-${currentSection}`} // Provide a unique key when numColumns changes
            data={inquiries}
            renderItem={renderInquiryItem}
            keyExtractor={item => item.id}
            style={styles.list}
            numColumns={1} // Display one inquiry container in one line
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        );
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
    padding: 8, // increased padding
  },
  adContainer: {
    borderWidth: 1,
    borderColor: '#FFDDB1',
    paddingTop: 8, // increased padding
    marginBottom: 12, // increased margin
    position: 'relative',
    backgroundColor: '#FFDDB1',
  },
  adImage: {
    height: 160, // increased height
    width: '100%',
    alignSelf: 'center',
  },
  adTitle: {
    fontWeight: 'bold',
    color: '#003641',
    fontSize: 16, // increased font size
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  userContainer: {
    flex: 1,
    padding: 8, // increased padding
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 12,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    height: 80, // increased height to match adImage
    width: 80, // adjust width to keep it square
    borderRadius: 40, // make it circular
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userText: {
    fontSize: 16, // increased font size
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#555',
  },
  inquiryContainer: {
    flex: 1,
    padding: 8, // increased padding
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 12,
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
