import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useUser} from '../../utils/UserContext';

const Ad = ({ route }) => {
  const {createOrUpdateAd} = useUser();
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pictures, setPictures] = useState([]);
  const [services, setServices] = useState([]);
  const [address, setAddress] = useState('');
  const adId = route.params?.ad?.id;

  useEffect(() => {
    if (route.params?.ad) {
      const { title, description, pictures, services, address } = route.params.ad;
      setTitle(title);
      setDescription(description);
      setPictures(pictures);
      setServices(services);
      setAddress(address);
    }
  }, [route.params?.ad]);

  const saveAd = async () => {
    if (title && description && address && services.length > 0) {
      const adData = {
        id: adId,
        title,
        description,
        pictures,
        services,
        address,
      };
      try {
        await createOrUpdateAd(adData);
        Alert.alert('Success', 'Your ad has been saved successfully');
        navigation.navigate('Home'); // Navigate back to the home screen
      } catch (error) {
        Alert.alert('Error', 'There was an error saving your ad');
        console.error('Error saving ad:', error);
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Text style={styles.label}>Pictures (URLs)</Text>
        <TextInput
          style={styles.input}
          value={pictures.join('\n')}
          onChangeText={text => setPictures(text.split('\n'))}
          multiline
        />
        <Text style={styles.label}>Services Offered & Prices</Text>
        <TextInput
          style={styles.input}
          value={services.join('\n')}
          onChangeText={text => setServices(text.split('\n'))}
          multiline
        />
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />
        <Button
          mode="contained"
          buttonColor="#FFBF5D"
          contentStyle={{width: '100%'}}
          onPress={saveAd}>
          Save Ad
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputsContainer: {
    backgroundColor: '#003d4d',
    padding: 20,
    margin: 20,
    marginTop: 50,
    borderRadius: 10,
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default Ad;
