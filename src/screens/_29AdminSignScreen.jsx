import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import MyTextInput from '../../components/MyTextInput';
import { Button, useTheme } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const AdminSignInScreen = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigateToDashboard = () => {
    console.log('User signed in, navigating to AdminDashboard');
    navigation.navigate('AdminDashboard'); // Change 'AdminDashboard' to the name of your admin dashboard screen
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (!user) {
        throw new Error('User is not properly signed in');
      }

      console.log('Email SignIn:', user);

      // Check Firestore admin collection
      const adminDoc = await firestore()
        .collection('admin')
        .doc(user.uid)
        .get();

      if (adminDoc.exists) {
        const adminData = adminDoc.data();
        console.log('Admin Data:', adminData);
        if (adminData.isadmin) {
          console.log('Admin user verified');
          navigateToDashboard();
        } else {
          console.log('User is not an admin');
          throw new Error('User is not an admin');
        }
      } else {
        console.log(`Admin document not found for user UID: ${user.uid}`);
        throw new Error('User is not an admin');
      }
    } catch (err) {
      console.error('Error during sign-in:', err);
      Alert.alert('Sign-In Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.jpg')}
        style={styles.imageBackground}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/PetPalLogo.png')}
            style={styles.logoImage}
          />
        </View>

        <View style={styles.inputsContainer}>
          <MyTextInput
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="Enter Email"
            style={styles.input}
          />
          <MyTextInput
            value={password}
            onChangeText={text => setPassword(text)}
            placeholder="Enter Password"
            secureTextEntry={true}
            style={styles.input}
          />

          <Button
            mode="contained"
            buttonColor="#FFBF5D"
            onPress={handleSignIn}
            loading={loading}
            disabled={loading}>
            Login
          </Button>
        </View>
      </ImageBackground>
    </View>
  );
};

export default AdminSignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-around',
  },
  logoImage: {
    height: 60,
    width: '70%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  inputsContainer: {
    backgroundColor: 'rgba(0, 31, 38, 0.5)',
    padding: 20,
    margin: 20,
    marginTop: 350,
    borderRadius: 10,
  },
  input: {
    marginBottom: 10,
  },
});
