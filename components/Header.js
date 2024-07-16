/* eslint-disable prettier/prettier */
import * as React from 'react';
import {Appbar} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// https://callstack.github.io/react-native-paper/docs/components/Appbar/

const AppHeader = ({showBackButton}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Appbar.Header style={{backgroundColor: theme.colors.primary }}>
      {showBackButton && (
        <Appbar.BackAction
          color={theme.colors.onPrimary}
          onPress={() => navigation.goBack()}
        />
      )}
      {/* ChatGPT: 'Is it possible to use AppBar.Content title with an image?' */}
      <Appbar.Content
        title={
          <Image
            source={require('../assets/images/PetPalLogo.png')}
            style={{width: 150, height: 40}}
            resizeMode="contain"
          />
        }
      />
      <Appbar.Action
        icon="cog"
        size={36}
        color={theme.colors.onPrimary}
        onPress={() => navigation.navigate('Account')}
      />
    </Appbar.Header>
  );
};

export default AppHeader;
