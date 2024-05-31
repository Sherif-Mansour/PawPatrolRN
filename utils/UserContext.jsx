import React, {useContext, createContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);
  const [ads, setAds] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      setUser(currentUser);
      setLoading(false);
      setEmail(currentUser ? currentUser.email : null);
    });
    return () => unsubscribe();
  }, [user]);

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
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken, user} = await GoogleSignin.signIn();
      console.log(user);
      navigation.navigate('Home');
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    } catch (err) {
      console.error(err);
    }
  }

  const signInWithEmailAndPass = (email, password, navigation) => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res);
        navigation.navigate('Home');
      })
      .catch(err => {
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
      throw new Error('User profile not found');
    }
  };

  const uploadProfilePicture = async imageUri => {
    const storageRef = storage().ref('profilePictures/${user.uid}.jpg');
    await storageRef.putFile(imageUri);
    const downloadUrl = await storageRef.getDownloadURL();
    return downloadUrl;
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

      // Set ad data and timestamps
      await adDocRef.set({
        ...adData,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

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

  const fetchUserAds = async () => {
    try {
      if (!user) throw new Error('User not logged in');

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
    }
  };

  const fetchAllAds = async () => {
    try {
      console.log('Fetching ads from Firestore...');
      const adsSnapshot = await firestore().collectionGroup('userAds').get();
      const adsList = adsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      // uncomment the following line to see the ads in the console
      // console.log('Fetched ads:', adsList);
      setAds(adsList);
    } catch (err) {
      console.error('Error fetching ads:', err);
      Alert.alert('Error', 'Failed to fetch ads. Please try again later.');
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

  const handleAddToFavorites = adId => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(adId)) {
        return prevFavorites.filter(favId => favId !== adId);
      } else {
        return [...prevFavorites, adId];
      }
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        email,
        ads,
        fetchUserAds,
        fetchAllAds,
        deleteAd,
        favorites,
        handleAddToFavorites,
        signInWithEmailAndPass,
        createUserWithEmailAndPassword,
        onGoogleButtonPress,
        createOrUpdateProfile,
        fetchUserProfile,
        uploadProfilePicture,
        createOrUpdateAd,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
