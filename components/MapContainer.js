import * as React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import Map from './Map';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useState } from 'react';

const MapContainer = () => {
  const [address, setAddress] = useState('');
  const [selected, setSelected] = useState(false);
  const [location, setLocation] = useState({
    latitude: 51.0447,
    longitude: -114.0719,
  });
  const [mapDelta, setMapDelta] = useState({
    latitudeDelta: 0.6,
    longitudeDelta: 0.0421,
  });
  const [radius, setRadius] = useState(20000); // Default radius in meters

  const getMapDeltaForPlaceType = (types) => {
    if (types.includes('locality')) {
      return {
        latitudeDelta: 0.6,
        longitudeDelta: 0.0421,
      };
    } else if (types.includes('postal_code')) {
      return {
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    } else {
      return {
        latitudeDelta: 0.0622,
        longitudeDelta: 0.0421,
      };
    }
  };


  const getRadiusForPlaceType = (types) => {
    if (types.includes('locality')) {
      return 20000; // City radius
    } else if (types.includes('postal_code')) {
      return 2500; // Postal code radius
    } else {
      return 1000; // Address radius
    }
  };

  const handlePlaceSelect = (data, details = null) => {
    const fullAddress = details ? details.formatted_address : data.description;
    const coordinates = details
      ? {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
        }
      : {
          latitude: 51.0447, // Default latitude
          longitude: -114.0719, // Default longitude
        };
    const placeTypes = details ? details.types : [];
    const calculatedRadius = getRadiusForPlaceType(placeTypes);
    const calculatedDelta = getMapDeltaForPlaceType(placeTypes);

    setAddress(fullAddress);
    setLocation(coordinates);
    setRadius(calculatedRadius);
    setMapDelta(calculatedDelta);
    setSelected(true);

    console.log('Selected address:', fullAddress);
    console.log('Coordinates:', coordinates);
    console.log('Radius:', calculatedRadius);
  };


  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {!selected && (
        <View style={styles.mapContainer}>
          <Map location={location} radius={radius} mapDelta={mapDelta} />
        </View>
      )}
      <View style={styles.inputContainer}>
      <GooglePlacesAutocomplete
          placeholder="Search for an address"
          onPress={handlePlaceSelect}
          query={{
            key: 'AIzaSyBMmlNExl86zceWTM0vfYKEkY1HJ-neIWk',
            language: 'en',
          }}
          styles={{
            textInput: styles.input,
            container: {
              flex: 0,
              position: 'absolute',
              top: 10,
              width: '100%',
              zIndex: 1
            },
            listView: {
              position: 'absolute',
              top: 60,
              backgroundColor: 'white',
              width: '100%',
              zIndex: 2
            }
          }}
          fetchDetails={true}
          textInputProps={{
            value: address,
            onChangeText: text => {
              setAddress(text);
              setSelected(false);
            },
          }}
          debounce={200}
          enablePoweredByContainer={false}
          keyboardShouldPersistTaps="always"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  mapContainer: {
    width: '100%',
    height: '70%', // Adjust the height as needed
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    zIndex: 1,
  },
  input: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default MapContainer;
