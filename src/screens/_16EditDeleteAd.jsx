import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useUser} from '../../utils/UserContext';
import {useTheme, Card, Button} from 'react-native-paper';

const EditDeleteAd = ({navigation}) => {
  const theme = useTheme();
  const {user, ads, fetchUserAds, deleteAd, loadingUserAds, setCurrentAd} =
    useUser();

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

  const handleEditAd = ad => {
    setCurrentAd(ad); // Set the current ad in the context
    navigation.navigate('Ad'); // Navigate to the Ad screen
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handleEditAd(item)}>
      <Card style={styles.adContainer}>
        {item.picture ? (
          <Card.Cover source={{uri: item.picture}} style={styles.adImage} />
        ) : (
          <Image
            source={require('../../assets/images/OIP.jpeg')}
            style={styles.adImage}
          />
        )}
        <Card.Title
          titleStyle={styles.adTitle}
          title={item.title}
          subtitle={`Category: ${item.category}`}
          subtitleStyle={styles.adTitle}
        />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.adContent}>
            {item.description}
          </Text>
        </Card.Content>
        <View style={styles.buttonsContainer}>
          <Button
            mode="contained"
            style={styles.editButton}
            onPress={() => handleEditAd(item)}>
            Edit
          </Button>
          <Button
            mode="contained"
            style={styles.deleteButton}
            onPress={() => handleDeleteAd(item.id)}>
            Delete
          </Button>
        </View>
      </Card>
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
    adImage: {
      height: 200,
      width: '90%',
      alignSelf: 'center',
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
