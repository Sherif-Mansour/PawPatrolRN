import { View, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import MapView from 'react-native-maps';

const Map = () => {
    const initialLocation = {
        latitude: 54.0486,
        longitude: -114.0708,
    };
    const [myLocation, setMyLocation] = useState(initialLocation);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: myLocation.latitude,
                    longitude: myLocation.longitude,
                    latitudeDelta: 1.0,
                    longitudeDelta: 0.0421
                }}
                provider='google'
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 350, // Define a fixed height for the map
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default Map;
