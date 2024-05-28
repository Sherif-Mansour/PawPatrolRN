import { View, Text } from 'react-native';
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MySearchBar from '../../components/MySearchBar';

const HomeScreen = () => {
  return (
    <SafeAreaProvider>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', borderWidth: 1, borderColor: 'black'}}>
        <View style={{width: '30%'}}>
          <Text>This is a placeholder</Text>
        </View>
          <MySearchBar />
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'black'}}>
        <Text>This is a placeholder</Text>
      </View>
    </SafeAreaProvider>
  )
}

export default HomeScreen