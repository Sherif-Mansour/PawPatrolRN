import React, {useContext, createContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Alert, Platform} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {GiftedChat} from 'react-native-gifted-chat';

const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingUserAds, setLoadingUserAds] = useState(true);
  const [loadingAllAds, setLoadingAllAds] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [email, setEmail] = useState(null);
  const [ads, setAds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentAd, setCurrentAd] = useState(null);

  const resetLoadingStates = () => {
    setLoading(true);
    setLoadingUserAds(true);
    setLoadingAllAds(true);
    setLoadingFavorites(true);
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async currentUser => {
      resetLoadingStates();
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email);
        await fetchUserAds();
        await fetchAllAds();
        await fetchUserFavorites();
      } else {
        setUser(null);
        setEmail(null);
        setAds([]);
        setFavorites([]);
      }
      setLoading(false);
      setLoadingUserAds(false);
      setLoadingAllAds(false);
      setLoadingFavorites(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '525365467776-38jgkirtmtklit7e8srik0nheq8fagvs.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    const requestUserPermission = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      } catch (err) {
        console.log('Error requesting permission:', err);
      }
    };

    const getToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('Token:', token);
      } catch (err) {
        console.log('Error getting token:', err);
      }
    };

    requestUserPermission();
    getToken();

    const unsubscribe = messaging().onTokenRefresh(token => {
      console.log('Refreshed token:', token);
    });

    return () => unsubscribe();
  }, []);

  async function onGoogleButtonPress(navigation) {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken, user} = await GoogleSignin.signIn();
      console.log(user);
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      await fetchUserAds();
      await fetchAllAds();
      await fetchUserFavorites();
      setLoading(false);
      setLoadingUserAds(false);
      setLoadingAllAds(false);
      setLoadingFavorites(false);
      navigation.navigate('Home');
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  }

  const signInWithEmailAndPass = (email, password, navigation) => {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async res => {
        console.log(res);
        await fetchUserAds();
        await fetchAllAds();
        await fetchUserFavorites();
        setLoading(false);
        setLoadingUserAds(false);
        setLoadingAllAds(false);
        setLoadingFavorites(false);
        navigation.navigate('Home');
      })
      .catch(err => {
        setLoading(false);
        console.error('Email/password sign-in error:', err);
        Alert.alert(
          'Sign-In Error',
          'Invalid email or password. Please try again.',
        );
      });
  };

  const createUserWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const createOrUpdateProfile = async profileData => {
    const userProfileRef = firestore().collection('profiles').doc(user.uid);

    try {
      if (!user) throw new Error('User not logged in');

      const userProfileDoc = await userProfileRef.get();

      if (userProfileDoc.exists) {
        await userProfileRef.update({
          ...profileData,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
        console.log('Profile updated successfully');
      } else {
        await userProfileRef.set({
          ...profileData,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
        console.log('Profile created successfully');
      }
    } catch (err) {
      console.error('Error creating/updating profile:', err);
      Alert.alert('Profile Error', 'Failed to create/update profile');
    }
  };

  const fetchUserProfile = async () => {
    if (!user) throw new Error('User not logged in');

    const userProfileRef = firestore().collection('profiles').doc(user.uid);
    const userProfileDoc = await userProfileRef.get();

    if (userProfileDoc.exists) {
      return userProfileDoc.data();
    } else {
      // Return null or a default profile object when the user profile is not found
      return null; // or { name: '', bio: '', profilePicture: '', pets: [], otherInfo: {} }
    }
  };

  const uploadImage = async imageUri => {
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const uploadUri =
      Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;
    const task = storage().ref(filename).putFile(uploadUri);

    try {
      await task;
      const url = await storage().ref(filename).getDownloadURL();
      return url;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const createOrUpdateAd = async adData => {
    try {
      if (!user) throw new Error('User not logged in');

      const userAdRef = firestore()
        .collection('ads')
        .doc(user.uid)
        .collection('userAds');

      let adDocRef;

      if (adData.id) {
        // If adData already has an ID, update the existing ad
        adDocRef = userAdRef.doc(adData.id);
      } else {
        // If adData does not have an ID, create a new ad with an auto-generated ID
        adDocRef = userAdRef.doc(); // Firestore will generate a unique ID
        adData.id = adDocRef.id; // Associate the auto-generated ID with the ad data
      }

      const adDataWithUserId = {
        ...adData,
        userId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      console.log('Setting ad data:', adDataWithUserId); // Log the ad data being set

      // Set ad data and timestamps
      await adDocRef.set(adDataWithUserId);

      if (adData.id) {
        console.log('Ad updated successfully');
        Alert.alert('Ad Updated', 'Your ad has been updated successfully');
      } else {
        console.log('Ad created successfully');
        Alert.alert('Ad Created', 'Your ad has been created successfully');
      }
    } catch (err) {
      console.error('Error creating/updating ad:', err);
      Alert.alert('Ad Error', 'Failed to create/update ad');
    }
  };

  const createChat = async (currentUserId, adUserId) => {
    try {
      // First, check if a chat between the current user and the ad user already exists
      const chatQuery = await firestore()
        .collection('chats')
        .where('participants', 'array-contains', currentUserId)
        .get();

      let chatId = null;
      chatQuery.forEach(doc => {
        const participants = doc.data().participants;
        if (participants.includes(adUserId)) {
          chatId = doc.id;
        }
      });

      // If no existing chat is found, create a new one
      if (!chatId) {
        const newChatRef = await firestore()
          .collection('chats')
          .add({
            participants: [currentUserId, adUserId],
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        chatId = newChatRef.id;
      }

      return chatId;
    } catch (err) {
      console.error('Error creating chat: ', err);
      return null;
    }
  };

  const fetchUserAds = async () => {
    if (!user) return;
    setLoadingUserAds(true);
    try {
      console.log('Fetching user ads from Firestore...');
      const userAdsSnapshot = await firestore()
        .collection('ads')
        .doc(user.uid)
        .collection('userAds')
        .get();
      const userAdsList = userAdsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAds(userAdsList);
    } catch (err) {
      console.error('Error fetching user ads:', err);
      Alert.alert('Error', 'Failed to fetch user ads. Please try again later.');
    } finally {
      setLoadingUserAds(false);
    }
  };

  const fetchAllAds = async () => {
    setLoadingAllAds(true);
    try {
      console.log('Fetching all ads from Firestore...');
      const adsSnapshot = await firestore().collectionGroup('userAds').get();
      const adsList = adsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAds(adsList);
    } catch (err) {
      console.error('Error fetching ads:', err);
      Alert.alert('Error', 'Failed to fetch ads. Please try again later.');
    } finally {
      setLoadingAllAds(false);
    }
  };

  const deleteAd = async adId => {
    try {
      const adRef = firestore()
        .collection('ads')
        .doc(user.uid)
        .collection('userAds')
        .doc(adId);

      await adRef.delete();
      setAds(ads.filter(ad => ad.id !== adId));
      Alert.alert('Ad Deleted', 'Your ad has been deleted successfully.');
    } catch (err) {
      console.error('Error deleting ad:', err);
      Alert.alert('Error', 'There was an error deleting the ad.');
    }
  };

  const handleAddToFavorites = async adId => {
    const userFavoritesRef = firestore().collection('favorites').doc(user.uid);

    setFavorites(prevFavorites => {
      const updatedFavorites = prevFavorites.includes(adId)
        ? prevFavorites.filter(favId => favId !== adId)
        : [...prevFavorites, adId];

      userFavoritesRef.set({favorites: updatedFavorites}, {merge: true});

      return updatedFavorites;
    });
  };

  const fetchUserFavorites = async () => {
    if (!user) return;

    const userFavoritesRef = firestore().collection('favorites').doc(user.uid);
    const userFavoritesDoc = await userFavoritesRef.get();

    if (userFavoritesDoc.exists) {
      setFavorites(userFavoritesDoc.data().favorites);
    } else {
      setFavorites([]);
    }
  };

  const signOut = async navigation => {
    try {
      await auth().signOut();
      setUser(null);
      setFavorites([]);
      setAds([]);
      setLoadingUserAds(true);
      setLoadingAllAds(true);
      setLoadingFavorites(true);
      console.log('User signed out');
      navigation.navigate('SplashScreen');
    } catch (err) {
      console.error('Sign-out error:', err);
      Alert.alert('Sign-Out Error', 'Failed to sign out. Please try again.');
    }
  };

  const savePaymentDetails = async (paymentMethod, paymentDetails) => {
    try {
      if (!user) throw new Error('User not logged in');

      await firestore()
        .collection('paymentMethods')
        .doc(user.uid)
        .set({paymentMethod, ...paymentDetails});
      console.log('Payment details saved successfully:', paymentDetails);
    } catch (err) {
      console.error('Error saving payment details:', err);
      Alert.alert('Payment Error', 'Failed to save payment details');
    }
  };

  const sendMessage = async (chatId, text) => {
    try {
      const messageData = {
        text,
        createdAt: firestore.FieldValue.serverTimestamp(),
        userId: user.uid,
        user: {
          _id: user.uid,
          name: user.displayName,
          avatar: user.photoURL,
        },
      };
      console.log('Sending message:', messageData);
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add(messageData);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendMultimediaMessage = async (chatId, imageUri) => {
    const url = await uploadImage(imageUri);
    if (url) {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add({
          image: url,
          createdAt: firestore.FieldValue.serverTimestamp(),
          userId: user.uid,
        });
    }
  };

  const subscribeToMessages = (chatId, callback) => {
    return firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          if (querySnapshot && !querySnapshot.empty) {
            const messages = querySnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                _id: doc.id,
                text: data.text,
                createdAt: data.createdAt
                  ? data.createdAt.toDate()
                  : new Date(),
                user: data.user,
              };
            });
            callback(messages);
          } else {
            callback([]);
          }
        },
        error => {
          console.error('Error fetching messages:', error);
          callback([]);
        },
      );
  };

  const fetchUserChats = async userId => {
    try {
      const userChatsSnapshot = await firestore()
        .collection('chats')
        .where('participants', 'array-contains', userId)
        .get();
      const userChats = userChatsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      return userChats;
    } catch (err) {
      console.error('Error fetching user chats:', err);
      return [];
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        loadingUserAds,
        loadingAllAds,
        loadingFavorites,
        email,
        ads,
        fetchUserAds,
        fetchAllAds,
        deleteAd,
        favorites,
        handleAddToFavorites,
        fetchUserFavorites,
        signInWithEmailAndPass,
        createUserWithEmailAndPassword,
        onGoogleButtonPress,
        createOrUpdateProfile,
        fetchUserProfile,
        uploadImage,
        createOrUpdateAd,
        signOut,
        savePaymentDetails,
        sendMessage,
        subscribeToMessages,
        sendMultimediaMessage,
        fetchUserChats,
        createChat,
        currentAd,
        setCurrentAd,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
