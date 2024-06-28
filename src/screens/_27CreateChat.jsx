import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  createGroupChannelCreateFragment,
  useSendbirdChat,
} from '@sendbird/uikit-react-native';
import {useUser} from '../../utils/UserContext';
import {Text, View} from 'react-native';

const GroupChannelCreateFragment = createGroupChannelCreateFragment();

const CreateChatScreen = () => {
  const {currentUser} = useSendbirdChat();
  const {fetchChatUserProfile} = useUser();
  const navigation = useNavigation();
  const route = useRoute();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const adUserId = route.params.adUserId;
        const adUserProfile = await fetchChatUserProfile(adUserId);

        if (!adUserProfile) {
          console.error('Failed to fetch ad user profile');
          return;
        }

        const userList = [adUserProfile];
        setUsers(userList);
        console.log('Custom user query executed with users:', userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [route.params.adUserId, fetchChatUserProfile]);

  const handleCreateChannel = async selectedUsers => {
    try {
      const userIds = selectedUsers.map(u => u.userId);
      const params = {invitedUserIds: userIds, name: 'New Channel'};
      const channel = await GroupChannelModule.createChannel(params);
      navigation.navigate('IndividualChat', {channelUrl: channel.url});
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <GroupChannelCreateFragment
      onPressHeaderLeft={() => navigation.goBack()}
      onCreateChannel={handleCreateChannel}
      queryCreator={() => {
        return {
          next: async () => {
            console.log('Querying users:', users);
            return {users, hasNext: false}; // return users and hasNext
          },
        };
      }}
    />
  );
};

export default CreateChatScreen;
