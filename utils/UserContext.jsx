/* eslint-disable prettier/prettier */
import React, {useContext, createContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(null);

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

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        email,
        signInWithEmailAndPass,
        onGoogleButtonPress,
        createOrUpdateProfile,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
