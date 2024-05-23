import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Platform, Alert, View, Text, Button } from 'react-native';
import MyTextInput from '../../components/MyTextInput';
import SocialMedia from '../../components/SocialMedia';
import MyButton from '../../components/MyButton';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useTheme } from 'react-native-paper';

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const loginWithEmailAndPass = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res);
        navigation.navigate('Home');
      })
      .catch(err => {
        console.log(err);
      });
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
            />

            <Text style={styles.textDontHave} onPress={() => navigation.navigate('SignUp')}>Don't have an account?{' '}
              <Text style={{textDecorationLine: 'underline'}}>Sign Up</Text>
              </Text>
              <MyButton title={'Login'} onPress={loginWithEmailAndPass} />
              <Text style={styles.orText}>OR</Text>
              <SocialMedia onGooglePress={onGoogleButtonPress} />
              </View>
          </ImageBackground>
    </View>
  );
};

export default LoginScreen;

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
});