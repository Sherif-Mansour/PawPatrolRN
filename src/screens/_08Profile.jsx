import React, { useState } from 'react';
import { View, StyleSheet, Alert} from 'react-native';
import { TextInput, Button, RadioButton, Avatar, SegmentedButtons } from 'react-native-paper';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useUser } from '../../utils/UserContext';

const Profile = () => {
    const { user, createOrUpdateProfile } = useUser();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [userType, setUserType] = useState('user');
    const [selectedImage, setSelectedImage] = useState(null);
    const [category, setCategory] = useState('user');

    const handlePhotoFromGallery = () => {
        launchImageLibrary({}, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setSelectedImage(response);
            }                
        });
    };

    const handlePhotoFromCamera = () => {
        launchCamera({}, response => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.error) {
                console.log('Camera Error: ', response.error);
            } else {
                setSelectedImage(response);
            }
        });
    };

    const saveProfile = () => {
        const profileData = {
            uid: user.uid,
            name,
            email: user.email,
            selectedImage,
            bio,
        };
        createOrUpdateProfile(profileData);
    };

    return (
        <View style={styles.container}>
            <SegmentedButtons
                value={category}
                onValueChange={setCategory}
                buttons={[
                    {value: 'user', label:'You'},
                    {value: 'pet', label:'Pet'},
                    {value: 'other', label:'Other'},
                ]}
            />
            <View style={styles.avatarContainer}>
                <Avatar.Image
                    size={150}
                    source={selectedImage ? { uri: selectedImage.uri } : require('../../assets/images/default-avatar.jpg')}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button onPress={handlePhotoFromGallery}>Choose Photo</Button>
                <Button onPress={handlePhotoFromCamera}>Take Photo</Button>
            </View>
            {category === 'user' && (
                <View style={styles.inputContainer}>
                    <TextInput
                        label="Name"
                        value={name}
                        onChangeText={text => setName(text)}
                        style={styles.input}
                    />
                    <TextInput
                        label="Bio"
                        value={bio}
                        onChangeText={text => setBio(text)}
                        style={styles.input}
                    />
                </View>
            )}            
            
            
            <Button mode="contained" onPress={saveProfile} style={styles.button}>
                Save Profile
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    input: {
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        margin: 10,
    },
    button: {
        marginTop: 20,
    },
});


export default Profile;