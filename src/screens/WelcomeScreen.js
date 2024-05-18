import { View, Text} from 'react-native';
import { TouchableOpacity } from 'react-native';
import React from 'react';
import ScreenWrapper from '../../components/screenWrapper';
import { colors } from '../../theme';
import { useNavigation } from '@react-navigation/native';



export default function WelcomeScreen() {
    const navigation = useNavigation();


    return (
        <ScreenWrapper>
            <View>
                <View></View>
                <View>
                    <Text>Pet Pal</Text>
                    <TouchableOpacity onPress={()=> navigation.navigate('SignIn')}>
                        <Text>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> navigation.navigate('SignUp')}>
                        <Text>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
}
