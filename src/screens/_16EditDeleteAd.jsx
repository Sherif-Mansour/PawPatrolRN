import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useUser} from '../../utils/UserContext';
import {useTheme} from 'react-native-paper';

const EditDeleteAd = ({navigation}) => {
  const theme = useTheme();
  const {user, ads, fetchUserAds, deleteAd, loadingUserAds} = useUser();

  useEffect(() => {
    if (user) {
      fetchUserAds();
    }
  }, [user]);

  const handleDeleteAd = async adId => {
    Alert.alert('Delete Ad', 'Are you sure you want to delete this ad?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteAd(adId),
      },
    ]);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.adContainer}
      onPress={() => navigation.navigate('Ad', {ad: item})}>
      <Text style={styles.adTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('Ad', {ad: item})}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDeleteAd(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: 'white',
    },
    adContainer: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.secondaryContainer,
      marginBottom: 10,
      padding: 20,
      borderRadius: 5,
      position: 'relative',
    },
    adTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      color: theme.colors.onPrimaryContainer,
    },
    adContent: {
      color: theme.colors.onPrimaryContainer,
      marginBottom: 10,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    editButton: {
      backgroundColor: '#009B7D',
      padding: 5,
      margin: 10,
      borderRadius: 20,
      width: '35%',
    },
    deleteButton: {
      backgroundColor: '#ff0000',
      padding: 5,
      margin: 10,
      borderRadius: 20,
      width: '35%',
    },
    buttonText: {
      color: '#ffffff',
      textAlign: 'center',
    },
    favoriteButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
  });

  if (loadingUserAds) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ads}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No ads found.</Text>}
      />
    </View>
  );
};

export default EditDeleteAd;

// read document from firebase for firestore security rules
// https://firebase.google.com/docs/firestore/security/rules-structure
