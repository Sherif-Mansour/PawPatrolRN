// screens/PrivacySettingsScreen.js

import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const PrivacySettingsScreen = () => {
  const [isPublicProfile, setIsPublicProfile] = useState(false);
  const [shareDataWithThirdParties, setShareDataWithThirdParties] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy Settings</Text>
      <View style={styles.setting}>
        <Text>Public Profile</Text>
        <Switch
          value={isPublicProfile}
          onValueChange={setIsPublicProfile}
        />
      </View>
      <View style={styles.setting}>
        <Text>Share Data with Third Parties</Text>
        <Switch
          value={shareDataWithThirdParties}
          onValueChange={setShareDataWithThirdParties}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default PrivacySettingsScreen;
