import React, {useState} from 'react';
import { Image, ImageBackground, StyleSheet, Platform, View, Text, Alert,} from 'react-native';
import MyButton from '../../components/MyButton';
import MyTextInput from '../../components/MyTextInput';
import SocialMedia from '../../components/SocialMedia';
import auth from '@react-native-firebase/auth';

const SignUpScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const singUpTestFn = () => {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                Alert.alert('User created successfully! Proceed to Login.');
                navigation.navigate('Login');
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
                style={styles.ImageBackground}>
                <Image
                    source={require('../../assets/images/cat.jpg')}
                    style={styles.catImage}
                />
                <Text style={styles.title}>PetPal</Text>

                <View style={styles.inputsContainer}>
                    <MyTextInput value={email} onChangeText={text => setEmail(text)} placeholder="Enter Email" />
                    <MyTextInput value={password} onChangeText={text => setPassword(text)} placeholder="Enter Password" secureTextEntry={true} />
                    <MyTextInput value={confirmPassword} onChangeText={text => setConfirmPassword(text)} placeholder="Confirm Password" secureTextEntry={true} />

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
    ImageBackground: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    catImage: {
        height: 100,
        width: 100,
        alignSelf: 'center',
        marginTop: 50,
    }, 
    title: {
        fontSize: 30,
        color: 'white',
        alignSelf: 'center',
        marginBottom: 20,
    },
    inputsContainer: {
        marginTop: 20,
    },
    orText: {
        color: 'white',
        textAlign: 'center',
        marginVertical: 20,
    },
});