import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import Map from './Map';

const MapContainer = () => {
  return (
    <Card style={styles.container}>
      <Map />
      <Card.Content>
        <Text variant="titleLarge">Current Location</Text>
        <Text variant="bodyMedium"></Text>
      </Card.Content>
      <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 400,
    borderRadius: 10
  }
});

export default MapContainer;
