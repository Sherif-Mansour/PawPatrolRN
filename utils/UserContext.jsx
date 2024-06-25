import React, {useContext, createContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Alert, Platform} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {GiftedChat} from 'react-native-gifted-chat';
import {useConfirmPayment} from '@stripe/stripe-react-native';
import {client, xml} from '@xmpp/client';

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
  const [xmppClient, setXmppClient] = useState(null);

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

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
=======
>>>>>>> b4c89a09f2f7d751d75755662f1a73cb782b2af9
  const connectXMPP = async user => {
    try {
      const token = await messaging().getToken();
      console.log('XMPP Token:', token);

      const xmpp = client({
<<<<<<< HEAD
        service: 'ws://10.243.75.216:5222', // XMPP server address
=======
        service: 'ws://10.0.0.242:5222', // XMPP server address
>>>>>>> b4c89a09f2f7d751d75755662f1a73cb782b2af9
        domain: 'localhost',
        resource: 'example',
      });

      xmpp.on('error', err => {
        console.error('XMPP Error:', err);
      });

      xmpp.on('offline', () => {
        console.log('XMPP Client is offline');
      });

      xmpp.on('stanza', stanza => {
        if (stanza.is('message')) {
          console.log('Incoming message:', stanza.toString());
          const message = {
            _id: stanza.attrs.id,
            text: stanza.getChildText('body'),
            createdAt: new Date(),
            user: {
              _id: stanza.attrs.from,
            },
          };
          setMessages(previousMessages =>
            GiftedChat.append(previousMessages, message),
          );
        }
      });

      xmpp.on('online', async address => {
        console.log('XMPP Client is online as', address.toString());

        // Send a presence stanza
        const presence = xml('presence', {});
        await xmpp.send(presence);
      });

      await xmpp.start();
      setXmppClient(xmpp);
    } catch (error) {
      console.error('Error connecting to XMPP:', error);
    }
  };

<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> b4c89a09f2f7d751d75755662f1a73cb782b2af9
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async currentUser => {
      resetLoadingStates();
      if (currentUser) {
        setUser(currentUser);
        requestUserPermission();
        getToken();
        connectXMPP(currentUser);
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

  // Notification handler for foreground
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);

      // Check if remoteMessage.notification is defined
      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title,
          remoteMessage.notification.body,
        );
      } else {
        console.log('Notification data is missing in the message');
      }
    });

    return unsubscribe;
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

  const fetchUserProfile = async (userId = user.uid) => {
    if (!userId) throw new Error('User ID is missing');

    const userProfileRef = firestore().collection('profiles').doc(userId);
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

      // Fetch the recipient's FCM token from their profile
      const chatDoc = await firestore().collection('chats').doc(chatId).get();
      const participants = chatDoc.data().participants;
      const recipientId = participants.find(id => id !== user.uid);
      const recipientProfile = await firestore()
        .collection('profiles')
        .doc(recipientId)
        .get();
      const recipientFcmToken = recipientProfile.data().fcmToken;

      // Send a push notification
      if (recipientFcmToken) {
        await messaging().sendMessage({
          token: recipientFcmToken,
          notification: {
            title: 'New Message',
            body: text,
          },
        });
        console.log('Notification sent successfully');
      } else {
        console.log('No FCM token found for recipient');
      }

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

      // Fetch the recipient's FCM token from their profile
      const chatDoc = await firestore().collection('chats').doc(chatId).get();
      const participants = chatDoc.data().participants;
      const recipientId = participants.find(id => id !== user.uid);
      const recipientProfile = await firestore()
        .collection('profiles')
        .doc(recipientId)
        .get();
      const recipientFcmToken = recipientProfile.data().fcmToken;

      // Send a push notification
      if (recipientFcmToken) {
        await messaging().sendMessage({
          token: recipientFcmToken,
          notification: {
            title: 'New Image Message',
            body: 'You have received a new image',
          },
        });
        console.log('Notification sent successfully');
      } else {
        console.log('No FCM token found for recipient');
      }
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
      const userChats = [];

      for (const doc of userChatsSnapshot.docs) {
        const chatData = doc.data();
        const otherUserId = chatData.participants.find(
          participant => participant !== userId,
        );

        const otherUserProfileSnapshot = await firestore()
          .collection('profiles')
          .doc(otherUserId)
          .get();

        const otherUserProfile = otherUserProfileSnapshot.data();

        const lastMessageSnapshot = await firestore()
          .collection('chats')
          .doc(doc.id)
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();

        const lastMessage =
          lastMessageSnapshot.docs.length > 0
            ? lastMessageSnapshot.docs[0].data().text
            : 'No messages yet.';

        console.log('Other User Profile:', otherUserProfile);
        console.log('Last Message:', lastMessage);

        userChats.push({
          id: doc.id,
          otherUserName: `${otherUserProfile.firstName} ${otherUserProfile.lastName}`,
          otherUserAvatar: otherUserProfile.profilePicture,
          lastMessageReceived: lastMessage,
        });
      }

      return userChats;
    } catch (err) {
      console.error('Error fetching user chats:', err);
      return [];
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
        isProfileComplete,
        uploadImage,
        createOrUpdateAd,
        signOut,
        sendMessage,
        subscribeToMessages,
        sendMultimediaMessage,
        fetchUserChats,
        createChat,
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
        xmppClient,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
