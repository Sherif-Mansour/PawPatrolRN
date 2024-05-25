import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import {Button} from 'react-native-paper';
import {useUser} from '../../utils/UserContext';
import {useNavigation} from '@react-navigation/native';

const Ad = () => {
  const {createOrUpdateAd} = useUser();
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pictures, setPictures] = useState([]);
  const [services, setServices] = useState([]);
  const [address, setAddress] = useState('');

  const saveAd = async () => {
    if (title && description && address && services.length > 0) {
      const adData = {
        id: null,
        title,
        description,
        pictures,
        services,
        address,
      };
      try {
        await createOrUpdateAd(adData);
        Alert.alert('Success', 'Your ad has been added successfully');
        navigation.navigate('Home'); // Navigate back to the home screen
      } catch (error) {
        Alert.alert('Error', 'There was an error adding your ad');
        console.error('Error adding ad:', error);
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
          Add Ad
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
