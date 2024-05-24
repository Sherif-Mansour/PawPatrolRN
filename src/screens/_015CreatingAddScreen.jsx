import React, { useState } from 'react';
import { View, Text, TextInput,  StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';

const AddAdScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation();

  const handleAddAd = () => {
    if (title && description) {
      const newAd = {
        id: Date.now().toString(), // Unique ID for each ad
        title,
        description,
      };
      navigation.navigate('Home', { newAd }); // Navigate back to Home and pass newAd
    } else {
      // Handle error if title or description is empty
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
      /><Button
      mode="contained"
      buttonColor="#FFBF5D"
      contentStyle={{width: '100%'}}
      onPress={() => navigation.navigate('SignIn')}>
      Add Ad
    </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputsContainer: {
    backgroundColor: 'rgba(0, 31, 38, 0.5)',
    padding: 20,
    margin: 20,
    marginTop: 50,
    borderRadius: 10,
  }, 
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    color: 'white',
  },
  textDontHave: {
    color: 'white',
  },
});


export default AddAdScreen;
