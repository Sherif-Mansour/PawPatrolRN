import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useUser} from '../../utils/UserContext';
import {launchImageLibrary} from 'react-native-image-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {FlatList} from 'react-native';

const categories = [
  'Grooming',
  'Walking',
  'Boarding',
  'Training',
  'Veterinary',
  'Sitting',
  'Pet Food',
  'Pet Toys',
  'Pet Accessories',
  'Pet Adoption',
  'Other',
];

const Ad = ({navigation, route}) => {
  const theme = useTheme();
  const {createOrUpdateAd, uploadImage} = useUser();
  const adId = route.params?.ad?.id;

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [pictures, setPictures] = useState([]);
  const [mainPicture, setMainPicture] = useState('');
  const [services, setServices] = useState([]);
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [serviceHours, setServiceHours] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isExpiryDatePickerVisible, setExpiryDatePickerVisibility] =
    useState(false);

  useEffect(() => {
    if (route.params?.ad) {
      const {
        title,
        price,
        description,
        pictures,
        mainPicture,
        services,
        address,
        category,
        serviceHours,
        expiryDate,
      } = route.params.ad;
      setTitle(title);
      setPrice(price);
      setDescription(description);
      setPictures(pictures);
      setMainPicture(mainPicture);
      setServices(services);
      setAddress(address);
      setCategory(category || categories[0]);
      setServiceHours(serviceHours);
      setExpiryDate(expiryDate || '');
    }
  }, [route.params?.ad]);

  const saveAd = async () => {
    const trimmedAddress = address.trim();

    if (title && price && trimmedAddress && services.length > 0 && category) {
      const adData = {
        id: adId,
        title,
        price,
        description,
        pictures,
        mainPicture,
        services,
        address: trimmedAddress,
        category,
        serviceHours,
        expiryDate,
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
      Alert.alert('Error', 'Please fill in all required fields');
    }
  };

  const handleSelectImage = () => {
    launchImageLibrary({}, async response => {
      if (response.assets && response.assets.length > 0) {
        const newPictures = [];
        for (const asset of response.assets) {
          const downloadUrl = await uploadImage(asset.uri);
          if (downloadUrl) {
            newPictures.push(downloadUrl);
          }
        }
        setPictures([...pictures, ...newPictures]);
        if (!mainPicture) setMainPicture(newPictures[0]);
      }
    });
  };

  const renderCategoryButtons = () => {
    return categories.map(cat => (
      <TouchableOpacity
        key={cat}
        style={[
          styles.categoryButton,
          category === cat ? styles.selectedCategoryButton : null,
        ]}
        onPress={() => setCategory(cat)}>
        <Text
          style={[
            styles.categoryButtonText,
            category === cat ? styles.selectedCategoryButtonText : null,
          ]}>
          {cat}
        </Text>
      </TouchableOpacity>
    ));
  };

  const showExpiryDatePicker = () => {
    setExpiryDatePickerVisibility(true);
  };

  const hideExpiryDatePicker = () => {
    setExpiryDatePickerVisibility(false);
  };

  const handleExpiryConfirm = (event, date) => {
    if (date) {
      setExpiryDate(date.toISOString().split('T')[0]);
    }
    hideExpiryDatePicker();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#FFF3D6',
    },
    inputsContainer: {
      backgroundColor: theme.colors.secondaryContainer,
      padding: 20,
      borderRadius: 10,
    },
    label: {
      color: 'black',
      marginBottom: 5,
    },
    requiredLabel: {
      color: 'black',
      marginBottom: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    requiredStar: {
      color: 'red',
    },
    input: {
      backgroundColor: 'white',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    },
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 10,
    },
    categoryButton: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 5,
      margin: 5,
    },
    selectedCategoryButton: {
      backgroundColor: '#0056b3',
    },
    categoryButtonText: {
      color: 'white',
    },
    selectedCategoryButtonText: {
      fontWeight: 'bold',
    },
    button: {
      marginBottom: 20,
      marginTop: 20,
    },
    image: {
      width: 100,
      height: 100,
      marginRight: 10,
      borderWidth: 2,
    },
    mainImage: {
      borderColor: 'green',
    },
    note: {
      color: 'black',
      fontSize: 12,
      marginBottom: 15,
    },
    selectButton: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 20,
      marginTop: 10,
    },
    selectButtonLabel: {
      color: theme.colors.primary,
    },
    expiryDateText: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 5,
      textAlign: 'center',
      marginTop: 10,
    },
    addressContainer: {
      marginBottom: 10,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: 'black',
      backgroundColor: theme.colors.secondaryContainer,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    labelContainer: {
      flex: 1,
      marginRight: 10,
    },
  });

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Post Listing Details:</Text>
          <View style={styles.inputsContainer}>
            <View style={styles.requiredLabel}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <View style={styles.categoriesContainer}>
              {renderCategoryButtons()}
            </View>
            <View style={styles.requiredLabel}>
              <Text style={styles.label}>Title</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              placeholder="Enter title"
            />
            <View style={styles.requiredLabel}>
              <Text style={styles.label}>Price</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="e.g. 50, TBD, Contact for more info"
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Enter description"
            />
            <View style={styles.requiredLabel}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <View style={styles.addressContainer}>
              <GooglePlacesAutocomplete
                placeholder="Search for an address"
                onPress={(data, details = null) => {
                  const fullAddress = details
                    ? details.formatted_address
                    : data.description;
                  setAddress(fullAddress);
                  console.log('Selected address:', fullAddress);
                }}
                query={{
                  key: 'AIzaSyDlNi1nl06y1rcUF00ogB5t0ZPrr0PKASg',
                  language: 'en',
                }}
                styles={{
                  textInput: styles.input,
                }}
                fetchDetails={true}
                textInputProps={{
                  value: address,
                  onChangeText: text => setAddress(text),
                }}
                debounce={200}
                enablePoweredByContainer={false}
                keyboardShouldPersistTaps="always"
              />
            </View>
            <View style={styles.rowContainer}>
              <Text style={[styles.label, styles.labelContainer]}>
                Pictures
              </Text>
              <Button
                onPress={handleSelectImage}
                style={styles.selectButton}
                labelStyle={styles.selectButtonLabel}>
                Select Pictures
              </Button>
            </View>
            <Text style={styles.note}>
              Tap an image to select it as the main picture:
            </Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {pictures.map((pic, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setMainPicture(pic)}>
                  <Image
                    source={{uri: pic}}
                    style={[
                      styles.image,
                      mainPicture === pic && styles.mainImage,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.requiredLabel}>
              <Text style={styles.label}>Services Offered & Prices</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              value={services.join('\n')}
              onChangeText={text => setServices(text.split('\n'))}
              multiline
              placeholder="Enter services and prices"
            />
            <Text style={styles.label}>Service Hours</Text>
            <TextInput
              style={styles.input}
              value={serviceHours}
              onChangeText={setServiceHours}
              placeholder="e.g. 9am - 5pm"
            />
            <View style={styles.rowContainer}>
              <Text style={[styles.label, styles.labelContainer]}>
                Listing Expiry Date
              </Text>
              <Button
                onPress={showExpiryDatePicker}
                style={styles.selectButton}
                labelStyle={styles.selectButtonLabel}>
                Select Expiry Date
              </Button>
            </View>
            {isExpiryDatePickerVisible && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={handleExpiryConfirm}
              />
            )}
            <TextInput
              style={[styles.input, styles.expiryDateText]}
              value={expiryDate}
              editable={false}
              placeholder="Selected Expiry Date"
            />
            <Button
              mode="contained"
              buttonColor="#FFBF5D"
              contentStyle={{width: '100%'}}
              onPress={saveAd}
              style={styles.button}>
              Save Ad
            </Button>
          </View>
        </>
      }
      data={[]}
      renderItem={null}
      keyExtractor={() => 'dummy-key'}
    />
  );
};

export default Ad;