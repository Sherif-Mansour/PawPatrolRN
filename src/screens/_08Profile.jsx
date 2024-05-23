import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import AppHeader from '../../components/Header';
import { useRoute } from '@react-navigation/native';
import { useUser } from '../../utils/UserContext';
import firestore from '@react-native-firebase/firestore';

const ProfileScreen = () => {
    const route = useRoute();
    const { mode } = route.params || { mode: 'create' };
    const { user } = useUser();

    const [name, setName] = useState('');
    const [email, setEmail] = useState(user ? user.email : '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && user) {
            const fetchProfile = async () => {
                setLoading(true);
                const docRef = firestore().collection('users').doc(user.uid);
                const docSnap = await docRef.get();

                if (docSnap.exists) {
                    const profileData = docSnap.data();
                    setName(profileData.name);
                }
                setLoading(false);
            };

            fetchProfile();
        }
    }, [mode, user]);

    const handleSave = async () => {
        if (!user) {
            Alert('User not logged in');
            return;
        }

        setLoading(true);
        const userProfile = { name, email };
        try {
            await firestore().collection('users').doc(user.uid).set(userProfile, { merge: true });
            Alert('Profile saved successfully');
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Failed to save profile');
        }
        setLoading(false);
    };

    return (
        <View style={{flex: 1}}>
            <AppHeader />
            <View style={{ flex: 1, padding: 16 }}>
                {loading && <ActivityIndicator size="large" color="#0000ff" />}
                {!loading && (
                    <>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                        />
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                        />
                        <Button title="Save Profile" onPress={handleSave} />
                    </>
                )}
            </View>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    label: {
      fontSize: 16,
      marginVertical: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      borderRadius: 4,
      marginBottom: 16,
    },
});