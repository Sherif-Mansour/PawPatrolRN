import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../../components/screenWrapper'
import { colors } from '../../theme'

import BackButton from '../../components/backButton'
import { useNavigation } from '@react-navigation/native'
import Snackbar from 'react-native-snackbar';



export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState(''); 
    const [phone, setPhone] = useState('');


    const navigation = useNavigation();

    const handleSubmit = async ()=>{
        if(email && password && fname && lname && phone){
            // good to go
            navigation.goBack();
            navigation.navigate('Home');
            
        }else{
            // show error
            Snackbar.show({
                text: 'Email and Password are required!',
                backgroundColor: 'red'
            });
        }
    }
    return (
        <ScreenWrapper>
            <View className="flex justify-between h-full mx-4 ">
                <View>
                    <View>
                        <View>
                            <BackButton />
                        </View>
                        <Text>Sign Up</Text>
                    </View>
                    <Text>Enter First Name</Text>
                    <TextInput value={fname} onChangeText={value=> setFname(value)} className="p-4 bg-white rounded-full mb-3" />
                    <Text>Enter Last Name</Text>
                    <TextInput value={lname} onChangeText={value=> setLname(value)} className="p-4 bg-white rounded-full mb-3" />
                    <Text>Enter Phone Number</Text>
                    <TextInput value={phone} onChangeText={value=> setPhone(value)} className="p-4 bg-white rounded-full mb-3" />
                    <Text>Enter Email</Text>
                    <TextInput value={email} onChangeText={value=> setEmail(value)} className="p-4 bg-white rounded-full mb-3" />
                    <Text>Enter Password</Text>
                    <TextInput value={password} secureTextEntry onChangeText={value=> setPassword(value)} className="p-4 bg-white rounded-full mb-3" />
                    </View>
                <View>

                </View>
                <View>
            {
              
                    <TouchableOpacity onPress={handleSubmit} style={{backgroundColor: colors.button}} className="my-6 rounded-full p-3 shadow-sm mx-2">
                        <Text className="text-center text-white text-lg font-bold">Sign Up</Text>
                    </TouchableOpacity>
                
            }
            
        </View>
            </View>
        </ScreenWrapper>
    )
}