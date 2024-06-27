import { View, StyleSheet } from 'react-native';
import React, { useEffect, useRef } from 'react';
import MapView, { Circle, Marker } from 'react-native-maps';

const Map = ({ location, radius, mapDelta }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                ...mapDelta
            }, 1000); // 1 second duration for the animation
        }
    }, [location, mapDelta]);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    ...mapDelta // Use mapDelta for initial region setup
                }}
                provider='google'
            >
                <Circle
                    center={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }}
                    radius={radius/50} // dynamic radius
                    strokeWidth={1}
                    strokeColor={'#1a66ff'}
                    fillColor={'rgba(26,102,255,0.3)'}
                />
                <Circle
                    center={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }}
                    radius={radius} // dynamic radius
                    strokeWidth={1}
                    strokeColor={'#1a66ff'}
                    fillColor={'rgba(26,102,255,0.3)'}
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 350,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default Map;
