import React, { useState } from 'react';
import { Image, ImageBackground, StyleSheet, View, Text, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import MyTextInput from '../../components/MyTextInput';
import { Button, useTheme } from 'react-native-paper';
import { useUser } from '../../utils/UserContext';

const SignUpScreen = ({ navigation }) => {
  const { user, createUserWithEmailAndPassword } = useUser();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    try {
      await createUserWithEmailAndPassword(email, password);
      Alert.alert('User created successfully! Proceed to Sign In.');
      navigation.navigate('SignIn');
    } catch (err) {
      console.error(err);
      Alert.alert(err.nativeErrorMessage);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>

      <ImageBackground
        source={require('../../assets/images/background.jpg')}
        style={styles.imageBackground}
      >

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
          <MyTextInput
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
            placeholder="Confirm Password"
            secureTextEntry={true}
            style={styles.input}
          />

          <Button
            mode="contained"
            buttonColor="#009B7D"
            onPress={handleSignUp}
            style={styles.button}
          >
            Sign Up
          </Button>
        </View>

      </ImageBackground>

    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

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
  button: {
    marginTop: 10,
  },
});
