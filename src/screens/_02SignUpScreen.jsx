import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Platform,
  View,
  Text,
  Alert,
} from 'react-native';
import MyTextInput from '../../components/MyTextInput';
import SocialMedia from '../../components/SocialMedia';
import auth from '@react-native-firebase/auth';
import {Button, useTheme} from 'react-native-paper';
import {useUser} from '../../utils/UserContext';

const SignUpScreen = ({navigation}) => {
  const {user, createUserWithEmailAndPassword} = useUser();
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

        {/* <Text style={styles.title}>PetPal</Text> */}

        <View style={[styles.inputsContainer]}>
          <MyTextInput
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="Enter Email"
            style={styles.input} // Apply styles from the theme
          />
          <MyTextInput
            value={password}
            onChangeText={text => setPassword(text)}
            placeholder="Enter Password"
            secureTextEntry={true}
            style={styles.input} // Apply styles from the theme
          />
          <MyTextInput
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
            placeholder="Confirm Password"
            secureTextEntry={true}
            style={styles.input} // Apply styles from the theme
          />

          <Button mode="contained" buttonColor="#009B7D" onPress={handleSignUp}>
            Sign Up
          </Button>

          <Text style={styles.orText}>OR</Text>

          <SocialMedia />
        </View>
      </ImageBackground>
    </View>
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
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    color: 'white',
  },
});
