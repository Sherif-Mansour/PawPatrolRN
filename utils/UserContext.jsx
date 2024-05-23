import React, { useContext, createContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(currentUser => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        GoogleSignin.configure({
          webClientId:
            '525365467776-38jgkirtmtklit7e8srik0nheq8fagvs.apps.googleusercontent.com',
        });
    }, []);
    
    async function onGoogleButtonPress() {
        try {
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
          const { idToken, user } = await GoogleSignin.signIn();
          console.log(user);
          navigation.navigate('Home');
          const googleCredential = auth.GoogleAuthProvider.credential(idToken);
          return auth().signInWithCredential(googleCredential);
        } catch (error) {
          console.log(error);
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
            console.log('Email/password sign-in error:', err);
            Alert.alert('Sign-In Error', 'Invalid email or password. Please try again.');
          });
      };

    return (
        <UserContext.Provider value={{
            user,
            signInWithEmailAndPass,
            onGoogleButtonPress,
        }}>
            {children}
        </UserContext.Provider>
    );    
}
    
export const useUser = () => {
    return useContext(UserContext);
};
    