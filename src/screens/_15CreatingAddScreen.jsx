import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';

const AddAdScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pictures, setPictures] = useState([]);
  const [services, setServices] = useState([]);
  const [address, setAddress] = useState('');
  const navigation = useNavigation();

  const handleAddAd = () => {
    if (title && description && address && services.length > 0) {
      const newAd = {
        id: Date.now().toString(), // Unique ID for each ad
        title,
        description,
        pictures,
        services,
        address,
      };
      navigation.navigate('Home', { newAd }); // Navigate back to Home and pass newAd
    } else {
      // Handle error if any required field is empty
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputsContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
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
          contentStyle={{ width: '100%' }}
          onPress={handleAddAd}>
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

export default AddAdScreen;
