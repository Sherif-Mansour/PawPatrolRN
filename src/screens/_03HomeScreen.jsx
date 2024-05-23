import { View, Text } from 'react-native';
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppHeader from '../../components/Header';

const HomeScreen = () => {
  return (
    <SafeAreaProvider>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'black'}}>
        <Text>This is a placeholder</Text>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'black'}}>
        <Text>This is a placeholder</Text>
      </View>
    </SafeAreaProvider>
  )
}

export default HomeScreen