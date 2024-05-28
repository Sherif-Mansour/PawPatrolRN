
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  View,
  Text,
  ScrollView,
  Image,
  Button,
  Dimensions,
} from 'react-native';

const BookingScreen = () => {
  return (
    <SafeAreaProvider>
      <ScrollView>
        <>
          <View>
            <Text style={{fontSize: 32, color: 'black'}}> Bookings </Text>
          </View>
          <View
            style={{
              margin: 16,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: 370,
              height: 250,
              borderColor: 'black',
              borderRadius: 10,
              borderWidth: 1,
            }}>
            <Text>🐕‍🦺</Text>
            <Text style={{}}>No Bookings Yet</Text>
            <Text style={{margin: 10}}>
              Time to find some lovely services for your pets
            </Text>
            <Button title="Start searching" color={'green'} />
          </View>
          <View style={{marginTop: 40, marginLeft: 10}}>
            <Text style={{fontSize: 24, color: 'black'}}>Booking History</Text>
          </View>
          <View>
            <View style={{margin: 10}}>
              <Text>Service Name: dfdfddfd</Text>
              <Text>name: John </Text>
              <Text>Date: </Text>
            </View>

            <View style={{margin: 10}}>
              <Text>Service Name: dfdfdfdfd</Text>
              <Text>name: John </Text>
              <Text>Date: </Text>
            </View>

            <View style={{margin: 10}}>
              <Text>Service Name: dfdfdfdfd</Text>
              <Text>name: John </Text>
              <Text>Date: </Text>
            </View>
          </View>
        </>
      </ScrollView>

  
    </SafeAreaProvider>
  );
};

export default BookingScreen;

