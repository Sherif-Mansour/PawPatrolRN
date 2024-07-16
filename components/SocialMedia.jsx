import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';

const SocialMedia = ({onGooglePress, onFacebookPress}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onGooglePress}>
        <Image
          source={require('../assets/icons/google.png')}
          style={styles.image}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onFacebookPress}>
        <Image
          source={require('../assets/icons/facebook.png')}
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SocialMedia;

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
    borderRadius: 15,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    alignItems: 'center',
  },
});
