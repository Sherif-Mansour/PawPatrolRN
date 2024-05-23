import React, {useState} from 'react';
import { Image, ImageBackground, StyleSheet, Platform, View, Text, Alert,} from 'react-native';
import MyButton from '../../components/MyButton';
import MyTextInput from '../../components/MyTextInput';
import SocialMedia from '../../components/SocialMedia';
import auth from '@react-native-firebase/auth';
import { useTheme} from 'react-native-paper';

const SignUpScreen = ({navigation}) => {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const singUpTestFn = () => {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                Alert.alert('User created successfully! Proceed to Sign In.');
                navigation.navigate('SignIn');
            })
            .catch(err => {
                console.log(err.nativeErrorMessage);
                Alert.alert(err.nativeErrorMessage);
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

                    <MyButton title={'Sign Up'} onPress={singUpTestFn} />

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