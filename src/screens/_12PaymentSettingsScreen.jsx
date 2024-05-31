// screens/PaymentSettingsScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const paymentMethods = [
  { id: '1', method: 'Credit Card' },
  { id: '2', method: 'PayPal' },
  { id: '3', method: 'Bank Transfer' },
];


const PaymentSettingsScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={()=> navigation.navigate("PaymentForm")} style={styles.paymentMethod}>
      <Text>{item.method}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Settings</Text>
      <FlatList
        data={paymentMethods}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddCreditCard')}
      >
        <Text style={styles.buttonText}>Add Payment Method</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Add Payment Method</Text>
      </TouchableOpacity>

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
  paymentMethod: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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

export default PaymentSettingsScreen;
