import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Button } from 'react-native-paper';

export default function Map() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const mapRef = useRef(null);

  const defaultLocation = {
    latitude: 51.0447,
    longitude: 114.0719,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setLoading(false);
      },
      error => {
        Alert.alert(
          'Error',
          `Failed to get your location: ${error.message}` +
          ' Make sure your location is enabled.',
        );
        setLocation(defaultLocation);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
          } else {
            Alert.alert(
              'Permission Denied',
              'Location permission is required to show your current location on the map.',
            );
            setLocation(defaultLocation);
            setLoading(false);
          }
        } catch (err) {
          console.warn(err);
          setLocation(defaultLocation);
          setLoading(false);
        }
      } else {
        getCurrentLocation();
      }
    };

    requestLocationPermission();
  }, []);

  const updateMapRegion = (latitude, longitude) => {
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.122,
      longitudeDelta: 0.0421,
    };
    setLocation(newRegion);
    mapRef.current.animateToRegion(newRegion, 1000);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation={true}
            region={location || defaultLocation}
          >
            {location && (
              <Marker
                coordinate={location}
              />
            )}
          </MapView>
          <View style={styles.SearchContainer}>
            <GooglePlacesAutocomplete
              placeholder="Enter Address here..."
              onPress={(data, details = null) => {
                const fullAddress = details
                  ? details.formatted_address
                  : data.description;
                const { lat, lng } = details.geometry.location;
                setAddress(fullAddress);
                updateMapRegion(lat, lng);
              }}
              query={{
                key: 'AIzaSyBMmlNExl86zceWTM0vfYKEkY1HJ-neIWk',
                language: 'en',
              }}
              styles={{
                textInput: {
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
          <View style={styles.buttonContainer}>
            <View style={styles.buttonGroup}>
              <Button
                mode="contained"
                buttonColor="#009B7D"
                onPress={() => console.log('Cancel button pressed')}>
                CANCEL
              </Button>
              <Button
                mode="contained"
                buttonColor="#FFBF5D"
                onPress={() => console.log('Set button pressed')}>
                SET
              </Button>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  SearchContainer: {
    position: 'absolute',
    top: 8,
    left: 18,
    right: 20,
    width: '75%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
