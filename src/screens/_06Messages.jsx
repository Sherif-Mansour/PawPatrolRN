import { View } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Avatar, Card, Divider, IconButton } from 'react-native-paper';

// https://callstack.github.io/react-native-paper/docs/components/Divider#usage

// https://callstack.github.io/react-native-paper/docs/components/Card/

const Messages = () => {

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{ width: '100%', padding: 15 }}>
          <Card>
            <Card.Title
              title="Chat Name"
              subtitle="Card Content"
              left={(props) => <Avatar.Icon {...props} icon="chat" />}
              right={(props) => <IconButton {...props} icon="arrow-right-thick" />}
            />
          </Card>
        </View>
        <View style={{ width: '100%', paddingHorizontal: 15 }}>
          <Divider style={{ height: 2 }} />
        </View>
        <View style={{ width: '100%', padding: 15 }}>
          <Card>
            <Card.Title
              title="Chat Name"
              subtitle="Card Content"
              left={(props) => <Avatar.Icon {...props} icon="chat" />}
              right={(props) => <IconButton {...props} icon="arrow-right-thick" />}
            />
          </Card>
        </View>
      </View>
    </SafeAreaProvider>
  )
}

export default Messages