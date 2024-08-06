import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

const ChatSettings = ({navigation, route}) => {
  const {channelUrl} = route.params;

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        buttonColor="#009B7D"
        style={styles.button}
        onPress={() => navigation.navigate('BookRequest', {channelUrl})}>
        Place Request
      </Button>
      <Button
        mode="contained"
        buttonColor="#FFBF5D"
        style={styles.button}
        onPress={() => navigation.navigate('PendingApprovals', {channelUrl})}>
        Pending Approvals
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  button: {
    marginVertical: 10,
  },
});

export default ChatSettings;
