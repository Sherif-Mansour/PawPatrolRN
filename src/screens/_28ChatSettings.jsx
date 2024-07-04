import React from 'react';
import {View, Button, StyleSheet} from 'react-native';

const ChatSettings = ({navigation, route}) => {
  const {channelUrl} = route.params;

  return (
    <View style={styles.container}>
      <Button
        title="Place Request"
        onPress={() => navigation.navigate('BookRequest', {channelUrl})}
      />
      <Button
        title="Pending Approvals"
        onPress={() => navigation.navigate('PendingApprovals', {channelUrl})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default ChatSettings;
