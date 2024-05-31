import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {useUser} from '../../utils/UserContext';

const categories = [
  'Grooming',
  'Walking',
  'Boarding',
  'Training',
  'Veterinary',
  'Sitting',
];

const Ad = ({navigation, route}) => {
  const theme = useTheme();
  const {createOrUpdateAd} = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pictures, setPictures] = useState([]);
  const [services, setServices] = useState([]);
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const adId = route.params?.ad?.id;

  useEffect(() => {
    if (route.params?.ad) {
      const {title, description, pictures, services, address, category} =
        route.params.ad;
      setTitle(title);
      setDescription(description);
      setPictures(pictures);
      setServices(services);
      setAddress(address);
      setCategory(category || categories[0]);
    }
  }, [route.params?.ad]);

  const saveAd = async () => {
    if (title && description && address && services.length > 0 && category) {
      const adData = {
        id: adId,
        title,
        description,
        pictures,
        services,
        address,
        category,
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
      Alert.alert('Error', 'Please fill in all fields');
    }
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
  });

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
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoriesContainer}>
          {renderCategoryButtons()}
        </View>
        <Button
          mode="contained"
          buttonColor="#FFBF5D"
          contentStyle={{width: '100%'}}
          onPress={saveAd}>
          Save Ad
        </Button>
      </View>
    </View>
  );
};

export default Ad;

// watched youtube video for firebase
// https://www.youtube.com/watch?v=2hR-uWjBAgw
