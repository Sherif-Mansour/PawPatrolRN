import * as React from 'react';
import { Appbar } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { Image } from 'react-native';

// https://callstack.github.io/react-native-paper/docs/components/Appbar/

const AppHeader = () => {
  const theme = useTheme();
  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
      <Appbar.BackAction color={theme.colors.onPrimary} onPress={() => {}} />
      {/* ChatGPT: 'Is it possible to use AppBar.Content title with an image?' */}
      <Appbar.Content title={<Image source={require('../assets/images/PetPalLogo.png')} style={{ width: 150, height: 40 }} resizeMode='contain' />} />
      <Appbar.Action icon="account-circle" size={36} color={theme.colors.onPrimary} onPress={() => {}} />
    </Appbar.Header>
  );
};

export default AppHeader;