import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import MapView from 'react-native-maps'

const Map = () => {
    const initialLocation = {
        latitude: 54.0486,
        longitude: -114.0708,
    }
    const [myLocation, setMyLocation] = useState(initialLocation)

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: myLocation.latitude,
                    longitude: myLocation.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
                provider={null}
            >

            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    map: {
        width: '100%',
        height: '100%',
    }
})

export default Map