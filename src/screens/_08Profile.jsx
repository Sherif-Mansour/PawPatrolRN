import React, { useState } from 'react';
import { View, StyleSheet} from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { useUser } from '../../utils/UserContext';

const Profile = () => {
    const { user, createOrUpdateProfile } = useUser();
    const [name, setName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [bio, setBio] = useState('');

    const saveProfile = () => {
        const profileData = {
            uid: user.uid,
            name,
            email: user.email,
            photoURL,
            bio,
        };
        createOrUpdateProfile(profileData);
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Name"
                value={name}
                onChangeText={text => setName(text)}
                style={styles.input}
            />
            <TextInput
                label="Photo URL"
                value={photoURL}
                onChangeText={text => setPhotoURL(text)}
                style={styles.input}
            />
            <TextInput
                label="Bio"
                value={bio}
                onChangeText={text => setBio(text)}
                style={styles.input}
            />
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
    button: {
        marginTop: 20,
    },
});


export default Profile;