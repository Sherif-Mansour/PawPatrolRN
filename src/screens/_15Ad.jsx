import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
  Image,
  Share,
} from 'react-native';
import {Button, TextInput, useTheme, Text} from 'react-native-paper';
import {useUser} from '../../utils/UserContext';
import {launchImageLibrary} from 'react-native-image-picker';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

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

const Ad = ({navigation}) => {
  const theme = useTheme();
  const {
    user,
    createOrUpdateAd,
    uploadImage,
    currentAd,
    setCurrentAd,
    fetchUserProfile,
    isProfileComplete,
  } = useUser();

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
    if (currentAd) {
      setTitle(currentAd.title);
      setPrice(currentAd.price);
      setDescription(currentAd.description);
      setPictures(currentAd.pictures);
      setMainPicture(currentAd.mainPicture);
      setServices(currentAd.services);
      setAddress(currentAd.address);
      setCategory(currentAd.category || categories[0]);
      setServiceHours(currentAd.serviceHours);
      setExpiryDate(currentAd.expiryDate || '');
    } else {
      // Clear fields when currentAd is null
      setTitle('');
      setPrice('');
      setDescription('');
      setPictures([]);
      setMainPicture('');
      setServices([]);
      setAddress('');
      setCategory(categories[0]);
      setServiceHours('');
      setExpiryDate('');
    }
  }, [currentAd]);

  const saveAd = async () => {
    const trimmedAddress = address.trim();

    if (title && price && trimmedAddress && services.length > 0 && category) {
      try {
        const profileData = await fetchUserProfile();
        if (!isProfileComplete(profileData)) {
          Alert.alert(
            'Profile Incomplete',
            'Please complete your profile before posting an ad.',
            [
              {
                text: 'Go to Profile',
                onPress: () => navigation.navigate('Profile'),
              },
            ],
            {cancelable: false},
          );
          return;
        }

        const adData = {
          id: currentAd?.id,
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

        await createOrUpdateAd(adData);
        Alert.alert('Success', 'Your ad has been saved successfully');
        setCurrentAd(null); // Clear current ad after saving
        navigation.navigate('Home');
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

  const renderCategoryButtons = () =>
    categories.map(cat => (
      <Button
        key={cat}
        mode={category === cat ? 'contained' : 'outlined'}
        onPress={() => setCategory(cat)}
        style={styles.categoryButton}>
        {cat}
      </Button>
    ));

  const showExpiryDatePicker = () => {
    setExpiryDatePickerVisibility(true);
  };

  const hideExpiryDatePicker = () => {
    setExpiryDatePickerVisibility(false);
  };

  const handleExpiryConfirm = (event, selectedDate) => {
    if (selectedDate) {
      setExpiryDate(selectedDate.toISOString().split('T')[0]);
    }
    hideExpiryDatePicker();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    inputsContainer: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 10,
    },
    label: {
      color: theme.colors.text,
      marginBottom: 5,
    },
    requiredLabel: {
      color: theme.colors.text,
      marginBottom: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    requiredStar: {
      color: 'red',
    },
    input: {
      backgroundColor: theme.colors.background,
      marginBottom: 10,
    },
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 10,
    },
    categoryButton: {
      margin: 5,
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
      color: theme.colors.text,
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
      backgroundColor: theme.colors.background,
      padding: 10,
      borderRadius: 5,
      textAlign: 'center',
      marginTop: 10,
    },
    addressContainer: {
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 20,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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
            <TextInput label="Address" style={styles.input} editable={false} />
            <View style={styles.addressContainer}>
              <GooglePlacesAutocomplete
                placeholder="Enter Address here..."
                onPress={(data, details = null) => {
                  const fullAddress = details
                    ? details.formatted_address
                    : data.description;
                  setAddress(fullAddress);
                  console.log('Selected address:', fullAddress);
                }}
                query={{
                  key: 'AIzaSyBMmlNExl86zceWTM0vfYKEkY1HJ-neIWk',
                  language: 'en',
                }}
                styles={{
                  textInput: {
                    backgroundColor: theme.colors.background,
                    padding: 10,
                    borderRadius: 5,
                  },
                }}
                fetchDetails={true}
                textInputProps={{
                  value: address,
                  onChangeText: text => setAddress(text),
                }}
                debounce={200}
                enablePoweredByContainer={false}
                keyboardShouldPersistTaps="handled"
                listViewDisplayed="auto"
              />
            </View>
            <TextInput
              label="Pictures"
              style={styles.input}
              placeholder="Select Pictures"
              editable={false}
            />
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
            <Button
              onPress={handleSelectImage}
              style={styles.selectButton}
              labelStyle={styles.selectButtonLabel}>
              Select Pictures
            </Button>
            <TextInput label="Category" style={styles.input} editable={false} />
            <View style={styles.categoriesContainer}>
              {renderCategoryButtons()}
            </View>
            <TextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholder="Enter Title"
              right={<TextInput.Affix text="*" />}
            />
            <TextInput
              label="Price"
              value={price}
              onChangeText={setPrice}
              style={styles.input}
              placeholder="e.g. 50, TBD, Contact for more info"
              right={<TextInput.Affix text="*" />}
            />
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              multiline
              placeholder="Enter Description"
            />
            <TextInput
              label="Services Offered & Prices"
              value={services.join('\n')}
              onChangeText={text => setServices(text.split('\n'))}
              style={styles.input}
              multiline
              placeholder="Enter Services and Prices"
              right={<TextInput.Affix text="*" />}
            />
            <TextInput
              label="Service Hours"
              value={serviceHours}
              onChangeText={setServiceHours}
              style={styles.input}
              placeholder="e.g. 9am - 5pm"
            />
            <Button
              mode="contained"
              buttonColor={theme.colors.primary}
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
