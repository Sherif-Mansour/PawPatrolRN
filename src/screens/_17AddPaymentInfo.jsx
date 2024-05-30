import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [creditCardInfo, setCreditCardInfo] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    address: '',
  });
  const [paypalInfo, setPaypalInfo] = useState({
    email: '',
    password: '',
  });
  const [bankTransferInfo, setBankTransferInfo] = useState({
    accountNumber: '',
    bankName: '',
    transitNumber: '',
    institutionNumber: '',
  });
  const [errors, setErrors] = useState({});

  const validateCreditCardInfo = () => {
    let valid = true;
    let errors = {};

    if (!creditCardInfo.nameOnCard) {
      errors.nameOnCard = 'Name on card is required';
      valid = false;
    }
    if (!creditCardInfo.cardNumber || !/^\d{16}$/.test(creditCardInfo.cardNumber)) {
      errors.cardNumber = 'Valid card number is required (16 digits)';
      valid = false;
    }
    if (!creditCardInfo.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(creditCardInfo.expiryDate)) {
      errors.expiryDate = 'Valid expiry date is required (MM/YY)';
      valid = false;
    }
    if (!creditCardInfo.cvv || !/^\d{3,4}$/.test(creditCardInfo.cvv)) {
      errors.cvv = 'Valid CVV is required (3 digits)';
      valid = false;
    }
    if (!creditCardInfo.address) {
      errors.address = 'Address is required';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSave = async () => {
    let paymentDetails;
    let valid = true;

    switch (paymentMethod) {
      case 'creditCard':
        paymentDetails = creditCardInfo;
        valid = validateCreditCardInfo();
        break;
      case 'paypal':
        paymentDetails = paypalInfo;
        break;
      case 'bankTransfer':
        paymentDetails = bankTransferInfo;
        break;
      default:
        return;
    }

    if (!valid) {
      return;
    }

    try {
      await firestore().collection('paymentMethods').doc('cardDetails').set({
        paymentMethod,
        ...paymentDetails,
      });
      console.log('Payment details saved to Firebase:', paymentDetails);
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'creditCard':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name On The Card"
              value={creditCardInfo.nameOnCard}
              onChangeText={(text) => setCreditCardInfo({ ...creditCardInfo, nameOnCard: text })}
            />
            {errors.nameOnCard && <Text style={styles.errorText}>{errors.nameOnCard}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              value={creditCardInfo.cardNumber}
              onChangeText={(text) => setCreditCardInfo({ ...creditCardInfo, cardNumber: text })}
              keyboardType="numeric"
            />
            {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Expiry Date (MM/YY)"
              value={creditCardInfo.expiryDate}
              onChangeText={(text) => setCreditCardInfo({ ...creditCardInfo, expiryDate: text })}
            />
            {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
            <TextInput
              style={styles.input}
              placeholder="CVV"
              value={creditCardInfo.cvv}
              onChangeText={(text) => setCreditCardInfo({ ...creditCardInfo, cvv: text })}
              keyboardType="numeric"
            />
            {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={creditCardInfo.address}
              onChangeText={(text) => setCreditCardInfo({ ...creditCardInfo, address: text })}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </>
        );
      case 'paypal':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="PayPal Email"
              value={paypalInfo.email}
              onChangeText={(text) => setPaypalInfo({ ...paypalInfo, email: text })}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="PayPal Password"
              value={paypalInfo.password}
              onChangeText={(text) => setPaypalInfo({ ...paypalInfo, password: text })}
              secureTextEntry={true}
            />
          </>
        );
      case 'bankTransfer':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Account Number"
              value={bankTransferInfo.accountNumber}
              onChangeText={(text) => setBankTransferInfo({ ...bankTransferInfo, accountNumber: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Bank Name"
              value={bankTransferInfo.bankName}
              onChangeText={(text) => setBankTransferInfo({ ...bankTransferInfo, bankName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Transit Number"
              value={bankTransferInfo.transitNumber}
              onChangeText={(text) => setBankTransferInfo({ ...bankTransferInfo, transitNumber: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Institution Number"
              value={bankTransferInfo.institutionNumber}
              onChangeText={(text) => setBankTransferInfo({ ...bankTransferInfo, institutionNumber: text })}
              keyboardType="numeric"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Payment Method</Text>
      <View style={styles.buttonGroup}>
        <Button title="Credit Card" onPress={() => setPaymentMethod('creditCard')} />
        <Button title="PayPal" onPress={() => setPaymentMethod('paypal')} />
        <Button title="Bank Transfer" onPress={() => setPaymentMethod('bankTransfer')} />
      </View>
      {renderPaymentForm()}
      <Button title="Save Payment Method" onPress={handleSave} />
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
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
});

export default PaymentForm;
