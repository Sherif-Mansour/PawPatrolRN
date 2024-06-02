import {Image, View} from 'react-native';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Button, useTheme} from 'react-native-paper';

const SplashScreen = ({navigation}) => {
  const theme = useTheme();

  return (
    <SafeAreaProvider style={{backgroundColor: 'rgb(0, 104, 123)'}}>
      <View
        style={{flex: 3, justifyContent: 'space-evenly', alignItems: 'center'}}>
        <Image
          source={require('../../assets/images/PetPalLogo.png')}
          style={{width: '75%', height: '50%'}}
          resizeMode="contain"
        />
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{width: '72%', marginBottom: 6}}>
          <Button
            mode="contained"
            buttonColor="#009B7D"
            contentStyle={{width: '100%'}}
            onPress={() => navigation.navigate('SignUp')}>
            CREATE ACCOUNT
          </Button>
        </View>
        <View style={{width: '72%', marginTop: 6}}>
          <Button
            mode="contained"
            buttonColor="#FFBF5D"
            contentStyle={{width: '100%'}}
            onPress={() => navigation.navigate('SignIn')}>
            LOGIN
          </Button>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default SplashScreen;
