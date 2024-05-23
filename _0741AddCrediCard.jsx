// screens/AddCreditCardScreen.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';

const AddCreditCardScreen = () => {
  const [cardData, setCardData] = useState(null);

  const onChange = (formData) => {
    setCardData(formData);
  };

  const handleAddCard = () => {
    if (cardData && cardData.valid) {
      Alert.alert('Card Added', 'Your card has been successfully added!');
      // Here, you can also add code to save the card information to your backend or payment gateway
    } else {
      Alert.alert('Invalid Card', 'Please enter valid card details.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Credit Card</Text>
      <CreditCardInput onChange={onChange} />
      <TouchableOpacity style={styles.button} onPress={handleAddCard}>
        <Text style={styles.buttonText}>Add Card</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddCreditCardScreen;
