import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import MyTextInput from '../../components/MyTextInput';
import SocialMedia from '../../components/SocialMedia';
import { Button, useTheme } from 'react-native-paper';
import { useUser } from '../../utils/UserContext';
import firestore from '@react-native-firebase/firestore';

const SignInScreen = ({ navigation }) => {
  const { signInWithEmailAndPass, resetPassword, onGoogleButtonPress, onFacebookButtonPress } = useUser();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPass(email, password);

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
          navigation.navigate('AdminDashboard');
        } else {
          console.log('User is not an admin');
          navigation.navigate('Home'); // or 'UserHome' depending on your route structure
        }
      } else {
        console.log(`Admin document not found for user UID: ${user.uid}`);
        navigation.navigate('Home'); // or 'UserHome' depending on your route structure
      }
    } catch (err) {
      console.error('Error during sign-in:', err);
      Alert.alert('Sign-In Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = () => {
    if (email) {
      resetPassword(email);
    } else {
      Alert.alert('Error', 'Please enter your email address to reset password');
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

        <View style={[styles.inputsContainer]}>
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

          <View style={styles.textLinkContainer}>
            <Text style={styles.textLink} onPress={handlePasswordReset}>
              Forgot Password?
            </Text>
          </View>

          <Text
            style={styles.textDontHave}
            onPress={() => navigation.navigate('SignUp')}>
            Don't have an account?{' '}
            <Text style={{ textDecorationLine: 'underline' }}>Sign Up</Text>
          </Text>
          <Button
            mode="contained"
            buttonColor="#FFBF5D"
            onPress={handleSignIn}
            loading={loading}
            disabled={loading}>
            Sign In
          </Button>
          <Text style={styles.orText}>OR</Text>
          <SocialMedia
            onGooglePress={() => onGoogleButtonPress(navigation)}
            onFacebookPress={() => onFacebookButtonPress(navigation)}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default SignInScreen;

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
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    color: 'white',
  },
  textDontHave: {
    color: 'white',
  },
  textLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textLink: {
    color: 'white',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  textForgotPassword: {
    color: 'white',
    textDecorationLine: 'underline',
    textAlign: 'right',
    marginVertical: 10,
  },
});
