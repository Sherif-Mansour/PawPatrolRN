import React, {useContext, createContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {Alert, Platform} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useConfirmPayment} from '@stripe/stripe-react-native';
import {useConnection, useSendbirdChat} from '@sendbird/uikit-react-native';
import {SENDBIRD_APP_ID, SENDBIRD_API_TOKEN} from '@env';
import {
  GroupChannelModule,
  GroupChannelCreateParams,
} from '@sendbird/chat/groupChannel';
import SendbirdChat from '@sendbird/chat';

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
  const {confirmPayment} = useConfirmPayment();
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const {connect, disconnect} = useConnection();
  const {sdk, currentUser} = useSendbirdChat();
  const [sendbirdInstance, setSendbirdInstance] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async currentUser => {
      resetLoadingStates();
      if (currentUser) {
        setUser(currentUser);
        requestUserPermission();
        getToken();
        setEmail(currentUser.email);
        await fetchUserAds();
        await fetchAllAds();
        await fetchUserFavorites();
        await fetchPaymentMethods();
      } else {
        setUser(null);
        setEmail(null);
        setAds([]);
        setFavorites([]);
        setPaymentMethods([]);
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
    const unsubscribe = messaging().onTokenRefresh(token => {
      console.log('Refreshed token:', token);

      if (user) {
        // Save the refreshed FCM token to Firestore
        firestore().collection('profiles').doc(user.uid).update({
          fcmToken: token,
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const initializeSendbird = async () => {
      try {
        const params = {
          appId: SENDBIRD_APP_ID,
          modules: [new GroupChannelModule()],
        };
        const sendbird = SendbirdChat.init(params);
        setSendbirdInstance(sendbird);
        console.log('Sendbird initialized!');
      } catch (err) {
        console.error('Error initializing Sendbird:', err);
      }
    };

    initializeSendbird();
  }, []);

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

      if (user) {
        // Save the FCM token to Firestore
        await firestore().collection('profiles').doc(user.uid).update({
          fcmToken: token,
        });
      }
      setFcmToken(token);
      return token;
    } catch (err) {
      console.log('Error getting token:', err);
    }
  };

  const resetLoadingStates = () => {
    setLoading(true);
    setLoadingUserAds(true);
    setLoadingAllAds(true);
    setLoadingFavorites(true);
  };

  const handleUserSignIn = async (currentUser, navigation) => {
    try {
      setUser(currentUser);
      setEmail(currentUser.email);
      requestUserPermission();
      const token = await getToken();

      const userProfile = await fetchUserProfile(currentUser.uid);
      const firstName = userProfile?.firstName || 'Unknown';
      const lastName = userProfile?.lastName || 'User';
      const nickname = `${firstName} ${lastName}`;
      const profilePicture = userProfile?.profilePicture || '';

      await fetchUserAds();
      await fetchAllAds();
      await fetchUserFavorites();
      console.log(
        'Connecting to Sendbird with UID:',
        currentUser.uid,
        'Token:',
        token,
        'Nickname:',
        nickname,
      );
      await connect(
        currentUser.uid,
        {accessToken: token},
        {nickname: nickname},
        {profileUrl: userProfile.profilePicture || ''},
      );

      const sendbirdUser = await currentUser;
      console.log('Sendbird Connected User:', sendbirdUser);

      setLoading(false);
      if (navigation) {
        navigation.navigate('Home');
      }
    } catch (err) {
      setLoading(false);
      console.error('User sign-in error:', err);
    }
  };

  async function onGoogleButtonPress(navigation) {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      const user = userCredential.user;

      if (!user) {
        throw new Error('User is not properly signed in');
      }

      console.log('Google SignIn:', user);
      await handleUserSignIn(user, navigation);
    } catch (err) {
      setLoading(false);
      console.error('Google Sign-In error:', err);
    }
  }

  async function onFacebookButtonPress(navigation) {
    setLoading(true);
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      const userCredential = await auth().signInWithCredential(
        facebookCredential,
      );
      const user = userCredential.user;

      if (!user) {
        throw new Error('User is not properly signed in');
      }

      console.log('Facebook SignIn:', user);
      await handleUserSignIn(user, navigation);
    } catch (err) {
      setLoading(false);
      console.error('Facebook Sign-In error:', err);
      Alert.alert('Facebook Sign-In error', err.message);
    }
  }

  const signInWithEmailAndPass = (email, password, navigation) => {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(async res => {
        const user = res.user;

        if (!user) {
          throw new Error('User is not properly signed in');
        }

        console.log('Email SignIn:', user);
        await handleUserSignIn(user, navigation);
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

  const resetPassword = async email => {
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert(
        'Password Reset Email Sent',
        'Check your email to reset your password.',
      );
    } catch (err) {
      console.error('Password reset error:', err);
      Alert.alert(
        'Error',
        'Failed to send password reset email. Please try again.',
      );
    }
  };

  const createOrUpdateUserInSendbird = async (userId, nickname, profileUrl) => {
    try {
      // First, try to update the user
      let response = await fetch(
        `https://api-${SENDBIRD_APP_ID}.sendbird.com/v3/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json; charset=utf8',
            'Api-Token': SENDBIRD_API_TOKEN,
          },
          body: JSON.stringify({
            nickname: nickname,
            profile_url: profileUrl,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === 400201) {
          // User does not exist, create the user
          response = await fetch(
            `https://api-${SENDBIRD_APP_ID}.sendbird.com/v3/users`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json; charset=utf8',
                'Api-Token': SENDBIRD_API_TOKEN,
              },
              body: JSON.stringify({
                user_id: userId,
                nickname: nickname,
                profile_url: profileUrl,
                issue_access_token: true,
              }),
            },
          );
        } else {
          throw new Error(errorData.message);
        }
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      console.log('Sendbird user created or updated:', data);
    } catch (error) {
      console.error('Error creating or updating Sendbird user:', error);
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

      // Call Sendbird function
      const nickname = `${profileData.firstName} ${profileData.lastName}`;
      const profileUrl = profileData.profilePicture || '';
      await createOrUpdateUserInSendbird(user.uid, nickname, profileUrl);
    } catch (err) {
      console.error('Error creating/updating profile:', err);
      Alert.alert('Profile Error', 'Failed to create/update profile');
    }
  };

  const fetchUserProfile = async (userId = user.uid) => {
    if (!userId) throw new Error('User ID is missing');

    const userProfileRef = firestore().collection('profiles').doc(userId);
    const userProfileDoc = await userProfileRef.get();

    if (userProfileDoc.exists) {
      return userProfileDoc.data();
    } else {
      // Return null or a default profile object when the user profile is not found
      return {
        firstName: 'Unknown',
        lastName: 'User',
        profilePicture: '',
      };
    }
  };

  const fetchChatUserProfile = async userId => {
    if (!userId) throw new Error('User ID is missing');

    const userProfileRef = firestore().collection('profiles').doc(userId);
    const userProfileDoc = await userProfileRef.get();

    if (userProfileDoc.exists) {
      const user = userProfileDoc.data();
      console.log('Fetched user profile:', user); // Debug log
      return {
        userId: user.uid || userId,
        firstName: user.firstName || 'Unknown',
        lastName: user.lastName || 'User',
        profileUrl: user.profilePicture || '',
        key: user.uid || userId,
      };
    } else {
      return null;
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

  const isProfileComplete = profile => {
    return (
      profile &&
      profile.firstName &&
      profile.lastName &&
      profile.phoneNo &&
      profile.address &&
      profile.firstName.trim() !== '' &&
      profile.lastName.trim() !== '' &&
      profile.phoneNo.trim() !== '' &&
      profile.address.trim() !== ''
    );
  };

  const createOrUpdateAd = async (adData, navigation) => {
    try {
      if (!user) throw new Error('User not logged in');

      const profileData = await fetchUserProfile();
      if (!isProfileComplete(profileData)) {
        Alert.alert(
          'Profile Incomplete',
          'Please complete your profile before creating an ad.',
          [
            {
              text: 'Go to Profile',
              onPress: () => navigation.navigate('Profile'),
            },
          ],
          {cancelable: false},
        );
        return;
      }

      const userAdRef = firestore()
        .collection('ads')
        .doc(user.uid)
        .collection('userAds');

      let adDocRef;

      if (adData.id) {
        adDocRef = userAdRef.doc(adData.id);
      } else {
        adDocRef = userAdRef.doc();
        adData.id = adDocRef.id;
      }

      const adDataWithUserId = {
        ...adData,
        userId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      console.log('Setting ad data:', adDataWithUserId);

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
      console.log('Attempting to disconnect from SendBird');
      await disconnect();
      console.log('User disconnected from SendBird');
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

  const createPaymentIntent = async (amount, currency, description) => {
    try {
      const response = await fetch(
        'http://localhost:3000/create-payment-intent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({amount, currency, description}),
        },
      );

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error('Error creating payment intent', error);
      throw error;
    }
  };

  const handlePayment = async transaction => {
    try {
      const clientSecret = await createPaymentIntent(
        transaction.amount,
        transaction.currency,
        transaction.description,
      );
      const {paymentIntent, error} = await confirmPayment(clientSecret, {
        type: 'Card',
        billingDetails: {email: user.email},
      });

      if (error) {
        console.log('Payment confirmation error', error);
        Alert.alert(
          'Payment Error',
          'There was an issue with your payment. Please try again.',
        );
      } else if (paymentIntent) {
        console.log('Payment successful', paymentIntent);

        // Save transaction details to Firestore
        const newTransaction = {
          ...transaction,
          userId: user.uid,
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
          createdAt: firestore.FieldValue.serverTimestamp(),
        };
        await firestore().collection('transactions').add(newTransaction);

        // Update the transaction details state with the new transaction
        setTransactionDetails(prevTransactions => [
          ...prevTransactions,
          newTransaction,
        ]);

        Alert.alert('Payment Success', 'Your payment was successful.');
      }
    } catch (error) {
      console.error('Payment error', error);
      Alert.alert(
        'Payment Error',
        'There was an issue processing your payment. Please try again.',
      );
    }
  };

  const savePaymentDetails = async paymentDetails => {
    try {
      if (!user) throw new Error('User not logged in');

      const userPaymentRef = firestore()
        .collection('paymentMethods')
        .doc(user.uid);
      const userPaymentDoc = await userPaymentRef.get();

      let paymentMethods = [];
      if (userPaymentDoc.exists) {
        paymentMethods = userPaymentDoc.data().paymentMethods || [];
      }

      paymentMethods.push(paymentDetails);

      await userPaymentRef.set({paymentMethods});
      setPaymentMethods(paymentMethods); // Update local state
      console.log('Payment details saved successfully:', paymentMethods);
    } catch (err) {
      console.error('Error saving payment details:', err);
      Alert.alert('Payment Error', 'Failed to save payment details');
    }
  };

  const fetchPaymentMethods = async () => {
    if (!user) return;

    const userPaymentRef = firestore()
      .collection('paymentMethods')
      .doc(user.uid);
    const userPaymentDoc = await userPaymentRef.get();

    if (userPaymentDoc.exists) {
      const fetchedPaymentMethods = userPaymentDoc.data().paymentMethods || [];
      setPaymentMethods(fetchedPaymentMethods);
      const selectedMethod =
        userPaymentDoc.data().selectedPaymentMethod || null;
      setSelectedPaymentMethod(selectedMethod);
      console.log('Fetched payment methods:', fetchedPaymentMethods);
    } else {
      console.log('No payment methods found for user');
    }
  };

  const setPreferredMethod = async methodIndex => {
    try {
      if (!user) throw new Error('User not logged in');

      setSelectedPaymentMethod(methodIndex);

      const userPaymentRef = firestore()
        .collection('paymentMethods')
        .doc(user.uid);
      await userPaymentRef.update({selectedPaymentMethod: methodIndex});

      console.log('Preferred payment method set:', methodIndex);
    } catch (err) {
      console.error('Error setting preferred payment method:', err);
      Alert.alert('Error', 'Failed to set preferred payment method');
    }
  };

  const editPaymentDetails = async (index, paymentDetails) => {
    try {
      if (!user || !paymentMethods[index]) return;

      const paymentMethod = paymentMethods[index];
      const paymentMethodsRef = firestore()
        .collection('paymentMethods')
        .doc(user.uid);
      paymentMethods[index] = paymentDetails;

      await paymentMethodsRef.update({paymentMethods});
      await fetchPaymentMethods(); // Refresh the payment methods list
      console.log('Payment method edited successfully:', paymentDetails);
    } catch (err) {
      console.error('Error editing payment details:', err);
      Alert.alert('Error', 'Failed to edit payment details');
    }
  };

  const deletePaymentMethod = async index => {
    try {
      if (!user || !paymentMethods[index]) return;

      const paymentMethodsRef = firestore()
        .collection('paymentMethods')
        .doc(user.uid);
      const updatedPaymentMethods = [...paymentMethods];
      updatedPaymentMethods.splice(index, 1);

      await paymentMethodsRef.update({paymentMethods: updatedPaymentMethods});
      setPaymentMethods(updatedPaymentMethods); // Update local state
      console.log('Payment method deleted successfully');
    } catch (err) {
      console.error('Error deleting payment method:', err);
      Alert.alert('Error', 'Failed to delete payment method');
    }
  };

  const createChat = async (currentUserId, otherUserId) => {
    try {
      console.log('Creating chat channel');
      if (!sendbirdInstance) {
        throw new Error('Sendbird SDK is not initialized');
      }

      const params = {
        invitedUserIds: [otherUserId],
        operatorUserIds: [currentUserId],
        isDistinct: true,
      };

      console.log('Creating chat with params:', {
        currentUserId,
        otherUserId,
        params,
      });

      const channel = await sendbirdInstance.groupChannel.createChannel(params);
      console.log('Chat channel created:', channel);
      return channel.url;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
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
        onFacebookButtonPress,
        createOrUpdateProfile,
        fetchUserProfile,
        fetchChatUserProfile,
        isProfileComplete,
        uploadImage,
        createOrUpdateAd,
        signOut,
        currentAd,
        setCurrentAd,
        handlePayment,
        savePaymentDetails,
        fetchPaymentMethods,
        paymentMethods,
        selectedPaymentMethod,
        setPreferredMethod,
        editPaymentDetails,
        deletePaymentMethod,
        createChat,
        sendbirdInstance,
        resetPassword,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
