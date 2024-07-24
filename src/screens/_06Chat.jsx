import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createGroupChannelListFragment } from '@sendbird/uikit-react-native';
import { useTheme } from 'react-native-paper';
import { Text } from 'react-native-paper';

const CustomHeader = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.background, // Example: Setting background color
        padding: 10,
      }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}>
        Chats
      </Text>
    </View>
  );
};

const GroupChannelListFragment = createGroupChannelListFragment({
  Header: CustomHeader,
});

const ChatScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <GroupChannelListFragment
        onPressChannel={(channel) => {
          navigation.navigate('IndividualChat', { channelUrl: channel.url });
        }}
        theme={{ // Pass theme to GroupChannelListFragment
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            text: theme.colors.text,
            // Add more as needed based on your theme
          },
        }}
      />
    </View>
  );
};

export default ChatScreen;
