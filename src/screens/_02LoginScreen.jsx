import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import MyTextInput from '../../components/MyTextInput';
import SocialMedia from '../../components/SocialMedia';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const LoginScreen = ({ navigation }) => {
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
    <View>
      <MyTextInput
        value={email}
        onChangeText={text => setEmail(text)}
        placeholder="Enter Email"
      />
      <MyTextInput
        value={password}
        onChangeText={text => setPassword(text)}
        placeholder="Enter Password"
        secureTextEntry={true}
      />
      <Button title={'Login'} onPress={loginWithEmailAndPass} />
      <SocialMedia onGooglePress={onGoogleButtonPress} />
    </View>
  );
};

export default LoginScreen;
