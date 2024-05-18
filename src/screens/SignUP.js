import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../configuration/firebase';

export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { userLoading } = useSelector(state => state.user); // Assuming you have useSelector imported from react-redux
    const dispatch = useDispatch(); // Assuming you have useDispatch imported from react-redux

    const handleSubmit = async () => {
        if (email && password) {
            try {
                dispatch(setUserLoading(true)); // Assuming setUserLoading action is imported and dispatched
                await createUserWithEmailAndPassword(auth, email, password);
                dispatch(setUserLoading(false));
            } catch (e) {
                dispatch(setUserLoading(false));
                Snackbar.show({
                    text: e.message,
                    backgroundColor: 'red'
                });
            }
        } else {
            Snackbar.show({
                text: 'Email and Password are required!',
                backgroundColor: 'red'
            });
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Sign Up</Text>

            <View style={{ marginBottom: 16 }}>
                <Text>Email</Text>
                <TextInput
                    value={email}
                    onChangeText={value => setEmail(value)}
                    style={{ padding: 8, borderWidth: 1, borderRadius: 8, marginBottom: 12 }}
                />
            </View>

            <View style={{ marginBottom: 16 }}>
                <Text>New Password</Text>
                <TextInput
                    value={password}
                    secureTextEntry
                    onChangeText={value => setPassword(value)}
                    style={{ padding: 8, borderWidth: 1, borderRadius: 8, marginBottom: 12 }}
                />
            </View>

            <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: 'blue', padding: 12, borderRadius: 8 }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                    {userLoading ? 'Loading...' : 'Sign Up'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
