import React, {useState} from 'react';
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
import {Button, useTheme} from 'react-native-paper';
import {useUser} from '../../utils/UserContext';

const SignInScreen = ({navigation}) => {
  const {
    signInWithEmailAndPass,
    onGoogleButtonPress,
    resetPassword,
    onFacebookButtonPress,
    onTwitterButtonPress,
  } = useUser();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

          <Text style={styles.textForgotPassword} onPress={handlePasswordReset}>
            Forgot Password?
          </Text>

          <Text
            style={styles.textDontHave}
            onPress={() => navigation.navigate('SignUp')}>
            Don't have an account?{' '}
            <Text style={{textDecorationLine: 'underline'}}>Sign Up</Text>
          </Text>
          <Button
            mode="contained"
            buttonColor="#FFBF5D"
            onPress={() => signInWithEmailAndPass(email, password, navigation)}>
            Sign In
          </Button>
          <Text style={styles.orText}>OR</Text>
          <SocialMedia
            onGooglePress={() => onGoogleButtonPress(navigation)}
            onFacebookPress={() => onFacebookButtonPress(navigation)}
            onTwitterPress={() => onTwitterButtonPress(navigation)}
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
  textForgotPassword: {
    color: 'white',
    textDecorationLine: 'underline',
    textAlign: 'right',
    marginVertical: 10,
  },
});
