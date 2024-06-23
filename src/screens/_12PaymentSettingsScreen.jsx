import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import {useUser} from '../../utils/UserContext';
import {
  useTheme,
  Text,
  TextInput,
  Button,
  Card,
  RadioButton,
  IconButton,
} from 'react-native-paper';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const PaymentSettingsScreen = ({navigation}) => {
  const theme = useTheme();
  const {
    savePaymentDetails,
    paymentMethods,
    fetchPaymentMethods,
    selectedPaymentMethod,
    setPreferredMethod,
    editPaymentDetails,
    deletePaymentMethod,
  } = useUser();
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [editingIndex, setEditingIndex] = useState(null); // Index of the payment method being edited

  useEffect(() => {
    fetchPaymentMethods();
    console.log('Called fetchPaymentMethods');
  }, []);

  useEffect(() => {
    console.log('Payment Methods:', paymentMethods);
  }, [paymentMethods]);

  const onSavePress = async () => {
    if (!cardNumber || !expiryDate || !cvv || !postalCode || !billingAddress) {
      Alert.alert('Incomplete Details', 'Please fill in all card details.');
      return;
    }

    if (cardNumber.replace(/\s+/g, '').length !== 16) {
      Alert.alert('Invalid Card Number', 'Card number must be 16 digits.');
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      Alert.alert(
        'Invalid Expiry Date',
        'Expiry date must be in MM/YY format.',
      );
      return;
    }

    if (cvv.length < 3 || cvv.length > 4) {
      Alert.alert('Invalid CVV', 'CVV must be 3 or 4 digits.');
      return;
    }

    const paymentDetails = {
      nameOnCard,
      cardNumber: cardNumber.replace(/\s+/g, ''), // Remove spaces before saving
      expiryDate,
      cvv,
      postalCode,
      billingAddress,
    };

    try {
      if (editingIndex !== null) {
        await editPaymentDetails(editingIndex, paymentDetails);
        setEditingIndex(null); // Clear the editing state
      } else {
        await savePaymentDetails(paymentDetails);
      }
      setNameOnCard('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setPostalCode('');
      setBillingAddress('');
      Alert.alert('Success', 'Payment method saved successfully');
    } catch (error) {
      Alert.alert(
        'Payment Error',
        'There was an issue saving your payment details. Please try again.',
      );
    }
  };

  const formatCardNumber = number => {
    return number
      .replace(/\s?/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const handleCardNumberChange = text => {
    const formattedText = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (formattedText.length <= 16) {
      setCardNumber(formatCardNumber(formattedText));
    }
  };

  const handleExpiryDateChange = text => {
    const formattedText = text.replace(/[^0-9/]/g, ''); // Remove non-numeric and non-slash characters
    if (formattedText.length <= 5) {
      setExpiryDate(formattedText);
    }
  };

  const handleCvvChange = text => {
    const formattedText = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (formattedText.length <= 4) {
      setCvv(formattedText);
    }
  };

  const handlePostalCodeChange = text => {
    const formattedText = text.replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric characters
    setPostalCode(formattedText);
  };

  const handleEdit = index => {
    const paymentMethod = paymentMethods[index];
    setNameOnCard(paymentMethod.nameOnCard);
    setCardNumber(formatCardNumber(paymentMethod.cardNumber));
    setExpiryDate(paymentMethod.expiryDate);
    setCvv(paymentMethod.cvv);
    setPostalCode(paymentMethod.postalCode);
    setBillingAddress(paymentMethod.billingAddress);
    setEditingIndex(index);
  };

  const handleDelete = async index => {
    try {
      await deletePaymentMethod(index);
      Alert.alert('Success', 'Payment method deleted successfully');
    } catch (error) {
      Alert.alert(
        'Delete Error',
        'There was an issue deleting your payment method. Please try again.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          Payment Settings
        </Text>
        <View style={styles.autocompleteContainer}>
          <GooglePlacesAutocomplete
            placeholder="Enter Billing Address"
            onPress={(data, details = null) => {
              setBillingAddress(data.description);
            }}
            query={{
              key: 'AIzaSyBMmlNExl86zceWTM0vfYKEkY1HJ-neIWk',
              language: 'en',
            }}
            styles={{
              textInput: styles.input,
              container: {
                flex: 0,
              },
              listView: {
                position: 'absolute',
                top: 50,
                zIndex: 1,
              },
            }}
          />
        </View>
        <TextInput
          label="Name on Card"
          value={nameOnCard}
          onChangeText={text => setNameOnCard(text)}
          style={styles.input}
        />
        <TextInput
          label="Card Number"
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          keyboardType="numeric"
          placeholder="4242 4242 4242 4242"
          style={styles.input}
        />
        <View style={styles.row}>
          <TextInput
            label="Expiry Date (MM/YY)"
            value={expiryDate}
            onChangeText={handleExpiryDateChange}
            keyboardType="numeric"
            placeholder="MM/YY"
            style={[styles.input, styles.inputRow]}
          />
          <TextInput
            label="CVV"
            value={cvv}
            onChangeText={handleCvvChange}
            keyboardType="numeric"
            placeholder="CVC"
            style={[styles.input, styles.inputRow]}
          />
          <TextInput
            label="Postal Code"
            value={postalCode}
            onChangeText={handlePostalCodeChange}
            style={[styles.input, styles.inputRow]}
          />
        </View>
        <Button mode="contained" onPress={onSavePress} style={styles.button}>
          Save Payment Method
        </Button>
        <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
        <FlatList
          data={paymentMethods}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <Card style={styles.card}>
              <Card.Title
                title={item.nameOnCard}
                right={props => (
                  <View style={styles.cardActions}>
                    <RadioButton
                      {...props}
                      value={index}
                      status={
                        selectedPaymentMethod === index
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() => setPreferredMethod(index)}
                    />
                    <IconButton
                      {...props}
                      icon="pencil"
                      onPress={() => handleEdit(index)}
                    />
                    <IconButton
                      {...props}
                      icon="delete"
                      onPress={() => handleDelete(index)}
                    />
                  </View>
                )}
              />
              <Card.Content>
                <Text>
                  Card Number: **** **** **** {item.cardNumber.slice(-4)}
                </Text>
                <Text>Expiry Date: {item.expiryDate}</Text>
                <Text>Billing Address: {item.billingAddress}</Text>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    </KeyboardAvoidingView>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  autocompleteContainer: {
    zIndex: 1,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputRow: {
    flex: 1,
    marginRight: 10,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
  },
  card: {
    marginBottom: 15,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PaymentSettingsScreen;
