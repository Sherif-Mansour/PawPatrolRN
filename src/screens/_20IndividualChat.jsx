import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useSendbirdChat,
  createGroupChannelFragment,
} from '@sendbird/uikit-react-native';
import { useGroupChannel } from '@sendbird/uikit-chat-hooks';

const GroupChannelFragment = createGroupChannelFragment();

const IndividualChatScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  const { sdk } = useSendbirdChat();
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <GroupChannelFragment
      channel={channel}
      onChannelDeleted={() => {
        navigation.navigate('Chat');
      }}
      onPressHeaderLeft={() => {
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        navigation.navigate('ChatSettings', { channelUrl: params.channelUrl });
      }}
    />
  );
};

export default IndividualChatScreen;
