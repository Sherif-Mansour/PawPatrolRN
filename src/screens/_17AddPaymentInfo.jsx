import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useUser } from '../../utils/UserContext';
import { useTheme } from 'react-native-paper';
import { CardField, useStripe } from '@stripe/stripe-react-native';

const AddPaymentInfo = () => {
  const theme = useTheme();
  const { savePaymentDetails } = useUser();
  const stripe = useStripe();
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [creditCardInfo, setCreditCardInfo] = useState({});
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
    if (!creditCardInfo.complete) {
      Alert.alert('Please enter complete card details');
      return false;
    }
    return true;
  };

  const validatePaypalInfo = () => {
    if (!paypalInfo.email || !paypalInfo.password) {
      Alert.alert('Please enter complete PayPal details');
      return false;
    }
    return true;
  };

  const validateBankTransferInfo = () => {
    const { accountNumber, bankName, transitNumber, institutionNumber } = bankTransferInfo;
    if (!accountNumber || !bankName || !transitNumber || !institutionNumber) {
      Alert.alert('Please enter complete bank transfer details');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    let paymentDetails;
    let valid = true;

    switch (paymentMethod) {
      case 'creditCard':
        valid = validateCreditCardInfo();
        if (valid) {
          const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
            type: 'Card',
            card: creditCardInfo,
          });

          if (error) {
            Alert.alert(`Error: ${error.message}`);
            valid = false;
          } else {
            paymentDetails = { id: stripePaymentMethod.id, ...creditCardInfo };
          }
        }
        break;
      case 'paypal':
        valid = validatePaypalInfo();
        if (valid) {
          paymentDetails = paypalInfo;
          // Here you would integrate with PayPal SDK or API
        }
        break;
      case 'bankTransfer':
        valid = validateBankTransferInfo();
        if (valid) {
          paymentDetails = bankTransferInfo;
          // Here you would integrate with your backend to process the bank transfer
        }
        break;
      default:
        return;
    }

    if (!valid) {
      return;
    }

    await savePaymentDetails(paymentMethod, paymentDetails);
    Alert.alert('Payment method saved successfully');
  };

  const renderAddPaymentInfo = () => {
    switch (paymentMethod) {
      case 'creditCard':
        return (
          <CardField
            postalCodeEnabled={true}
            placeholders={{
              number: '4242 4242 4242 4242',
            }}
            cardStyle={styles.card}
            style={styles.cardContainer}
            onCardChange={cardDetails => {
              setCreditCardInfo(cardDetails);
            }}
          />
        );
      case 'paypal':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="PayPal Email"
              value={paypalInfo.email}
              onChangeText={text => setPaypalInfo({ ...paypalInfo, email: text })}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="PayPal Password"
              value={paypalInfo.password}
              onChangeText={text => setPaypalInfo({ ...paypalInfo, password: text })}
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
              onChangeText={text => setBankTransferInfo({ ...bankTransferInfo, accountNumber: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Bank Name"
              value={bankTransferInfo.bankName}
              onChangeText={text => setBankTransferInfo({ ...bankTransferInfo, bankName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Transit Number"
              value={bankTransferInfo.transitNumber}
              onChangeText={text => setBankTransferInfo({ ...bankTransferInfo, transitNumber: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Institution Number"
              value={bankTransferInfo.institutionNumber}
              onChangeText={text => setBankTransferInfo({ ...bankTransferInfo, institutionNumber: text })}
              keyboardType="numeric"
            />
          </>
        );
      default:
        return null;
    }
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
    cardContainer: {
      height: 50,
      marginVertical: 30,
    },
    card: {
      borderColor: '#000000',
      borderWidth: 1,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Payment Method</Text>
      <View style={styles.buttonGroup}>
        <Button
          title="Credit Card"
          onPress={() => setPaymentMethod('creditCard')}
        />
        <Button title="PayPal" onPress={() => setPaymentMethod('paypal')} />
        <Button
          title="Bank Transfer"
          onPress={() => setPaymentMethod('bankTransfer')}
        />
      </View>
      {renderAddPaymentInfo()}
      <Button title="Save Payment Method" onPress={handleSave} />
    </View>
  );
};

export default AddPaymentInfo;
