import React from 'react';
import {View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createGroupChannelListFragment} from '@sendbird/uikit-react-native';
import {useTheme} from '@react-navigation/native';

const CustomHeader = props => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: colors.text,
          marginBottom: 20,
        }}>
        Chats
      </Text>
      {/* No create channel button */}
    </View>
  );
};

const GroupChannelListFragment = createGroupChannelListFragment({
  Header: CustomHeader,
});

const ChatScreen = () => {
  const navigation = useNavigation();

  return (
    <GroupChannelListFragment
      onPressChannel={channel => {
        navigation.navigate('IndividualChat', {channelUrl: channel.url});
      }}
    />
  );
};

export default ChatScreen;
